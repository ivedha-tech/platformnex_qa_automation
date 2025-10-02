import { test, expect } from "@playwright/test";
import { MainPage } from "../../pages/MainPage";
import { LoginPage } from "../../pages/LoginPage";
import { SrePage } from "../../pages/SrePage";
import loadYamlData from "../../utils/yamlHelper";

let mainPage: MainPage;
let loginPage: LoginPage;
let srePage: SrePage;

const testData: any = loadYamlData("src/utils/testData.yaml");

test.setTimeout(180000);

test.beforeEach(async ({ page }) => {
  mainPage = new MainPage(page);
  loginPage = new LoginPage(page);
  srePage = new SrePage(page);

  // Login
  await mainPage.navigateToHomePage();
  await mainPage.openLoginPage();
  await loginPage.login(
    testData.login.valid.email,
    testData.login.valid.password
  );

  // Navigate to Applications and open app
  await page
    .getByRole("complementary")
    .getByRole("link", { name: "Applications" })
    .click();

  await page.goto(
    "https://platformnex-v2-frontend-qa1-pyzx2jrmda-uc.a.run.app/applications"
  );

  await page
    .locator('[data-test-id="overlay"]')
    .waitFor({ state: "hidden", timeout: 30000 })
    .catch(() => {});

  const appCard = page.getByText("dnsRegression-testOwned by:").first();
  await appCard.waitFor({ state: "visible", timeout: 20000 });
  await appCard.click();
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(3000); // Wait 3s for app to fully load
});

// ---------- Cloud Run Update + Tabs Verification ----------
test("SRE - Update Cloud Run and Verify Tabs", async () => {
  await srePage.openSre();

  // Update Cloud Run form from testData.yaml
  //await srePage.updateCloudRun(testData.sre.cloudrun);

  // Refresh after update
  //await srePage.refreshPage();

  // Verify Overview tab
  await srePage.selectOverviewTab();
  await expect(srePage.dashboardTitle).toBeVisible();
  await expect(srePage.latencyPanel).toBeVisible();
  await expect(srePage.errorRatePanel).toBeVisible();

  // Verify Logs tab
  await srePage.selectLogsTab();
  //await expect(srePage.logsLevelButton).toBeVisible();
  await expect(srePage.logsTimeButton).toBeVisible();

  // Verify Resources tab
  await srePage.selectResourcesTab();
  await expect(srePage.resourcesTable).toBeVisible();
});
