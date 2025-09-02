import { test } from "@playwright/test";
import { BasePage } from "../../pages/BasePage";
import { MainPage } from "../../pages/MainPage";
import { OnboardingPage } from "../../pages/OnboardingPage";
import { DevopsPage } from "../../pages/DevopsPage";
import { loadYamlData } from "../../utils/ymalHelper";
import { loginAsUser } from "../../utils/authHelper";
import { Asserts } from "../../utils/asserts";

const testData = loadYamlData("src/utils/testData.yaml");

let basePage: BasePage;
let mainPage: MainPage;
let onboardingPage: OnboardingPage;
let devopsPage: DevopsPage;

// login
const { email, password } = testData.login.valid;

// application
const { appName } = testData.application.valid;

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
    codeQualityCards
  }
} = testData.devops;

test.beforeEach(async ({ page }, testInfo) => {
  onboardingPage = new OnboardingPage(page);
  mainPage = new MainPage(page);
  basePage = new BasePage(page);

  testInfo.setTimeout(testInfo.timeout + 30_000);

  // Precondition: Login
  await loginAsUser(page, email, password);
  await mainPage.navigateToApplication();
  
});

test.describe("DevOps Gateway Flow", () => {
  test("Onboard component and complete SonarQube setup via PR merge (bypass), then verify Code Quality cards", async ({ page }, testInfo) => {
    
    devopsPage = new DevopsPage(page);

    testInfo.setTimeout(testInfo.timeout + 60_000);

    // 2) Onboard a new component (re-use your OnboardingPage API)
    await onboardingPage.onboardNewComponent(
      "component",             // kind
      appName,                 // applicationName
      componentName,           // name
      description,             // description
      owner,                   // owner (kept in step 1 of your flow)
      type,                    // type (e.g., "website")
      environment,             // environment (e.g., "development")
      providerOption,          // dropdown option in provider (e.g., "Github")
      repoUrl,                 // repository link
      "",                      // apiDefinitionPath (not used for "component")
      gcpProjectID             // GCP project
    );

    // Land back on Application Overview and open DevOps tab
    await onboardingPage.viewApplication();
    await devopsPage.openDevOpsTab();

    // 3) Select our component in DevOps
    await devopsPage.selectComponentByName(componentName);

    // Verify we see "Missing Plugin SonarQube"
    await Asserts.validateTextContains(devopsPage.missingPluginHeading, sonarMissingHeading);

    // 4) Setup new SonarQube (confirm and close)
    await devopsPage.setupNewSonarQube();

    // Verify "Setup in Progress"
    await Asserts.validateTextContains(devopsPage.setupInProgressHeading, sonarSetupInProgressHeading);

    // 5) Open PR "Onboard SonarQube: <repo-or-component>"
    await devopsPage.openOnboardSonarQubePullRequest(prTitlePrefix);

    // 6) Merge with bypass
    await devopsPage.bypassAndMergePR();

    // 7) Return to DevOps dashboard and refresh + ensure component is selected
    await devopsPage.refreshAndEnsureComponent(componentName);

    // 8) Validate Code Quality cards are visible
    await Asserts.validateTextContains(devopsPage.codeQualityHeading, "Code Quality");
    for (const card of codeQualityCards) {
      await Asserts.validateLocatorVisible(devopsPage.qualityCardByName(card));
    }
  });
});