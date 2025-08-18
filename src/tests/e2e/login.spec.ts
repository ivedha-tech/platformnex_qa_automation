// tests/e2e/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test.describe('Login Tests', () => {

  test('Valid login should navigate to dashboard', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Step 1: Navigate to login page
    await loginPage.goto();

    // Step 2: Perform login
    await loginPage.login('platformnex@ivedha.com', 'Admin@123');

    // Step 3: Verify login success
    const isLoggedIn = await loginPage.isLoggedIn();
    expect(isLoggedIn).toBeTruthy();
  });

});
