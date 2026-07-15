import { expect, test } from '@playwright/test'

import {
  cleanupMutationTestRecords,
  mutationTestPrefix,
  requireMutationTestsEnabled,
  type MutationTestRecords,
} from './support/mutation-test-data'

const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
const personName = `${mutationTestPrefix} Person ${runId}`
const personEmail = `pw-e2e-${runId}@example.test`
const petName = `${mutationTestPrefix} Pet ${runId}`
const caseSubject = `${mutationTestPrefix} Case ${runId}`
const noteBody = `${mutationTestPrefix} internal note ${runId}`
const createdRecords: MutationTestRecords = {}

const createdRecordPathPatterns = {
  people: /^\/admin\/people\/(person-\d+)$/,
  pets: /^\/admin\/pets\/(pet-\d+)$/,
  cases: /^\/admin\/cases\/(FH-\d{4}-\d{4})$/,
} as const

const getCreatedRecordId = (
  url: string,
  segment: keyof typeof createdRecordPathPatterns,
) => {
  const pathname = new URL(url).pathname
  const match = createdRecordPathPatterns[segment].exec(pathname)

  if (!match?.[1]) {
    throw new Error(
      `Expected a created ${segment} detail URL, but received ${pathname}.`,
    )
  }

  return match[1]
}

const expectCreatedRecordUrl = async (
  page: import('@playwright/test').Page,
  segment: keyof typeof createdRecordPathPatterns,
) => {
  const pathPattern = createdRecordPathPatterns[segment]

  await page.waitForURL((url) => pathPattern.test(url.pathname), {
    timeout: 20_000,
  })

  return getCreatedRecordId(page.url(), segment)
}

test.describe.serial('authenticated admin mutation smoke tests', () => {
  test.describe.configure({ timeout: 60_000 })
  test.beforeAll(() => {
    requireMutationTestsEnabled()
  })

  test.afterAll(async () => {
    await cleanupMutationTestRecords(createdRecords)
  })

  test('creates a person through the admin UI', async ({ page }) => {
    await page.goto('/admin/people/new')

    await page
      .getByRole('textbox', { name: 'Full name', exact: true })
      .fill(personName)
    await page
      .getByRole('textbox', { name: 'Email', exact: true })
      .fill(personEmail)
    await page
      .getByRole('textbox', { name: 'Phone', exact: true })
      .fill('+1 555 0109')
    await page
      .getByPlaceholder('high_intent, event_lead, follow_up')
      .fill(`${mutationTestPrefix.toLowerCase()}, automated_test`)
    await page.getByRole('button', { name: 'Create person' }).click()

    createdRecords.personId = await expectCreatedRecordUrl(page, 'people')
    await expect(
      page.getByRole('heading', { name: 'Contact profile', level: 2 }),
    ).toBeVisible()
    await expect(page.getByText(personEmail, { exact: true })).toBeVisible()
  })


  test('edits the created person profile', async ({ page }) => {
    if (!createdRecords.personId) {
      throw new Error('The person creation test did not provide a person id.')
    }

    const updatedPhone = '+1 555 0110'

    await page.goto(`/admin/people/${createdRecords.personId}`)
    await page.getByRole('button', { name: 'Edit profile' }).click()
    await page
      .getByRole('textbox', { name: 'Phone', exact: true })
      .fill(updatedPhone)
    await page.getByRole('button', { name: 'Save changes' }).click()

    await expect(page.getByText('Contact profile saved.', { exact: true })).toBeVisible()
    await expect(
      page.getByText(updatedPhone, { exact: true }).filter({ visible: true }).first(),
    ).toBeVisible()
  })

  test('creates a draft pet through the admin UI', async ({ page }) => {
    await page.addInitScript(() => window.sessionStorage.clear())
    await page.goto('/admin/pets/new')

    await page.getByPlaceholder('e.g. Daisy').fill(petName)
    await page
      .getByPlaceholder(
        "Write a warm, useful profile summary. Include the pet's background, personality, daily needs, health, and what kind of home would suit them.",
      )
      .fill(
        'Automated Playwright test pet used to verify the admin creation flow and cleanup.',
      )
    await page.getByRole('button', { name: 'Save as draft' }).click()

    createdRecords.petId = await expectCreatedRecordUrl(page, 'pets')
    await expect(
      page.getByRole('heading', { name: petName, level: 1 }),
    ).toBeVisible()
  })


  test('edits the created pet profile', async ({ page }) => {
    if (!createdRecords.petId) {
      throw new Error('The pet creation test did not provide a pet id.')
    }

    const updatedDescription =
      'Updated by Playwright to verify that pet profile edits are persisted through the admin UI.'

    await page.goto(`/admin/pets/${createdRecords.petId}`)
    await page
      .getByRole('textbox', { name: 'Description', exact: true })
      .fill(updatedDescription)
    await page.getByRole('button', { name: 'Save changes' }).click()

    await expect(page.getByText('Pet profile saved.', { exact: true })).toBeVisible()
    await expect(
      page.getByRole('textbox', { name: 'Description', exact: true }),
    ).toHaveValue(updatedDescription)
  })

  test('creates a general case linked to the test person', async ({ page }) => {
    await page.goto('/admin/cases/new')

    const personSearch = page.getByPlaceholder(
      'Start typing, e.g. Mia Green, mia@example.com, +1 555...',
    )
    await personSearch.fill(personEmail)
    await page.getByRole('button', { name: new RegExp(personName) }).click()

    await page
      .getByRole('combobox', { name: 'Type / topic', exact: true })
      .selectOption('general_question')
    await page
      .getByPlaceholder("e.g. Question about Luna's adoption process")
      .fill(caseSubject)
    await page
      .getByPlaceholder(
        'Summarize what the contact asked, reported, or requested. Do not paste the full email or call transcript.',
      )
      .fill(
        'Automated Playwright case creation smoke test for the authenticated admin workflow.',
      )
    await page.getByRole('button', { name: 'Generate preview' }).click()
    await page.getByRole('button', { name: 'Create case' }).click()

    createdRecords.caseId = await expectCreatedRecordUrl(page, 'cases')
    await expect(page.getByText(personName, { exact: true }).first()).toBeVisible()
  })


  test('updates case status and schedules a follow-up', async ({ page }) => {
    if (!createdRecords.caseId) {
      throw new Error('The case creation test did not provide a case id.')
    }

    const followUpNote = `${mutationTestPrefix} follow-up ${runId}`

    await page.goto(`/admin/cases/${createdRecords.caseId}`)
    await page.getByRole('button', { name: 'Manage case' }).click()

    const manageCaseHeading = page.getByRole('heading', {
      name: 'Manage case',
      level: 2,
    })
    await expect(manageCaseHeading).toBeVisible()

    await page
      .getByRole('combobox', { name: 'Status', exact: true })
      .selectOption('waiting_on_staff')
    await page.getByRole('button', { name: 'Tomorrow' }).click()
    await page
      .getByPlaceholder('What should staff check or do next?')
      .fill(followUpNote)
    await page.getByRole('button', { name: 'Save case' }).click()

    await expect(manageCaseHeading).toBeHidden()
    await expect(page.getByText('Waiting On Staff', { exact: true }).first()).toBeVisible()
    await expect(page.getByText('Not scheduled', { exact: true })).toHaveCount(0)

    await page.goto('/admin/tasks')
    await page
      .getByPlaceholder(
        'Search by subject, person, pet, note, type, priority, or case ID...',
      )
      .fill(followUpNote)
    await expect(
      page.getByText(followUpNote, { exact: true }).filter({ visible: true }).first(),
    ).toBeVisible()
  })

  test('publishes and unpublishes the created pet', async ({ page }) => {
    if (!createdRecords.petId) {
      throw new Error('The pet creation test did not provide a pet id.')
    }

    await page.goto(`/admin/pets/${createdRecords.petId}`)

    const imageUrlInput = page.getByRole('textbox', {
      name: 'Existing image URL or local path',
      exact: true,
    })

    if ((await imageUrlInput.inputValue()).trim().length === 0) {
      await imageUrlInput.fill('/placeholder-user.jpg')
    }

    await page.getByRole('button', { name: 'Save and publish' }).click()

    await expect(page.getByText('Listing: Visible · Status: Published', { exact: true })).toBeVisible({
      timeout: 15_000,
    })
    await expect(page.getByRole('button', { name: 'Unpublish' })).toBeEnabled()

    await page.getByRole('button', { name: 'Unpublish' }).click()

    await expect(page.getByText('Listing: Hidden · Status: Draft', { exact: true })).toBeVisible({
      timeout: 15_000,
    })
    await expect(page.getByRole('button', { name: 'Unpublish' })).toBeDisabled()
  })

  test('adds an internal note to the created case', async ({ page }) => {
    if (!createdRecords.caseId) {
      throw new Error('The case creation test did not provide a case id.')
    }

    await page.goto(`/admin/cases/${createdRecords.caseId}`)
    await page
      .getByPlaceholder(
        'Write a staff-only note about follow-up, screening, adopter context, or next steps...',
      )
      .fill(noteBody)
    await page.getByRole('button', { name: 'Add new note' }).click()

    await expect(page.getByText(noteBody, { exact: true }).first()).toBeVisible({
      timeout: 15_000,
    })
  })
})
