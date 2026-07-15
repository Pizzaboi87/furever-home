import { expect, test, type Page, type Request } from '@playwright/test'

type CapturedJsonRequest = {
  request: Request
  payload: Record<string, unknown>
}

const captureJsonRequest = async (request: Request): Promise<CapturedJsonRequest> => ({
  request,
  payload: request.postDataJSON() as Record<string, unknown>,
})


type PublicPetSummary = {
  id: string
  name: string
  status: string
}

const getPublicPet = async (
  page: Page,
  options: { adoptable?: boolean } = {},
): Promise<PublicPetSummary> => {
  const response = await page.request.post('/api/graphql', {
    data: {
      query: `
        query PublicWorkflowPets {
          pets {
            id
            name
            status
          }
        }
      `,
    },
  })

  expect(response.ok()).toBeTruthy()

  const payload = (await response.json()) as {
    data?: { pets?: PublicPetSummary[] }
    errors?: Array<{ message: string }>
  }

  expect(payload.errors).toBeUndefined()

  const pet = payload.data?.pets?.find((candidate) =>
    options.adoptable ? ['available', 'new'].includes(candidate.status) : true,
  )

  if (!pet) {
    throw new Error(
      options.adoptable
        ? 'No publicly adoptable pet is available for the workflow test.'
        : 'No public pet is available for the workflow test.',
    )
  }

  return pet
}

const openPetActionModal = async (
  page: Page,
  options: { buttonName: string; headingName: string },
) => {
  const button = page.getByRole('button', { name: options.buttonName })
  const heading = page.getByRole('heading', { name: options.headingName })

  await expect(button).toBeVisible()
  await expect(button).toBeEnabled()

  await expect
    .poll(
      async () => {
        if (await heading.isVisible()) {
          return true
        }

        await button.click()
        return heading.isVisible()
      },
      { timeout: 15_000 },
    )
    .toBe(true)
}

const fillBasicInquiryFields = async (
  page: Page,
  options: { message: string; includeAvailability?: boolean },
) => {
  await page.getByPlaceholder('John Doe').fill('Playwright Visitor')
  await page.getByPlaceholder('john@example.com').fill('playwright@example.test')

  if (options.includeAvailability) {
    await page
      .getByPlaceholder('Weekends, events, fostering, admin support...')
      .fill('Saturday mornings and shelter events')
  }

  const messageField = page.locator('textarea:visible')
  await messageField.fill(options.message)
}

test.describe('public user workflows', () => {
  test('filters browse results by category and restores them with reset', async ({ page }) => {
    await page.goto('/browse')

    const resultSummary = page.getByText(/^Showing \d+ pets?$/)
    await expect(resultSummary).toBeVisible()

    const initialCount = Number((await resultSummary.textContent())?.match(/\d+/)?.[0] ?? 0)
    expect(initialCount).toBeGreaterThan(0)

    const categoryButton = page
      .locator('aside button[aria-pressed]')
      .filter({ hasText: /^Cat$/ })

    await expect(categoryButton).toBeVisible()
    await categoryButton.click()

    await expect(categoryButton).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByText('1 active', { exact: true })).toBeVisible()

    await expect
      .poll(async () => Number((await resultSummary.textContent())?.match(/\d+/)?.[0] ?? -1))
      .toBeLessThanOrEqual(initialCount)

    await page.getByRole('button', { name: 'Reset Filters' }).click()
    await expect(page.getByText('1 active', { exact: true })).toHaveCount(0)
    await expect(resultSummary).toContainText(String(initialCount))
  })

  test('submits the volunteer form with the expected public inquiry payload', async ({ page }) => {
    let captured: CapturedJsonRequest | undefined

    await page.route('**/api/contact', async (route) => {
      captured = await captureJsonRequest(route.request())
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      })
    })

    await page.goto('/volunteer')
    await page.getByRole('button', { name: 'Apply to Volunteer' }).click()
    await expect(page.getByRole('heading', { name: 'Volunteer Application' })).toBeVisible()

    await fillBasicInquiryFields(page, {
      message: 'I would like to help with weekend adoption events.',
      includeAvailability: true,
    })
    await page.getByRole('button', { name: 'Submit Volunteer Application' }).click()

    await expect(page.getByRole('heading', { name: 'Application Sent!' })).toBeVisible()
    expect(captured?.request.method()).toBe('POST')
    expect(captured?.payload).toMatchObject({
      source: 'volunteer',
      name: 'Playwright Visitor',
      email: 'playwright@example.test',
      subject: 'Volunteer application',
      availability: 'Saturday mornings and shelter events',
    })
  })

  test('shows a server error returned by the public contact endpoint', async ({ page }) => {
    await page.route('**/api/contact', async (route) => {
      await route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Email delivery is temporarily unavailable.' }),
      })
    })

    await page.goto('/about')
    await page.getByRole('button', { name: 'Contact Us' }).click()
    await expect(page.getByRole('heading', { name: 'Contact Us' })).toBeVisible()

    await fillBasicInquiryFields(page, {
      message: 'Please contact me about shelter opening hours.',
    })
    await page.getByRole('button', { name: 'Send Message' }).click()

    await expect(page.getByText('Email delivery is temporarily unavailable.')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Contact Us' })).toBeVisible()
  })

  test('opens a pet detail page and submits a mocked pet question', async ({ page }) => {
    let capturedPayload: Record<string, unknown> | undefined

    await page.route('**/api/contact', async (route) => {
      capturedPayload = (await captureJsonRequest(route.request())).payload
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      })
    })

    const pet = await getPublicPet(page)
    await page.goto(`/pets/${pet.id}`, { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('heading', { name: pet.name, level: 1 })).toBeVisible()

    await openPetActionModal(page, {
      buttonName: 'I Have a Question',
      headingName: `Question about ${pet.name}`,
    })

    await fillBasicInquiryFields(page, {
      message: 'Is this pet comfortable living in an apartment?',
    })
    await page.getByRole('button', { name: 'Send Question' }).click()

    await expect(page.getByRole('heading', { name: 'Question Sent!' })).toBeVisible()
    expect(capturedPayload).toMatchObject({
      source: 'pet_question',
      petName: pet.name,
      message: 'Is this pet comfortable living in an apartment?',
    })
  })

  test('sends the selected donation amount and displays a Stripe checkout error', async ({ page }) => {
    let capturedPayload: Record<string, unknown> | undefined

    await page.route('**/api/stripe/checkout', async (route) => {
      capturedPayload = route.request().postDataJSON() as Record<string, unknown>
      await route.fulfill({
        status: 502,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Stripe Checkout is temporarily unavailable.' }),
      })
    })

    await page.goto('/donate')
    await page.getByRole('button', { name: /Monthly Monthly care/ }).click()
    await page.getByRole('button', { name: /\$50 - Guardian/ }).click()

    await expect(page.getByText('You are donating $50.00 every month.')).toBeVisible()
    await page.getByRole('button', { name: 'Continue to Secure Donation' }).click()

    await expect(page.getByText('Stripe Checkout is temporarily unavailable.')).toBeVisible()
    expect(capturedPayload).toEqual({ amount: 50, frequency: 'monthly' })
    await expect(page.getByRole('button', { name: 'Continue to Secure Donation' })).toBeEnabled()
  })

  test('blocks an empty volunteer submission before calling the contact API', async ({ page }) => {
    let requestCount = 0

    await page.route('**/api/contact', async (route) => {
      requestCount += 1
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      })
    })

    await page.goto('/volunteer')
    await page.getByRole('button', { name: 'Apply to Volunteer' }).click()

    const nameInput = page.getByPlaceholder('John Doe')
    await page.getByRole('button', { name: 'Submit Volunteer Application' }).click()

    await expect(nameInput).toBeFocused()
    expect(await nameInput.evaluate((element) => (element as HTMLInputElement).validity.valueMissing)).toBe(true)
    expect(requestCount).toBe(0)
    await expect(page.getByRole('heading', { name: 'Volunteer Application' })).toBeVisible()
  })

  test('submits a start-adoption inquiry without requiring an optional message', async ({ page }) => {
    let capturedPayload: Record<string, unknown> | undefined

    await page.route('**/api/contact', async (route) => {
      capturedPayload = route.request().postDataJSON() as Record<string, unknown>
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      })
    })

    const pet = await getPublicPet(page, { adoptable: true })
    await page.goto(`/pets/${pet.id}`, { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('heading', { name: pet.name, level: 1 })).toBeVisible()

    await openPetActionModal(page, {
      buttonName: 'Start Adoption',
      headingName: `Adopt ${pet.name}`,
    })
    await page.getByPlaceholder('John Doe').fill('Playwright Adopter')
    await page.getByPlaceholder('john@example.com').fill('adopter@example.test')
    await page.getByRole('button', { name: 'Submit Application' }).click()

    await expect(page.getByRole('heading', { name: 'Thank You!' })).toBeVisible()
    expect(capturedPayload).toMatchObject({
      source: 'start_adoption',
      name: 'Playwright Adopter',
      email: 'adopter@example.test',
      petName: pet.name,
      message: 'No additional message provided.',
    })
  })

  test('submits a virtual-adoption inquiry for the selected pet', async ({ page }) => {
    let capturedPayload: Record<string, unknown> | undefined

    await page.route('**/api/contact', async (route) => {
      capturedPayload = route.request().postDataJSON() as Record<string, unknown>
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      })
    })

    const pet = await getPublicPet(page)
    await page.goto(`/pets/${pet.id}`, { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('heading', { name: pet.name, level: 1 })).toBeVisible()

    await openPetActionModal(page, {
      buttonName: 'Virtual Adoption',
      headingName: `Virtual Adoption of ${pet.name}`,
    })
    await page.getByPlaceholder('John Doe').fill('Playwright Sponsor')
    await page.getByPlaceholder('john@example.com').fill('sponsor@example.test')
    await page
      .getByPlaceholder('Tell us why you want to virtually adopt...')
      .fill('I would love to support this pet from abroad.')
    await page.getByRole('button', { name: 'Virtually Adopt' }).click()

    await expect(page.getByRole('heading', { name: 'Thank you!!' })).toBeVisible()
    expect(capturedPayload).toMatchObject({
      source: 'virtual_adoption',
      name: 'Playwright Sponsor',
      email: 'sponsor@example.test',
      petName: pet.name,
      message: 'I would love to support this pet from abroad.',
    })
  })

  test('locks background scrolling while a public inquiry modal is open', async ({ page }) => {
    await page.goto('/volunteer')

    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('')
    await page.getByRole('button', { name: 'Apply to Volunteer' }).click()

    await expect(page.getByRole('heading', { name: 'Volunteer Application' })).toBeVisible()
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden')

    await page.getByRole('button', { name: 'Close contact form' }).click()
    await expect(page.getByRole('heading', { name: 'Volunteer Application' })).toBeHidden()
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('')
  })

  test('blocks an invalid public contact email before calling the API', async ({ page }) => {
    let requestCount = 0

    await page.route('**/api/contact', async (route) => {
      requestCount += 1
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      })
    })

    await page.goto('/about')
    await page.getByRole('button', { name: 'Contact Us' }).click()
    await page.getByPlaceholder('John Doe').fill('Invalid Email Visitor')

    const emailInput = page.getByPlaceholder('john@example.com')
    await emailInput.fill('not-an-email')
    await page.locator('textarea:visible').fill('Please contact me about shelter opening hours.')
    await page.getByRole('button', { name: 'Send Message' }).click()

    await expect(emailInput).toBeFocused()
    expect(
      await emailInput.evaluate((element) =>
        (element as HTMLInputElement).validity.typeMismatch,
      ),
    ).toBe(true)
    expect(requestCount).toBe(0)
  })

})
