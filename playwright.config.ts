import { defineConfig } from '@playwright/test';
import monocart from 'monocart-reporter';

export default defineConfig({
  testDir: './src/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  timeout: 180000,
  expect: {
    timeout: 10000,
  },
  retries: process.env.CI ? 2 : 0,
  reporter: [
    ['list'], // keep console output
    ['monocart-reporter', {
      outputFile: 'reports/test-report.html',  // HTML report location
      outputDir: 'reports',                   // directory for all artifacts
      inlineAssets: true,                     // self-contained HTML file
      name: 'PlatformNEX Automation Report',
    }]
  ],
  use: {
    trace: 'on-first-retry',
    headless: false,
    baseURL: 'https://platformnex-v2-frontend-qa1-pyzx2jrmda-uc.a.run.app', // Base URL for your application
    screenshot: 'on',
    video: 'retain-on-failure',
    actionTimeout: 30000,
    navigationTimeout: 60000,
  },
});