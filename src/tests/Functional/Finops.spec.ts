import { test, expect } from "@playwright/test";
import { MainPage } from "../../pages/MainPage";
import { LoginPage } from "../../pages/LoginPage";
import { OnboardingPage } from "../../pages/OnboardingPage";
import { FinopsPage } from "../../pages/FinopsPage";
import { loadYamlData } from "../../utils/ymalHelper";

let mainPage: MainPage;
let loginPage: LoginPage;
let onboardingPage: OnboardingPage;
let finopsPage: FinopsPage;

const testData: any = loadYamlData("src/utils/testData.yaml");

test.setTimeout(190000);

test.beforeEach(async ({ page }) => {
  mainPage = new MainPage(page);
  loginPage = new LoginPage(page);
  onboardingPage = new OnboardingPage(page);
  finopsPage = new FinopsPage(page);

  // ---------- Login ----------
  await mainPage.navigateToHomePage();
  await mainPage.openLoginPage();
  await loginPage.login(
    testData.login.valid.email,
    testData.login.valid.password
  );

  await page.getByRole('complementary').getByRole('link', { name: 'Applications' }).click();
  await page.goto("https://platformnex-v2-frontend-qa1-pyzx2jrmda-uc.a.run.app/applications");
  await page.getByText('dnsRegression-testOwned by:').click();
  await page.waitForLoadState("networkidle")

  // ---------- Click application ----------
  const appLink = page.getByText('dnsRegression-testOwned by:');
  await appLink.waitFor({ state: "visible", timeout: 20000 });
  await appLink.click();
  
});

// ---------- TC001: Onboard Component ----------
test("Onboard component", async () => {
    await finopsPage.onboardComponent(
      testData.component.comp.valid.compName,
      testData.component.comp.valid.description,
      testData.component.comp.valid.repoLink
    );
  });
  
 // ---------- TC002: Configure FinOps & Validate Dashboard ----------
test("Configure FinOps + Validate Dashboard + Usage Explorer", async () => {
  // navigate directly to FinOps page
  await finopsPage.page.goto("https://platformnex-v2-frontend-qa1-pyzx2jrmda-uc.a.run.app/applications/Regression-test/finops?environment=development&component=prod-test-qa");

  // Step 2: Select the same component
  
  // Select created component
    const projectName = testData.component.comp.valid.compName;
    await finopsPage.projectDropdownButton.click();
    await finopsPage.projectOption(projectName).click();
    await finopsPage.page.waitForTimeout(2000); // wait for selection to register
  // Update FinOps Config
  await finopsPage.updateFinopsConfig(
    testData.finops.gcpprojectid,
    testData.finops.gcpdatasetid,
    testData.finops.gcptableid
  );

  // Open Usage Explorer and validate
  await finopsPage.openUsageExplorer();

  // Optionally switch time range
  await finopsPage.switchTimeRange("Last Month");

  // (Optional) If you want to log spend + savings
  // await finopsPage.validateSpendAndSavings();
});
