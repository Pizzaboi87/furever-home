import { defineConfig, devices } from '@playwright/test'
import { config as loadEnv } from 'dotenv'

loadEnv({ path: '.env.playwright.local', quiet: true })
loadEnv({ path: '.env.local', quiet: true })
loadEnv({ path: '.env', quiet: true })

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000'
const shouldStartLocalServer = !process.env.PLAYWRIGHT_BASE_URL
const authStatePath = 'playwright/.auth/staff.json'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },
  expect: {
    timeout: 10_000,
  },
  projects: [
    {
      name: 'chromium',
      testIgnore: [
        /auth\.setup\.ts/,
        /authenticated-admin\.spec\.ts/,
        /authenticated-admin-mutations\.spec\.ts/,
      ],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'auth-setup',
      testMatch: /auth\.setup\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'authenticated-admin',
      testMatch: /authenticated-admin\.spec\.ts/,
      dependencies: ['auth-setup'],
      // These tests query the remote Aiven database through the local Next.js
      // development server. Running all admin pages at once overloads that
      // shared path and creates navigation timeouts unrelated to UI behavior.
      fullyParallel: false,
      use: {
        ...devices['Desktop Chrome'],
        storageState: authStatePath,
      },
    },
    {
      name: 'authenticated-admin-mutations',
      testMatch: /authenticated-admin-mutations\.spec\.ts/,
      dependencies: ['auth-setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: authStatePath,
      },
    },
  ],
  webServer: shouldStartLocalServer
    ? {
        command: 'npm run dev -- --hostname localhost --port 3000',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      }
    : undefined,
})
