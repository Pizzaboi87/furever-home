import { expect, test } from '@playwright/test'

type AdminRouteExpectation = {
  path: string
  heading: string
}

const adminRoutes: AdminRouteExpectation[] = [
  { path: '/admin/dashboard', heading: 'Operations Dashboard' },
  { path: '/admin/cases', heading: 'Manage Cases' },
  { path: '/admin/pets', heading: 'Manage Pets' },
  { path: '/admin/people', heading: 'Manage People' },
  { path: '/admin/tasks', heading: 'Manage Tasks' },
]

test.describe('authenticated admin read-only smoke tests', () => {
  for (const route of adminRoutes) {
    test(`${route.path} loads for an active staff account`, async ({ page }) => {
      test.setTimeout(60_000)
      await page.goto(route.path, {
        waitUntil: 'domcontentloaded',
        timeout: 45_000,
      })

      await expect(page).toHaveURL(new RegExp(`${route.path}(?:\\?.*)?$`))
      await expect(
        page.getByRole('heading', { name: route.heading, level: 1 }),
      ).toBeVisible({ timeout: 30_000 })
      await expect(page.getByText('Furever Home Admin', { exact: true })).toBeVisible()
      await expect(page.getByRole('link', { name: 'Log out' })).toBeVisible()
    })
  }

  test('new person form keeps creation disabled until a valid name is entered', async ({ page }) => {
    await page.goto('/admin/people/new')

    const createButton = page.getByRole('button', { name: 'Create person' })
    const nameInput = page.getByRole('textbox', { name: 'Full name', exact: true })

    await expect(createButton).toBeDisabled()
    await nameInput.fill('A')
    await expect(createButton).toBeDisabled()
    await nameInput.fill('Valid Test Person')
    await expect(createButton).toBeEnabled()
  })

  test('new pet form loads both draft and publish actions without submitting', async ({ page }) => {
    await page.addInitScript(() => window.sessionStorage.clear())
    await page.goto('/admin/pets/new')

    await expect(page.getByPlaceholder('e.g. Daisy')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Save as draft' })).toBeEnabled()
    await expect(page.getByRole('button', { name: 'Publish pet' })).toBeEnabled()
  })

  test('pet deletion requires the exact pet name before enabling the action', async ({ page }) => {
    await page.goto('/admin/pets')

    const firstPetLink = page.locator('a[href^="/admin/pets/pet-"]:visible').first()
    await expect(firstPetLink).toBeVisible()
    const petHref = await firstPetLink.getAttribute('href')

    expect(petHref).toMatch(/^\/admin\/pets\/pet-\d+$/)
    await page.goto(petHref ?? '/admin/pets', { waitUntil: 'domcontentloaded' })
    await expect(page).toHaveURL(/\/admin\/pets\/pet-\d+$/)

    const confirmationInput = page.getByRole('textbox', {
      name: 'Type the pet name to confirm',
      exact: true,
    })
    const deleteButton = page.getByRole('button', { name: 'Delete pet' })
    const exactName = await confirmationInput.getAttribute('placeholder')

    expect(exactName).toBeTruthy()
    await expect(deleteButton).toBeDisabled()
    await confirmationInput.fill('incorrect confirmation')
    await expect(deleteButton).toBeDisabled()
    await confirmationInput.fill(exactName ?? '')
    await expect(deleteButton).toBeEnabled()
  })

  test('GDPR anonymization requires the exact current name before enabling the action', async ({ page }) => {
    await page.goto('/admin/people')

    const firstPersonLink = page.locator('a[href^="/admin/people/person-"]:visible').first()
    await expect(firstPersonLink).toBeVisible()
    const personHref = await firstPersonLink.getAttribute('href')

    expect(personHref).toMatch(/^\/admin\/people\/person-\d+$/)
    await page.goto(personHref ?? '/admin/people', {
      waitUntil: 'domcontentloaded',
      timeout: 45_000,
    })
    await expect(page).toHaveURL(/\/admin\/people\/person-\d+$/)

    const confirmationInput = page.getByRole('textbox', {
      name: 'Type current name to confirm',
      exact: true,
    })
    const anonymizeButton = page.getByRole('button', {
      name: 'Anonymize personal data',
    })
    const exactName = await confirmationInput.getAttribute('placeholder')

    expect(exactName).toBeTruthy()
    await expect(anonymizeButton).toBeDisabled()
    await confirmationInput.fill('incorrect confirmation')
    await expect(anonymizeButton).toBeDisabled()
    await confirmationInput.fill(exactName ?? '')
    await expect(anonymizeButton).toBeEnabled()
  })

  test('mobile admin menu exposes sign-out and navigates to Tasks', async ({ page }) => {
    test.setTimeout(60_000)
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/admin/dashboard', {
      waitUntil: 'domcontentloaded',
      timeout: 45_000,
    })

    await page.getByRole('button', { name: 'Toggle admin menu' }).click()
    await expect(page.getByText('Sign-out', { exact: true })).toBeVisible()

    await page.getByRole('link', { name: 'Tasks', exact: true }).click()
    await expect(page).toHaveURL(/\/admin\/tasks$/)
    await expect(
      page.getByRole('heading', { name: 'Manage Tasks', level: 1 }),
    ).toBeVisible({ timeout: 30_000 })
  })

})
