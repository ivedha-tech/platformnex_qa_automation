import { test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { QuickstartPage } from '../../pages/QuickstartPage';
import { BasicInfoPage } from '../../pages/QuickStart/ThreeTier/BasicInfoPage';
import { FrontendConfigPage } from '../../pages/QuickStart/ThreeTier/FrontendConfigPage';
import { BackendConfigPage } from '../../pages/QuickStart/ThreeTier/BackendConfigPage';
import { InfrastructureConfigPage } from '../../pages/QuickStart/ThreeTier/InfrastructureConfigPage';
import { ReviewPage } from '../../pages/QuickStart/ThreeTier/ReviewPage';

test('Quickstart', async ({ page }) => {
        // 🔑 extend timeout for this test
        test.setTimeout(1200_000); // 20 minutes
      
  const loginPage = new LoginPage(page);
  const quickstartPage = new QuickstartPage(page);
  const step1 = new BasicInfoPage(page);
  const step2 = new FrontendConfigPage(page);
  const step3 = new BackendConfigPage(page);
  const step4 = new InfrastructureConfigPage(page);
  const step5 = new ReviewPage(page);

  // Step 1: Login
  await loginPage.goto();
  await loginPage.login('platformnex@ivedha.com', 'Admin@123');

  // Step 2: Navigate to Quickstart
  await quickstartPage.clickQuickstart();
  await quickstartPage.selectThreeTier();

  // Step 3-7: Fill step by step
  await step1.fillBasicInfo('automation122', 'Testing 3-tier quickstart flow', 'quests', 'platformnex');
  await step2.fillFrontendConfig('ivedha-tech', 'automation1front', 'automation1frontendservice', 'Frontend service description');
  await step3.fillBackendConfig('ivedha-tech', 'automation1back', 'autobackendservice', 'autodb234service', 'autotest345db', 'Pass@123');
  await step4.fillInfrastructureConfig('prj-dev-platform-next');
  await step5.reviewAndSubmit();
});
