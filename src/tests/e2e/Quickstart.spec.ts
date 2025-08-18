import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
// Ensure the correct path to QuickstartPage is used
import { QuickstartPage } from '../../pages/QuickstartPage';

test('Quickstart 3-Tier App flow', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const quickstartPage = new QuickstartPage(page);

  // Step 1: Login
  await loginPage.goto();
  await loginPage.login('your_username', 'your_password');
  expect(await loginPage.isLoggedIn()).toBeTruthy();

  // Step 2: Go to Quickstart directly
  await quickstartPage.gotoQuickstart();

  // Step 3: Choose 3-Tier App
  await quickstartPage.chooseThreeTierApp();

  // Step 4: Fill Basic Info
  await quickstartPage.fillBasicInfo('TestApp', 'Automated test deployment');

  // Step 5: Next steps
  await quickstartPage.proceedNextSteps();
  await quickstartPage.proceedNextSteps();

  // Step 6: Run
  await quickstartPage.runApp();
});
