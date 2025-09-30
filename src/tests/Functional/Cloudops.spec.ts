import { test, expect } from "@playwright/test";
import { MainPage } from "../../pages/MainPage";
import { LoginPage } from "../../pages/LoginPage";
import { CloudOpsPage } from "../../pages/CloudopsPage";
import { ComponentOnboardingPage } from "../../pages/ComponentOnboardingPage";
import { loadYamlData } from "../../utils/ymalHelper";

let mainPage: MainPage;
let loginPage: LoginPage;
let componentOnboardingPage: ComponentOnboardingPage;
let cloudOpsPage: CloudOpsPage;

const testData: { 
  login: { valid: { email: string, password: string } }, 
  cloudops: { 
    resource: { name: string }, 
    database?: { instanceName: string, version: string, dbName: string, username: string, password: string } 
  },
} = loadYamlData("src/utils/testData.yaml");

test.setTimeout(190000);

test.beforeEach(async ({ page }) => {
  mainPage = new MainPage(page);
  loginPage = new LoginPage(page);
  componentOnboardingPage = new ComponentOnboardingPage(page);
  cloudOpsPage = new CloudOpsPage(page);

  // ---------- Login ----------
  await mainPage.navigateToHomePage();
  await mainPage.openLoginPage();
  await loginPage.login(testData.login.valid.email, testData.login.valid.password);
  

  // ---------- Navigate to Application ----------
  await page.getByRole("link", { name: "Applications" }).click();
  await page.goto("https://platformnex-v2-frontend-qa1-pyzx2jrmda-uc.a.run.app/applications");
  await page.locator('[data-test-id="overlay"]').waitFor({ state: 'hidden', timeout: 30000 });
  await page.getByText('dnsRegression-testOwned by:').click();

  // ---------- Open CloudOps ----------
  await cloudOpsPage.openCloudOps();
  await cloudOpsPage.verifyPageLoaded();
  
});

// ---------- TC001: Add Storage ----------
test("TC001 - Add Storage Resource", async ({ page }) => {
  await cloudOpsPage.addResourceButton.click();
  const resourceName = testData.cloudops.resource.name;
  await cloudOpsPage.addStorage(resourceName);
  await cloudOpsPage.createStorage();
  await page.waitForTimeout(60000);
 

});
// ---------- TC002: Add Database ----------
test("TC002 - Add Database Resource", async ({ page }) => {
  await cloudOpsPage.addResourceButton.click();
  await cloudOpsPage.openDatabaseTab();
  await cloudOpsPage.fillDatabaseForm(
    testData.cloudops.database!.instanceName,
    testData.cloudops.database!.version,
    testData.cloudops.database!.dbName,
    testData.cloudops.database!.username,
    testData.cloudops.database!.password 
  );
  await cloudOpsPage.createDatabase();
  await page.waitForTimeout(60000);
});

test ("TC003 - Delete All Resources", async ({ page }) => {
  await cloudOpsPage.deleteAllResources();
  
  // Success state verify
  await expect(page.getByRole('heading', { name: 'No Cloud Resources' }))
    .toBeVisible({ timeout: 60000 });
});


