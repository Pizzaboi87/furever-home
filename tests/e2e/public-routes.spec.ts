import { expect, test } from '@playwright/test'

type PublicRouteExpectation = {
  path: string
  heading: string
}

const publicRoutes: PublicRouteExpectation[] = [
  { path: '/', heading: 'Find Your Furever Friend' },
  { path: '/browse', heading: 'Browse All Pets' },
  { path: '/about', heading: 'About Furever Home' },
  { path: '/volunteer', heading: 'Volunteer With Us' },
  { path: '/donate', heading: 'Support Our Mission' },
]

test.describe('public route smoke tests', () => {
  for (const route of publicRoutes) {
    test(`${route.path} renders its main heading`, async ({ page }) => {
      const response = await page.goto(route.path)

      expect(response?.ok()).toBeTruthy()
      await expect(page.getByRole('heading', { name: route.heading, level: 1 })).toBeVisible()
    })
  }

  test('unknown route renders the custom 404 page', async ({ page }) => {
    const response = await page.goto('/this-route-does-not-exist')

    expect(response?.status()).toBe(404)
    await expect(page.getByRole('heading', { name: 'This page got chewed.' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Back to Home' })).toHaveAttribute('href', '/')
    await expect(page.getByRole('link', { name: 'Browse Pets' })).toHaveAttribute('href', '/browse')
  })
})
