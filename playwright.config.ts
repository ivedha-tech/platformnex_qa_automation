import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests',
  timeout: 30000,
  retries: 2,
  reporter: [['html', { outputFolder: 'reports' }]],
  use: {
    headless: false,
    baseURL: 'https://platformnex-v2-frontend-qa1-pyzx2jrmda-uc.a.run.app', // Base URL for your application
    screenshot: 'on',
    video: 'retain-on-failure',
  },
});