import { test, expect } from "@playwright/test";
import { MainPage } from "../../pages/MainPage";
import { LoginPage } from "../../pages/LoginPage";
import { Quickstart3TierPage } from "../../pages/Quickstart3TierPage";
import { loadYamlData } from "../../utils/ymalHelper";

const testData = loadYamlData("src/utils/testData.yaml");

test.describe("End-to-End 3-Tier Quickstart Flow", () => {
  let mainPage: MainPage;
  let loginPage: LoginPage;
  let quickstartPage: Quickstart3TierPage;

  test("QS_E2E_001 - Login and Complete 3-Tier Quickstart", async ({ page }) => {
    test.setTimeout(1_200_000); // 20 minutes
    // 1️⃣ Initialize page objects
    mainPage = new MainPage(page);
    loginPage = new LoginPage(page);
    quickstartPage = new Quickstart3TierPage(page);

    // 2️⃣ Navigate to main page
    await mainPage.navigateToHomePage();

    // 3️⃣ Open Login Page
    await mainPage.openLoginPage();

    // 4️⃣ Perform Login
    await loginPage.login(testData.login.valid.email, testData.login.valid.password);

    // 5️⃣ Ensure dashboard is loaded
    const isDashboardLoaded = await mainPage.isDashboardLoaded();
    expect(isDashboardLoaded).toBeTruthy();

    // 6️⃣ Click the Quickstart button
    await page.click('//*[@id="root"]/div[2]/aside/div/div/nav/a[3]/div/span');

    // 7️⃣ Click the 3-Tier button (waits for navigation/modal)
    const clicked = await quickstartPage.click3TierButton();
    expect(clicked).toBeTruthy();

    // 8️⃣ Fill Quickstart Forms
    await quickstartPage.fillBasicInfo(testData.quickstart.basicinfo);
    await quickstartPage.fillFrontendConfig(testData.quickstart.frontend);
    await quickstartPage.fillBackendConfig(testData.quickstart.backend);
    await quickstartPage.fillInfrastructureConfig(testData.quickstart.infrastructure);

    // 9️⃣ Review & Submit
    await quickstartPage.reviewAndSubmit();

    // 🔟 Verify success message
    await expect(page.locator("text=Pulumi Infrastructure Logs Completed")).toBeVisible({ timeout: 120000 });
  });
});
