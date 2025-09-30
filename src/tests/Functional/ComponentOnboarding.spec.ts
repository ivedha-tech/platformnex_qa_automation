import { test } from "@playwright/test";
import { MainPage } from "../../pages/MainPage";
import { LoginPage } from "../../pages/LoginPage";
import { OnboardingPage } from "../../pages/OnboardingPage";
import { ComponentOnboardingPage } from "../../pages/ComponentOnboardingPage"; // Ensure the file exists at this path
import { loadYamlData } from "../../utils/ymalHelper";

let mainPage: MainPage;
let loginPage: LoginPage;
let onboardingPage: OnboardingPage;
let componentOnboardingPage: ComponentOnboardingPage;

const testData: any = loadYamlData("src/utils/testData.yaml");

test.setTimeout(150000); // adjust timeout for onboarding flow

test.beforeEach(async ({ page }) => {
  mainPage = new MainPage(page);
  loginPage = new LoginPage(page);
  onboardingPage = new OnboardingPage(page);
  componentOnboardingPage = new ComponentOnboardingPage(page);

  // ---------- Login ----------
  await mainPage.navigateToHomePage();
  await mainPage.openLoginPage();
  await loginPage.login(
    testData.login.valid.email,
    testData.login.valid.password
  );

  // ---------- Navigate to Applications ----------
  await page.getByRole("complementary").getByRole("link", { name: "Applications" }).click();
  await page.goto("https://platformnex-v2-frontend-qa1-pyzx2jrmda-uc.a.run.app/applications");

  // ---------- Select regression app ----------
  const appLink = page.getByText("dnsRegression-testOwned by:");
  await appLink.waitFor({ state: "visible", timeout: 20000 });
  await appLink.click();
  await page.waitForLoadState("networkidle");
});

// ---------- TC001: Onboard New Component ----------
test("Onboard new component successfully", async () => {
  await componentOnboardingPage.onboardComponent(
    testData.component.comp.valid.compName,
    testData.component.comp.valid.description,
    testData.component.comp.valid.repoLink
  );
});
