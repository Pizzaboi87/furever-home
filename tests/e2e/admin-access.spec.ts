import { expect, test } from '@playwright/test'

const protectedAdminRoutes = [
  '/admin',
  '/admin/dashboard',
  '/admin/cases',
  '/admin/pets',
  '/admin/people',
  '/admin/tasks',
]

test.describe('admin access protection', () => {
  for (const route of protectedAdminRoutes) {
    test(`${route} redirects unauthenticated users to the staff login`, async ({ page }) => {
      await page.goto(route)

      await expect(page).toHaveURL(/\/admin\/login$/)
      await expect(page.getByRole('heading', { name: 'Sign in', level: 2 })).toBeVisible()
      await expect(page.getByRole('link', { name: 'Sign in to Furever CRM' })).toBeVisible()
    })
  }
})
