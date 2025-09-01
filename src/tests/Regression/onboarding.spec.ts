import { test } from "@playwright/test";
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
const { updatedDescription: compUpdatedDesc, updatedType: compUpdatedType, updatedEnvironment: compUpdatedEnv } =
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
} = testData.component.resource.valid;
const { updatedDescription: resUpdatedDesc, tags: resTagsEdit } =
  testData.component.resource.edit;

test.beforeEach(async ({ page }, testInfo) => {
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
    await onboardingPage.onboardNewApplication(appName, appDesc, appOwner);
    await Asserts.validateSuccessMessage(
      onboardingPage.successMessageApplication,
      appExpectedMessage
    );

    await onboardingPage.viewApplication();
    await Asserts.validateText(
      onboardingPage.applicationNameView(appName),
      appName
    );

    // ---------------------------
    // Component Onboarding + View
    // ---------------------------
    await onboardingPage.onboardNewComponent(
      componentKind,
      appName,
      compName,
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
      compExpectedMessage
    );

    await onboardingPage.viewApplication();
    await Asserts.validateText(
      onboardingPage.applicationNameView(appName),
      appName
    );

    await Asserts.validateSectionVisible(
      await onboardingPage.viewComponent(
        compName,
        onboardingPage.componentRow(compName),
        onboardingPage.nextButtonComponentTable
      )
    );

    // ---------------------------
    // API Onboarding + View
    // ---------------------------
    await onboardingPage.onboardNewComponent(
      apiKind,
      appName,
      apiName,
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
      compExpectedMessage
    );

    await onboardingPage.viewApplication();
    await Asserts.validateText(
      onboardingPage.applicationNameView(appName),
      appName
    );

    await Asserts.validateSectionVisible(
      await onboardingPage.viewComponent(
        compName,
        onboardingPage.componentRow(compName),
        onboardingPage.nextButtonComponentTable
      )
    );

    // ---------------------------
    // Resource Onboarding + View
    // ---------------------------
    await onboardingPage.onboardNewComponent(
      apiKind,
      appName,
      resourceName,
      resDesc,
      resOwner,
      resType,
      resourceEnv,
      compSCOption,
      repoLink,
      apiDefinition,
      gcpProjectID
    );
    await Asserts.validateSuccessMessage(
      onboardingPage.resourceOnboardedSuccess,
      compExpectedMessage
    );

    await onboardingPage.viewApplication();
    await Asserts.validateText(
      onboardingPage.applicationNameView(appName),
      appName
    );

    await Asserts.validateSectionVisible(
      await onboardingPage.viewComponent(
        compName,
        onboardingPage.componentRow(compName),
        onboardingPage.nextButtonComponentTable
      )
    );

    // ----------------------------------------------
    // Edit component 
    // ---------------------------------------

    await onboardingPage.editComponentByName(
      componentKind,
      compName,
      compUpdatedDesc,
      compUpdatedType, 
      compUpdatedEnv, 
      "https://github.com/new/repo", // update repo
      undefined, // skip API definition for component
      "new-gcp-project-id"
    );

    await Asserts.validateSuccessMessage(
      onboardingPage.editComponentSuccess,
      compExpectedMessage
    );

    // Verify updated description
    await onboardingPage.viewApplication();
    await Asserts.validateSectionVisible(onboardingPage.componentRow(compName));
  });

  
});
