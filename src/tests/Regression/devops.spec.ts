import { test } from "@playwright/test";
import { BasePage } from "../../pages/BasePage";
import { MainPage } from "../../pages/MainPage";
import { OnboardingPage } from "../../pages/OnboardingPage";
import { FinopsPage } from "../../pages/FinopsPage";
import { DevopsPage } from "../../pages/DevopsPage";
import loadYamlData from "../../utils/yamlHelper";
import { loginAsUser } from "../../utils/authHelper";
import { Asserts } from "../../utils/asserts";

const testData = loadYamlData("src/utils/testData.yaml");

let basePage: BasePage;
let mainPage: MainPage;
let onboardingPage: OnboardingPage;
let finopsPage: FinopsPage;
let devopsPage: DevopsPage;

// login
const { email, password } = testData.login.valid;

// application
const { appName } = testData.application.valid;

//component
const {
  expectedMessageOnboarded: compExpectedMessageOnboarded,
  expectedMessageUpdated: compExpectedMessageUpdated,
} = testData.component.comp.successMessage;

// devops (component + devops flow inputs)
const {
  componentName,
  description,
  owner,
  type,
  environment,
  providerOption,
  repoUrl,
  gcpProjectID,
  expected: {
    sonarMissingHeading,
    sonarSetupInProgressHeading,
    prTitlePrefix,
    codeQualityCards,
  },
} = testData.devops;

test.beforeEach(async ({ page }, testInfo) => {
  onboardingPage = new OnboardingPage(page);
  finopsPage = new FinopsPage(page);
  mainPage = new MainPage(page);
  basePage = new BasePage(page);
  devopsPage = new DevopsPage(page);

  testInfo.setTimeout(testInfo.timeout + 30_000);

  // Precondition: Login
  await loginAsUser(page, email, password);
  await mainPage.navigateToApplication();
});

test.describe("DevOps Gateway Flow", () => {
  test("Onboard component and complete SonarQube setup via PR merge (bypass), then verify Code Quality cards", async ({
    page,
  }, testInfo) => {
    await page.goto(
      "https://platformnex-v2-frontend-qa1-pyzx2jrmda-uc.a.run.app/applications/Regression-test"
    );
    page.waitForLoadState("domcontentloaded");

    //await devopsPage.selectComponentByName("test-comp")

    // await devopsPage.selectFilter("This Week");

    // await devopsPage.selectBranchDropdown(
    //   /main \(default\)/i,
    //   /Onboarding-Regression-test-/i
    // );
    // await devopsPage.selectBranchDropdown(
    //   /Onboarding-Regression-test-/i,
    //   /Login-functional-test-/i
    // );

    // 1) select application
    //await onboardingPage.selectApplicationByName("TestApp1");

    // 2) Onboard a new component (re-use your OnboardingPage API)
    const newCompName = `${componentName}-${Date.now()}`;
    await onboardingPage.onboardNewComponent(
      "Component",
      appName,
      newCompName,
      description,
      owner,
      type,
      environment,
      providerOption,
      repoUrl,
      "",
      gcpProjectID
    );

    await Asserts.validateSuccessMessage(
      onboardingPage.componentOnboardedSuccess,
      compExpectedMessageOnboarded
    );

    // Land back on Application Overview and open DevOps tab
    await onboardingPage.viewApplication();

    // 3) Select our component in DevOps
    //await devopsPage.selectComponentByName(newCompName);

    await devopsPage.openDevOpsTab();
    await devopsPage.verifyCommitInsights();
    await devopsPage.verifyLibraryChecker();
    await devopsPage.expandLibraryDependencies();
    await devopsPage.verifyRecentCommits();

    await devopsPage.selectComponentByName("test-auto");

    // Verify we see "Missing Plugin SonarQube"
    await Asserts.validateTextContains(
      devopsPage.missingPluginHeading,
      sonarMissingHeading
    );

    // 4) Setup new SonarQube (confirm and close)
    await devopsPage.setupNewSonarQube();

    // Verify "Setup in Progress"
    await Asserts.validateTextContains(
      devopsPage.setupInProgressHeading,
      sonarSetupInProgressHeading
    );

    // 5) Open PR "Onboard SonarQube: <repo-or-component>"
    await devopsPage.openOnboardSonarQubePullRequest(prTitlePrefix);

    // 6) Merge with bypass
    await devopsPage.bypassAndMergePR();

    // 7) Return to DevOps dashboard and refresh + ensure component is selected
    await devopsPage.refreshAndEnsureComponent("test-auto");

    // 8) Validate Code Quality cards are visible
    await Asserts.validateTextContains(
      devopsPage.codeQualityHeading,
      "Code Quality"
    );
    for (const card of codeQualityCards) {
      await Asserts.validateLocatorVisible(devopsPage.qualityCardByName(card));
    }
  });
});
