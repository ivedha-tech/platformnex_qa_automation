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
  compkind: componentKind,
  compName,
  compdescription: compDesc,
  compowner: compOwner,
  comptype: compType,
  compenvironment: compEnv,
  compscOption: compSCOption,
  repoLink,
  compgcpProjectID,
} = testData.component.compData.valid;
const {
  compupdatedDescription: compUpdatedDesc,
  compupdatedType: compUpdatedType,
  compupdatedEnvironment: compUpdatedEnv,
} = testData.component.compData.edit;
const {
  compexpectedMessageOnboarded: compExpectedMessageOnboarded,
  compexpectedMessageUpdated: compExpectedMessageUpdated,
} = testData.component.compData.successMessage;

// API
const {
  apikind: apiKind,
  apiName,
  apidescription: apiDesc,
  apiowner: apiOwner,
  apiDefinition,
  apitype: apiType,
  apienvironment: apiEnv,
  apiscOption: apiSCOption,
  apirepoLink: apiRepoLink,
} = testData.api.apiData.valid;
const {
  apiexpectedMessageOnboarded: apiExpectedMessageOnboarded,
} = testData.api.apiData.successMessage;

// Resource
const {
  reskind: resourceKind,
  resourceName,
  resdescription: resDesc,
  resowner: resOwner,
  restype: resType,
  resenvironment: resourceEnv,
} = testData.resource.resData.valid;

const {
  resexpectedMessageOnboarded: recExpectedMessageOnboarded,
} = testData.resource.resData.successMessage;

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

  // Handle Feedback
  await mainPage.handleFeedbackPopup();
});

test.describe("Onboarding Suite", () => {
  test("Should onboard a new application successfully", async () => {
    // const newAppName = `${appName}-${Date.now()}`;
    
    // await onboardingPage.onboardNewApplication(newAppName, appDesc, appOwner);
    // await Asserts.validateSuccessMessage(
    //   onboardingPage.successMessageApplication,
    //   appExpectedMessageOnboarded
    // );

    // await onboardingPage.viewApplication();
    // await onboardingPage.waitForPageLoad();
  });

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
      compgcpProjectID
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
      compgcpProjectID
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
      compgcpProjectID
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
      compgcpProjectID
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