import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  timeout: 30000,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html', { outputFolder: 'reports' }]],
  use: {
    trace: 'on-first-retry',
    headless: false,
    baseURL: 'https://platformnex-v2-frontend-qa1-pyzx2jrmda-uc.a.run.app', // Base URL for your application
    screenshot: 'on',
    video: 'retain-on-failure',
  },
});