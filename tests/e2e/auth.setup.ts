import { expect, test as setup, type Page } from '@playwright/test'

const authFile = 'playwright/.auth/staff.json'

const getRequiredCredential = (name: 'PLAYWRIGHT_AUTH0_EMAIL' | 'PLAYWRIGHT_AUTH0_PASSWORD') => {
  const value = process.env[name]?.trim()

  if (!value) {
    throw new Error(
      `${name} is required for authenticated admin Playwright tests. ` +
        'Use a dedicated active Auth0 staff test account.',
    )
  }

  return value
}

const submitVisibleForm = async (page: Page) => {
  const submitCandidates = page.locator(
    'button[type="submit"], button[name="action"], input[type="submit"]',
  )
  const candidateCount = await submitCandidates.count()

  for (let index = 0; index < candidateCount; index += 1) {
    const candidate = submitCandidates.nth(index)

    if (await candidate.isVisible()) {
      await candidate.click()
      return
    }
  }

  throw new Error('Auth0 login form does not contain a visible submit control.')
}

setup('authenticate active staff account', async ({ page }) => {
  const email = getRequiredCredential('PLAYWRIGHT_AUTH0_EMAIL')
  const password = getRequiredCredential('PLAYWRIGHT_AUTH0_PASSWORD')

  await page.goto('/admin/login')
  await page.getByRole('link', { name: 'Sign in to Furever CRM' }).click()

  const usernameInput = page
    .locator('input[name="username"], input[name="email"], input[type="email"]')
    .first()

  await expect(usernameInput).toBeVisible()
  await usernameInput.fill(email)

  const passwordInput = page.locator('input[name="password"], input[type="password"]').first()

  if (!(await passwordInput.isVisible())) {
    await submitVisibleForm(page)
  }

  await expect(passwordInput).toBeVisible()
  await passwordInput.fill(password)
  await submitVisibleForm(page)

  await expect(page).toHaveURL(/\/admin\/dashboard(?:\?.*)?$/, {
    timeout: 30_000,
  })

  // The setup only proves that Auth0 created a valid application session.
  // The authenticated admin project verifies the actual page content separately.
  await page.context().storageState({ path: authFile })
})
