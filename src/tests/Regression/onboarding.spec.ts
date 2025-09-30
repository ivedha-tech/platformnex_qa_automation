import { test, Page, TestInfo } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { OnboardingPage } from "../../pages/OnboardingPage";
import { MainPage } from "../../pages/MainPage";
import loadYamlData from "../../utils/yamlHelper";
import { loginAsUser } from "../../utils/authHelper";
import { Asserts } from "../../utils/asserts";

let mainPage: MainPage;
let onboardingPage: OnboardingPage;

const testData = loadYamlData("src/utils/testData.yaml");

// ---------------------------
// Global test data
// ---------------------------
const { email, password } = testData.login.valid;

// Application
const {
  appName,
  description: appDesc,
  owner: appOwner,
} = testData.application.valid;
const {
  expectedMessageOnboarded: appExpectedMessageOnboarded,
} = testData.application.successMessage;

// Component
const {
  kind: componentKind,
  compName,
  description: compDesc,
  owner: compOwner,
  type: compType,
  environment: compEnv,
  scOption: compSCOption,
  repoLink,
  gcpProjectID,
} = testData.component.comp.valid;
const {
  updatedDescription: compUpdatedDesc,
  updatedType: compUpdatedType,
  updatedEnvironment: compUpdatedEnv,
} = testData.component.comp.edit;
const {
  expectedMessageOnboarded: compExpectedMessageOnboarded,
  expectedMessageUpdated: compExpectedMessageUpdated,
} = testData.component.comp.successMessage;

// API
const {
  kind: apiKind,
  apiName,
  description: apiDesc,
  owner: apiOwner,
  apiDefinition,
  type: apiType,
  environment: apiEnv,
  scOption: apiSCOption,
  repoLink: apiRepoLink,
} = testData.api.comp.valid;
const {
  expectedMessageOnboarded: apiExpectedMessageOnboarded,
} = testData.api.comp.successMessage;

// Resource
const {
  kind: resourceKind,
  resourceName,
  description: resDesc,
  owner: resOwner,
  type: resType,
  environment: resourceEnv,
} = testData.resource.comp.valid;
const {
  expectedMessageOnboarded: recExpectedMessageOnboarded,
} = testData.resource.comp.successMessage;

test.beforeEach(async ({ page }: { page: Page }, testInfo: TestInfo) => {
  onboardingPage = new OnboardingPage(page);
  mainPage = new MainPage(page);

  testInfo.setTimeout(testInfo.timeout + 30_000);

  // Precondition: Login
  await loginAsUser(page, email, password);
  await mainPage.navigateToApplication();

  // Temporary navigation
  await page.goto(
    "https://platformnex-v2-frontend-qa1-pyzx2jrmda-uc.a.run.app/applications/Regression-test"
  );
  await page.waitForLoadState("domcontentloaded");
});

test.describe("Onboarding Suite", () => {
  // test("Should onboard a new application successfully", async () => {
  //   const newAppName = `${appName}-${Date.now()}`;
    
  //   await onboardingPage.onboardNewApplication(newAppName, appDesc, appOwner);
  //   await Asserts.validateSuccessMessage(
  //     onboardingPage.successMessageApplication,
  //     appExpectedMessageOnboarded
  //   );

  //   await onboardingPage.viewApplication();
  //   await onboardingPage.waitForPageLoad();
  // });

  test("Should onboard a new component successfully", async () => {
    const newAppName = "Regression-test";
    const newCompName = `${compName}-${Date.now()}`;
    
    await onboardingPage.onboardNewComponent(
      componentKind,
      newAppName,
      newCompName,
      compDesc,
      compOwner,
      compType,
      compEnv,
      compSCOption,
      repoLink,
      apiDefinition,
      gcpProjectID
    );
    
    await Asserts.validateSuccessMessage(
      onboardingPage.componentOnboardedSuccess,
      compExpectedMessageOnboarded
    );

    await onboardingPage.viewApplication();
    await onboardingPage.waitForPageLoad();
  });

  test("Should onboard a new API successfully", async () => {
    const newAppName = "Regression-test";
    const newApiName = `${apiName}-${Date.now()}`;
    
    await onboardingPage.onboardNewComponent(
      apiKind,
      newAppName,
      newApiName,
      apiDesc,
      apiOwner,
      apiType,
      apiEnv,
      apiSCOption,
      apiRepoLink,
      apiDefinition,
      gcpProjectID
    );
    
    await Asserts.validateSuccessMessage(
      onboardingPage.apiOnboardedSuccess,
      apiExpectedMessageOnboarded
    );

    await onboardingPage.viewApplication();
    await onboardingPage.waitForPageLoad();
  });

  test("Should onboard a new resource successfully", async () => {
    const newAppName = "Regression-test";
    const newResourceName = `${resourceName}-${Date.now()}`;
    
    await onboardingPage.onboardNewComponent(
      resourceKind,
      newAppName,
      newResourceName,
      resDesc,
      resOwner,
      resType,
      resourceEnv,
      compSCOption,
      "",
      "",
      gcpProjectID
    );
    
    await Asserts.validateSuccessMessage(
      onboardingPage.resourceOnboardedSuccess,
      recExpectedMessageOnboarded
    );

    await onboardingPage.viewApplication();
    await onboardingPage.waitForPageLoad();
  });

  test("Should edit an existing component successfully", async () => {
    const newAppName = "Regression-test";
    const newCompName = `${compName}-${Date.now()}`;
    
    // First onboard a component
    await onboardingPage.onboardNewComponent(
      componentKind,
      newAppName,
      newCompName,
      compDesc,
      compOwner,
      compType,
      compEnv,
      compSCOption,
      repoLink,
      apiDefinition,
      gcpProjectID
    );
    await onboardingPage.waitForPageLoad();

    await onboardingPage.viewApplication();
    

    await onboardingPage.waitForPageLoad();

    // Edit the component
    await onboardingPage.editComponentByName(
      componentKind,
      newCompName,
      compUpdatedDesc,
      compUpdatedType,
      compUpdatedEnv,
      "https://github.com/new/repo",
      undefined,
      "new-gcp-project-id"
    );

    await onboardingPage.waitForPageLoad();
    await Asserts.validateSuccessMessage(
      onboardingPage.editComponentSuccess,
      compExpectedMessageUpdated
    );

    // Verify the component is still visible after edit
    await onboardingPage.viewApplication();
    await onboardingPage.waitForPageLoad();
    await Asserts.validateSectionVisible(
      onboardingPage.componentRow(newCompName)
    );
  });
});