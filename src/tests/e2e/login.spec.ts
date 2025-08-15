import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test('User can log in', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await loginPage.login('testuser', 'password123');

  const isLoggedIn = await loginPage.isLoggedIn();
  expect(isLoggedIn).toBe(true);
});