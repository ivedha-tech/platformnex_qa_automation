import { defineConfig } from '@playwright/test';
import monocart from 'monocart-reporter';

export default defineConfig({
  testDir: './src/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  timeout: 30000,
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
    headless: process.env.HEADLESS !== 'false', // Default to true, set to 'false' to run in headed mode
    baseURL: process.env.BASE_URL, // Base URL for your application - must be set via environment variable
    screenshot: 'on',
    video: 'retain-on-failure',
  },
});