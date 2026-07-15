import { expect, test } from '@playwright/test'

test.describe('public mobile navigation', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('opens the mobile menu and navigates to About', async ({ page }) => {
    await page.goto('/')

    const menuButton = page.getByRole('button', { name: 'Toggle navigation menu' })
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false')

    await menuButton.click()

    await expect(menuButton).toHaveAttribute('aria-expanded', 'true')
    await page.getByRole('link', { name: 'About', exact: true }).click()

    await expect(page).toHaveURL(/\/about$/)
    await expect(page.getByRole('heading', { name: 'About Furever Home', level: 1 })).toBeVisible()
  })
})
