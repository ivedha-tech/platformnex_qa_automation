import { test } from "@playwright/test";
import { BasePage } from "../../pages/BasePage";
import { MainPage } from "../../pages/MainPage";
import { OnboardingPage } from "../../pages/OnboardingPage";
import { DevopsPage } from "../../pages/DevopsPage";
import loadYamlData from "../../utils/yamlHelper";
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

//component
const {
  compexpectedMessageOnboarded: compExpectedMessageOnboarded,
  compexpectedMessageUpdated: compExpectedMessageUpdated,
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
  mainPage = new MainPage(page);
  basePage = new BasePage(page);
  devopsPage = new DevopsPage(page);

  testInfo.setTimeout(testInfo.timeout + 30_000);

  // Precondition: Login
  await loginAsUser(page, email, password);
  await mainPage.navigateToApplication();
});

test.describe("DevOps CI/CD Flow", () => {
  test("Onboard component and ", async ({
    page,
  }, testInfo) => {
    
    await page.goto(
      "https://platformnex-v2-frontend-qa1-pyzx2jrmda-uc.a.run.app/applications/Regression-test"
    );
    page.waitForLoadState("domcontentloaded");

    

    // 1) select application
    //await onboardingPage.selectApplicationByName("TestApp1");

    // 2) Onboard a new component 
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

    // Land back on Application Overview and open DevOps tab
    await onboardingPage.viewApplication();


    await devopsPage.openDevOpsTab();
    // 3) Select our component in DevOps
    await devopsPage.selectComponentByName(newCompName);

    await devopsPage.openDevOpsTab();
    //await devopsPage.selectComponentByName("TestComponentAuto");

    await devopsPage.openCICDTab();
    await devopsPage.configureCICD(gcpProjectID);

    
  });
});
