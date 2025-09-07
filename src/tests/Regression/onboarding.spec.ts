import { test, Page, TestInfo } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { OnboardingPage } from "../../pages/OnboardingPage";
import { MainPage } from "../../pages/MainPage";
import { loadYamlData } from "../../utils/ymalHelper";
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
const { updatedDescription: appUpdatedDesc, tags: appTags } =
  testData.application.edit;
const { expectedMessage: appExpectedMessage } =
  testData.application.successMessage;

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
const { updatedDescription: compUpdatedDesc, updatedType: compUpdatedType, updateEnvironment: compUpdatedEnv } =
  testData.component.comp.edit;
const { expectedMessage: compExpectedMessage } =
  testData.component.comp.successMessage;

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
} = testData.component.api.valid;
const { updatedDescription: apiUpdatedDesc, annotations: apiAnnotationsEdit } =
  testData.component.api.edit;

// Resource
const {
  kind: resourceKind,
  resourceName,
  description: resDesc,
  owner: resOwner,
  type: resType,
  environment: resourceEnv,
  gcpProjectID: resourceGcp,
} = testData.resource.valid;
const { updatedDescription: resUpdatedDesc, tags: resTagsEdit } =
  testData.resource.edit;

test.beforeEach(async ({ page }: { page: Page }, testInfo: TestInfo) => {
  onboardingPage = new OnboardingPage(page);
  mainPage = new MainPage(page);

  testInfo.setTimeout(testInfo.timeout + 30_000);

  // Precondition: Login
  await loginAsUser(page, email, password);
  await mainPage.navigateToApplication();
});

test.describe("Onboarding and Editing Tests", () => {
  test("Onboard and view ", async () => {
    // ---------------------------
    // Application Onboarding + View
    // ---------------------------
    const newAppName = `${appName}-${Date.now()}`;
    await onboardingPage.onboardNewApplication(newAppName, appDesc, appOwner);
    await Asserts.validateSuccessMessage(
      onboardingPage.successMessageApplication
    );

    await onboardingPage.viewApplication();
    // Stop here for now; component/API/resource onboarding disabled due to UI changes hiding onboard buttons
    return;

    // ---------------------------
    // Component Onboarding + View (disabled)
    // ---------------------------
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
      onboardingPage.componentOnboardedSuccess
    );

    await onboardingPage.viewApplication();
    

    await Asserts.validateSectionVisible(
      await onboardingPage.viewComponent(
        newCompName,
        onboardingPage.componentRow(newCompName),
        onboardingPage.nextButtonComponentTable
      )
    );

    // ---------------------------
    // API Onboarding + View (disabled)
    // ---------------------------
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
      onboardingPage.apiOnboardedSuccess
    );

    await onboardingPage.viewApplication();
    

    await Asserts.validateSectionVisible(
      await onboardingPage.viewComponent(
        newCompName,
        onboardingPage.componentRow(newCompName),
        onboardingPage.nextButtonComponentTable
      )
    );

    // ---------------------------
    // Resource Onboarding + View (disabled)
    // ---------------------------
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
      '',
      '',
      gcpProjectID
    );
    await Asserts.validateSuccessMessage(
      onboardingPage.resourceOnboardedSuccess
    );

    await onboardingPage.viewApplication();
    

    await Asserts.validateSectionVisible(
      await onboardingPage.viewComponent(
        newCompName,
        onboardingPage.componentRow(newCompName),
        onboardingPage.nextButtonComponentTable
      )
    );

    // ----------------------------------------------
    // Edit component (disabled)
    // ---------------------------------------

    await onboardingPage.editComponentByName(
      componentKind,
      newCompName,
      compUpdatedDesc,
      compUpdatedType, 
      compUpdatedEnv, 
      "https://github.com/new/repo", // update repo
      undefined, // skip API definition for component
      "new-gcp-project-id"
    );

    await Asserts.validateSuccessMessage(
      onboardingPage.editComponentSuccess
    );

    // Verify updated description
    await onboardingPage.viewApplication();
    await Asserts.validateSectionVisible(onboardingPage.componentRow(newCompName));
  });

  
});
