import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests',
  timeout: 30000,
  retries: 2,
  reporter: [['html', { outputFolder: 'reports' }]],
  use: {
    headless: true,
    baseURL: 'https://platformnex.example.com', // Base URL for your application
    screenshot: 'on',
    video: 'retain-on-failure',
  },
});