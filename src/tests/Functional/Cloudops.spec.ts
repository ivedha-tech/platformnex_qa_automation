import { test } from "@playwright/test";
import { MainPage } from "../../pages/MainPage";
import { LoginPage } from "../../pages/LoginPage";
import { CloudOpsPage } from "../../pages/CloudopsPage";
import { loadYamlData } from "../../utils/ymalHelper";

let mainPage: MainPage;
let loginPage: LoginPage;
let cloudOpsPage: CloudOpsPage;

const testData: { 
  login: { valid: { email: string, password: string } }, 
  cloudops: { 
    resource: { name: string }, 
    database?: { instanceName: string, version: string, dbName: string, username: string, password: string } 
  } 
} = loadYamlData("src/utils/testData.yaml");
test.setTimeout(180000); 


test.beforeEach(async ({ page }) => {
  mainPage = new MainPage(page);
  loginPage = new LoginPage(page);
  cloudOpsPage = new CloudOpsPage(page);

  // ---------- Login ----------
  await mainPage.navigateToHomePage();
  await mainPage.openLoginPage();
  await loginPage.login(testData.login.valid.email, testData.login.valid.password);

  // ---------- Wait for dashboard / applications page ----------
  // ---------- Select Application ----------
  await page.getByRole("link", { name: "Applications" }).click();
  await page.goto("https://platformnex-v2-frontend-qa1-pyzx2jrmda-uc.a.run.app/applications");
  await page.getByText("dnsPlatformnexOwned by:").click();
  await page.waitForLoadState("networkidle")

  // ---------- Click application ----------
  const appLink = page.getByText("dnsPlatformnexOwned by:");
  await appLink.waitFor({ state: "visible", timeout: 20000 });
  await appLink.click();

  // ---------- Open CloudOps ----------
  await cloudOpsPage.openCloudOps();
  await cloudOpsPage.verifyPageLoaded();

});


// ---------- TC001: Add Storage ----------
test("TC001 - Add Storage Resource", async ({ page }) => {
  await cloudOpsPage.addResourceButton.click();
  const resourceName = testData.cloudops.resource.name;
  await cloudOpsPage.addStorage(resourceName);
  await cloudOpsPage.createResourceButton.click();
  await page.waitForTimeout(60000); // Wait for resource creation to process
  await cloudOpsPage.verifyResourceCreated(resourceName);
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
   // Wait for form fill
  await cloudOpsPage.createDatabaseButton.click();
  await page.waitForTimeout(50000); // Wait for resource creation to process
  if (testData.cloudops.database) {
    await cloudOpsPage.verifyResourceCreated(testData.cloudops.database.instanceName);
  } else {
    throw new Error("Database details are not defined in test data.");
  }
});

