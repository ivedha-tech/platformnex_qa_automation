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
const {
  expectedMessageOnboarded: appExpectedMessageOnboarded,
  expectedMessageUpdated: appExpectedMessageUpdated,
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
const { updatedDescription: apiUpdatedDesc, annotations: apiAnnotationsEdit } =
  testData.api.comp.edit;
const {
  expectedMessageOnboarded: apiExpectedMessageOnboarded,
  expectedMessageUpdated: apiExpectedMessageUpdated,
} = testData.api.comp.successMessage;

// Resource
const {
  kind: resourceKind,
  resourceName,
  description: resDesc,
  owner: resOwner,
  type: resType,
  environment: resourceEnv,
  gcpProjectID: resourceGcp,
} = testData.resource.comp.valid;
const { updatedDescription: resUpdatedDesc, tags: resTagsEdit } =
  testData.resource.comp.edit;
const {
  expectedMessageOnboarded: recExpectedMessageOnboarded,
  expectedMessageUpdated: recExpectedMessageUpdated,
} = testData.resource.comp.successMessage;

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
    const newAppName = `${appName}-${Date.now()}`;
    await onboardingPage.onboardNewApplication(newAppName, appDesc, appOwner);
    await Asserts.validateSuccessMessage(
      onboardingPage.successMessageApplication,
      appExpectedMessageOnboarded
    );

    await onboardingPage.viewApplication();
    
    if (
      await Asserts.validateLocatorVisible(
        onboardingPage.applicationNameView(newAppName)
      )
    ) {
      await Asserts.validateText(
        onboardingPage.applicationNameView(newAppName),
        appName
      );
    }

    // ---------------------------
    // Component Onboarding + View
    // ---------------------------
    const newCompName = `${compName}-${Date.now()}`
    await onboardingPage.onboardNewComponent(
      componentKind,
      appName,
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
    await Asserts.validateText(
      onboardingPage.applicationNameView(appName),
      appName
    );

    // await Asserts.validateSectionVisible(
    //   await onboardingPage.viewComponent(
    //     newCompName
    //   )
    // );

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
      apiExpectedMessageOnboarded
    );

    await onboardingPage.viewApplication();
    await Asserts.validateText(
      onboardingPage.applicationNameView(newAppName),
      newAppName
    );

    // await Asserts.validateSectionVisible(
    //   await onboardingPage.viewComponent(
    //     compName
    //   )
    // );

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
      recExpectedMessageOnboarded
    );

    await onboardingPage.viewApplication();
    await Asserts.validateText(
      onboardingPage.applicationNameView(newAppName),
      newAppName
    );

    // await Asserts.validateSectionVisible(
    //   await onboardingPage.viewComponent(
    //     compName
    //   )
    // );

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
      compExpectedMessageUpdated
    );

    // Verify updated description
    await onboardingPage.viewApplication();
    await Asserts.validateSectionVisible(onboardingPage.componentRow(compName));
  });
});
