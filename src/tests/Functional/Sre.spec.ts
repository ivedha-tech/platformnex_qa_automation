import { test } from "@playwright/test";
import { MainPage } from "../../pages/MainPage";
import { LoginPage } from "../../pages/LoginPage";
import { SrePage } from "../../pages/SrePage";
import { loadYamlData } from "../../utils/ymalHelper";

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
  await loginPage.login(testData.login.valid.email, testData.login.valid.password);

  // Navigate to Applications and open app
  await page.getByRole("complementary").getByRole("link", { name: "Applications" }).click();
  await page.goto("https://platformnex-v2-frontend-qa1-pyzx2jrmda-uc.a.run.app/applications");
  await page.locator('[data-test-id="overlay"]').waitFor({ state: "hidden", timeout: 30000 }).catch(() => {});

  const appCard = page.getByText("dnsRegression-testOwned by:").first();
  await appCard.waitFor({ state: "visible", timeout: 20000 });
  await appCard.click();
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(3000); // Wait 3s for app to fully load
});

// ---------- Complete SRE UI Test ----------
test("SRE Complete UI Verification - Development, Overview, Logs, Resources", async () => {
  await srePage.openSre();
  await srePage.selectDevelopmentEnvironment();
  await srePage.verifyTabsVisible();
  await srePage.verifyCompleteSREUI();
  await srePage.page.waitForTimeout(2000); // Small pause for stability
});

// ---------- Individual Tab Tests ----------
test("SRE Overview Tab - Latency and Error Rate Filters", async () => {
  await srePage.openSre();
  await srePage.page.waitForTimeout(1000);
  await srePage.selectDevelopmentEnvironment();
  await srePage.page.waitForTimeout(1000);
  await srePage.verifyOverviewUI();
  await srePage.page.waitForTimeout(1000);
});

test("SRE Logs Tab - Error Level Filter", async () => {
  await srePage.openSre();
  await srePage.page.waitForTimeout(1000);
  await srePage.selectDevelopmentEnvironment();
  await srePage.page.waitForTimeout(1000);
  await srePage.filterLogs('Error', 'last 1 day');
  await srePage.verifyLogsTable();
  await srePage.page.waitForTimeout(1000);
});

test("SRE Resources Tab - Table Verification", async () => {
  await srePage.openSre();
  await srePage.page.waitForTimeout(1000);
  await srePage.selectDevelopmentEnvironment();
  await srePage.page.waitForTimeout(1000);
  await srePage.openResources();
  await srePage.verifyResourcesTable();
  await srePage.page.waitForTimeout(1000);
});
