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
let newCompName: string;

// login
const { email, password } = testData.login.valid;

// application
const { appName } = testData.application.valid;

//component
const {
  expectedMessageOnboarded: compExpectedMessageOnboarded,
} = testData.component.compData.successMessage;

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

  // --- Precondition: Login ---
  await loginAsUser(page, email, password);

  // --- Precondition: Navigate directly to application ---
  await page.goto(
    "https://platformnex-v2-frontend-qa1-pyzx2jrmda-uc.a.run.app/applications/Regression-test"
  );
  await page.waitForLoadState("domcontentloaded");

  // --- Precondition: Onboard a new component ---
  newCompName = `${componentName}-${Date.now()}`;
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

  // Land back on Application Overview (ready for tests)
  await onboardingPage.viewApplication();
});

test.describe("DevOps Gateway Flow", () => {
  test("Complete SonarQube setup via PR merge (bypass), then verify Code Quality cards", async ({
    page,
  }) => {
    // Open DevOps tab
    await devopsPage.openDevOpsTab();

    // Select the component onboarded in precondition
    await devopsPage.selectComponentByName(newCompName);

    // Verify insights
    await devopsPage.verifyCommitInsights();
    await devopsPage.verifyLibraryChecker();
    await devopsPage.expandLibraryDependencies();
    await devopsPage.verifyRecentCommits();

    // Verify "Missing Plugin SonarQube"
    await Asserts.validateTextContains(
      devopsPage.missingPluginHeading,
      sonarMissingHeading
    );

    // Setup new SonarQube
    await devopsPage.setupNewSonarQube();

    // Verify "Setup in Progress"
    await Asserts.validateTextContains(
      devopsPage.setupInProgressHeading,
      sonarSetupInProgressHeading
    );

    // Open PR and bypass merge
    await devopsPage.openOnboardSonarQubePullRequest(prTitlePrefix);
    await devopsPage.bypassAndMergePR();

    // Refresh and ensure component is selected
    await devopsPage.refreshAndEnsureComponent(newCompName);

    // Validate Code Quality cards
    await Asserts.validateTextContains(
      devopsPage.codeQualityHeading,
      "Code Quality"
    );
    for (const card of codeQualityCards) {
      await Asserts.validateLocatorVisible(devopsPage.qualityCardByName(card));
    }
  });
});