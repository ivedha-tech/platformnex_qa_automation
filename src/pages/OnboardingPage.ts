import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class OnboardingPage extends BasePage {
  // ---------------------------
  // Locators
  // ---------------------------
  readonly primaryButtonSecond: Locator;
  readonly nextStepButton: Locator;
  readonly finishButton: Locator;
  readonly skipTourButton: Locator;

  readonly onboardApplicationButton: Locator;
  readonly newAppName: Locator;
  readonly appDescription: Locator;
  readonly appOwner: Locator;
  readonly appOwnerselector: Locator;
  readonly appOnboardButton: Locator;
  readonly applicationOnboardedMessage: Locator;

  readonly viewApplicationButton: Locator;
  readonly applicationNameView: (name: string) => Locator;
  readonly startOverButton: Locator;
  readonly sidebarTabApplication: Locator;

  readonly onboardExistingComponentButton: Locator;
  readonly onboardComponentButton: Locator;
  readonly newCompNameField: Locator;
  readonly compDescription: Locator;
  readonly compOwner: Locator;
  readonly compTags: Locator;
  readonly compOnboardButton: Locator;
  readonly componentRow: (name: string) => Locator;
  readonly nextButtonComponentTable: Locator;
  readonly kindDropdown: Locator;
  readonly kindComponentOption: (kind: string) => Locator;
  readonly typeDropdown: Locator;
  readonly selectTypeOption: (type: string) => Locator;
  readonly environmentDropdown: Locator;
  readonly selectEnvironmentOption: (environment: string) => Locator;
  readonly sourceControlProvider: Locator;
  readonly selecSourceControlOption: (option: string) => Locator;
  readonly repoLinkField: Locator;
  readonly gcpProjectField: Locator;
  readonly nextButton: Locator;
  readonly editButtonInRow: (name: string) => Locator;

  readonly apiDefinitionField: Locator;

  readonly resourceRegionField: Locator;

  readonly successMessageApplication: Locator;
  readonly componentOnboardedSuccess: Locator;
  readonly apiOnboardedSuccess: Locator;
  readonly resourceOnboardedSuccess: Locator;
  readonly editComponentSuccess: Locator;

  readonly applicationCardByName: (name: string) => Locator;
  readonly paginationNextButton: Locator;

  constructor(page: Page) {
    super(page);
    console.log("Initializing OnboardingPage...");

    //Tour locators
    this.primaryButtonSecond = page
      .locator('[data-test-id="button-primary"]')
      .nth(1);
    this.nextStepButton = page.getByLabel("Next (Step 2 of 3)");
    this.finishButton = page.getByLabel("Finish");
    this.skipTourButton = page.locator('[data-test-id="button-skip"]');

    // Application locators
    this.onboardApplicationButton = page.getByRole("button", {
      name: "add_circle Onboard Application",
    });
    this.newAppName = page.getByPlaceholder("Name...");
    this.appDescription = page.getByPlaceholder("Enter description...");
    this.appOwner = page.getByLabel("Owner:");
    this.appOwnerselector = page.getByLabel("guests");
    this.appOnboardButton = page.getByRole("button", { name: "Onboard" });
    this.viewApplicationButton = page.getByRole("button", {
      name: "View Application",
    });
    this.applicationOnboardedMessage = page.getByRole("heading", {
      name: "Component Edited Successfully!",
    });
    this.applicationNameView = (name: string) =>
      page.getByRole("heading", { name: `${name}` });
    this.startOverButton = page.locator("#startOverApp");
    this.sidebarTabApplication = page
      .getByRole("complementary")
      .getByRole("link", { name: "Applications" });

    // Component locators
    this.onboardExistingComponentButton = page.getByRole("button", {
      name: /onboard\s+existing\s+component/i,
    });
    this.onboardComponentButton = page.getByRole("button", {
      name: /onboard\s+component/i,
    });
    this.kindDropdown = page.getByLabel("Kind:");
    this.kindComponentOption = (kind: string) => page.getByLabel(`${kind}`);
    this.newCompNameField = page.getByPlaceholder("Name...");
    this.compDescription = page.getByPlaceholder("Enter description...");
    this.compOwner = page.getByLabel("Owner:");
    this.compTags = page.getByLabel("Tags");
    this.typeDropdown = page.getByLabel("Type:");
    this.selectTypeOption = (type: string) => page.getByLabel(`${type}`);
    this.environmentDropdown = page.getByLabel("Environment:");
    this.selectEnvironmentOption = (environment: string) =>
      page.getByLabel(`${environment}`);
    this.sourceControlProvider = page
      .locator("button")
      .filter({ hasText: "Github" });
    this.selecSourceControlOption = (option: string) =>
      page.getByLabel(`${option}`);
    this.repoLinkField = page.getByPlaceholder("repository link...");
    this.gcpProjectField = page.getByPlaceholder("gcp project name...");
    this.nextButton = page.getByRole("button").filter({ hasText: "Next" });
    this.compOnboardButton = page.getByRole("button", {
      name: "Onboard",
      exact: true,
    });
    this.componentRow = (name: string) =>
      this.page.getByRole("cell", { name: new RegExp(`\\b${name}\\b`, "i") });
    this.nextButtonComponentTable = this.page.getByRole("button", {
      name: "chevron_right",
    });
    this.editButtonInRow = (name: string) =>
      this.page
        .getByRole("row", { name: new RegExp(`^${name} .*`, "i") })
        .getByRole("img")
        .nth(1);

    // API locators
    this.apiDefinitionField = page.getByPlaceholder("API definition...");

    // Resource locators
    this.resourceRegionField = page.getByPlaceholder(
      "resource region (ex: us-"
    );

    // Success message
    this.successMessageApplication = page.getByRole("heading", {
      name: /System/,
    });
    this.componentOnboardedSuccess = page.getByRole('heading')
      .filter({ hasText: /(Component|API|Resource)\s+(Onboarded|Edited)\s+/i })
    this.apiOnboardedSuccess = page.getByRole("heading", { name: /API/ });
    this.resourceOnboardedSuccess = page.getByRole("heading", {
      name: /Resource/,
    });
    this.editComponentSuccess = page.getByRole("heading", {
      name: /Successfully!/,
    });

    // application
    this.applicationCardByName = (name: string) =>
      page.getByRole("heading", { name: new RegExp(`^${name}$`, "i") });
    this.paginationNextButton = page.getByRole("button", {
      name: "chevron_right",
    });

    console.log("OnboardingPage initialized successfully");
  }

  // ---------------------------
  // Application Functions
  // ---------------------------
  async onboardNewApplication(
    name: string,
    description: string,
    owner: string
  ): Promise<void> {
    try {
      console.log(`Starting application onboarding for: ${name}`);
      //await this.handleTour();
      console.log("Clicking onboard application button");
      await this.onboardApplicationButton.click();

      console.log("Filling application name");
      await this.newAppName.waitFor({ state: "visible" });
      await this.newAppName.fill(name);

      console.log("Filling application description");
      await this.appDescription.waitFor({ state: "visible" });
      await this.appDescription.fill(description);

      console.log("Selecting application owner");
      await this.appOwner.click();
      await this.appOwnerselector.click();

      console.log("Clicking onboard button");
      await this.appOnboardButton.click();

      console.log("Waiting for page to load");
      await this.page.waitForLoadState("domcontentloaded");
      console.log(`Application ${name} onboarded successfully`);
    } catch (error) {
      console.error(`Error onboarding application ${name}:`, error);
      throw error;
    }
  }

  async viewApplication(): Promise<void> {
    try {
      console.log("Viewing application details");
      await this.page.waitForLoadState("domcontentloaded");
      await this.viewApplicationButton.waitFor({ state: "visible" });
      await this.viewApplicationButton.click();
      console.log("Application view opened successfully");
    } catch (error) {
      console.error("Error viewing application:", error);
      throw error;
    }
  }

  async startOverApplication(): Promise<void> {
    try {
      console.log("Starting over application");
      await this.startOverButton.waitFor({ state: "visible" });
      await this.startOverButton.click();
      console.log("Application start over completed");
    } catch (error) {
      console.error("Error starting over application:", error);
      throw error;
    }
  }

  async editApplication(
    name: string,
    updatedDescription: string,
    tags: string[]
  ): Promise<void> {
    try {
      console.log(`Editing application: ${name}`);
      await this.appDescription.waitFor({ state: "visible" });
      await this.appDescription.fill(updatedDescription);

      if (tags.length) {
        console.log(`Adding tags: ${tags.join(", ")}`);
        await this.compTags.waitFor({ state: "visible" });
        await this.compTags.fill(tags.join(", "));
      }

      console.log("Saving application changes");
      await this.appOnboardButton.waitFor({ state: "visible" });
      await this.appOnboardButton.click();

      await this.applicationNameView(name).waitFor({
        state: "visible",
        timeout: 60000,
      });
      console.log(`Application ${name} edited successfully`);
    } catch (error) {
      console.error(`Error editing application ${name}:`, error);
      throw error;
    }
  }

  async selectApplicationByName(name: string): Promise<void> {
    try {
      console.log(`Selecting application by name: ${name}`);
      await this.page.waitForLoadState("domcontentloaded");
      await this.handlePagination(
        this.applicationCardByName(name),
        this.paginationNextButton,
        "click"
      );
      console.log(`Application ${name} selected successfully`);
    } catch (error) {
      console.error(`Error selecting application ${name}:`, error);
      throw error;
    }
  }

  getCurrentUrl(): string {
    const url = this.page.url();
    console.log(`Current URL: ${url}`);
    return url;
  }

  async waitForPageLoad(): Promise<void> {
    console.log("Waiting for page to load completely");
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(2000);
    console.log("Page loaded successfully");
  }

  // ---------------------------
  // Component Functions
  // ---------------------------
  async clickOnboardComponentButton() {
    try {
      console.log("Looking for onboard component button");
      await this.page.waitForLoadState("domcontentloaded");

      // Try onboardExistingComponentButton first
      try {
        console.log("Trying to find onboard existing component button");
        await this.onboardExistingComponentButton.waitFor({
          state: "visible",
          timeout: 6000,
        });
        await this.onboardExistingComponentButton.click();
        console.log("Clicked onboard existing component button");
        return;
      } catch (error) {
        console.log(
          "Onboard existing component button not found, trying alternative",
          error
        );
      }

      // If not found, try onboardComponentButton
      try {
        console.log("Trying to find onboard component button");
        await this.onboardComponentButton.waitFor({
          state: "visible",
          timeout: 6000,
        });
        await this.onboardComponentButton.click();
        console.log("Clicked onboard component button");
        return;
      } catch (error) {
        console.log("Onboard component button not found");
      }

      throw new Error(
        "No Onboard Component button found in the application view."
      );
    } catch (error) {
      console.error("Error clicking onboard component button:", error);
      throw error;
    }
  }

  // New helper method for safe next button clicking
  async clickNextSafely(waitForLocator: () => Locator, timeout = 60000) {
    console.log("Attempting to click Next button safely");
    const start = Date.now();
    await this.page.waitForTimeout(1000);
    while (Date.now() - start < timeout) {
      try {
        const nextBtn = this.nextButton;
        if ((await nextBtn.isVisible()) && (await nextBtn.isEnabled())) {
          console.log("Next button is visible and enabled, clicking");
          await nextBtn.scrollIntoViewIfNeeded();
          await nextBtn.click({ force: true });

          // Wait for the next step to load
          for (let i = 0; i < 5; i++) {
            if (await waitForLocator().isVisible()) {
              console.log("Next step loaded successfully");
              return;
            }
            await this.page.waitForTimeout(300);
            await nextBtn.click({ force: true });
          }
        }
      } catch (error) {
        console.log("Error clicking Next button, retrying:", error);
      }
      await this.page.waitForTimeout(500);
    }
    throw new Error(
      "Next button not clickable or next step not visible in timeout"
    );
  }

  async clickNextSafelyV2() {
    console.log("Clicking Next button (simple approach)");

    try {
      await this.page.waitForLoadState("domcontentloaded");
      const nextBtn = this.nextButton;

      await nextBtn.waitFor({ state: "visible", timeout: 10000 });
      console.log("Next button found and visible");

      await nextBtn.scrollIntoViewIfNeeded();
      await nextBtn.click({ force: true });

      console.log("Next button clicked successfully");

      // Don't wait for anything else - let the calling code handle what comes next
    } catch (error) {
      if (this.page.isClosed()) {
        console.log("Page closed after Next click - this is likely expected");
        return;
      }
      throw error;
    }
  }

  async onboardNewComponent(
    kind: string,
    applicationName: string,
    name: string,
    description: string,
    owner: string,
    type: string,
    environment: string,
    option: string,
    repoLink: string,
    apiDefinitionPath: string,
    gcpProjectID: string
  ): Promise<void> {
    try {
      // Click onboard component button
      await this.clickOnboardComponentButton();

      // Select Kind
      await this.kindDropdown.waitFor({ state: "visible" });
      await this.kindDropdown.click();
      await this.kindComponentOption(kind).click();

      // Fill Name
      await this.newCompNameField.waitFor({ state: "visible" });
      await this.newCompNameField.fill(name);

      // Fill Description
      await this.compDescription.waitFor({ state: "visible" });
      await this.compDescription.fill(description);

      // Click Next with safe handling
      await this.clickNextSafely(() => this.page.getByLabel("Type:"));

      // Select Type
      await this.typeDropdown.waitFor({ state: "visible" });
      await this.typeDropdown.click();
      await this.selectTypeOption(type).click();

      // Select Environment
      await this.environmentDropdown.waitFor({ state: "visible" });
      await this.environmentDropdown.click();
      await this.selectEnvironmentOption(environment).click();

      // Region (only if type === "RESOURCE")
      if (kind.toLowerCase() === "resource") {
        await this.resourceRegionField.waitFor({ state: "visible" });
        await this.resourceRegionField.fill(apiDefinitionPath);
      }

      // Fill repository link (only in component and api)
      if (kind.toLowerCase() === "component" || kind.toLowerCase() === "api") {
        // Select source control provider
        await this.sourceControlProvider.waitFor({ state: "visible" });
        await this.sourceControlProvider.click();
        await this.selecSourceControlOption(option).click();

        // Fill repository
        await this.repoLinkField.waitFor({ state: "visible" });
        await this.repoLinkField.fill(repoLink);
      }

      // API Definition (only if type === "API")
      if (kind.toLowerCase() === "api" && apiDefinitionPath) {
        await this.apiDefinitionField.waitFor({ state: "visible" });
        await this.apiDefinitionField.fill(apiDefinitionPath);
      }

      // Fill GCP project name
      if (kind.toLowerCase() === "api" || kind.toLowerCase() === "resource") {
        await this.gcpProjectField.waitFor({ state: "visible" });
        await this.gcpProjectField.fill(gcpProjectID);
      }

      // Second click - just click and move on
      console.log("=== SECOND NEXT CLICK ===");
      await this.clickNextSafelyV2();

      // If we reach here, the page didn't close, so we can continue
      if (!this.page.isClosed()) {
        console.log("Page still open, looking for onboard button");
        // Look for the onboard button or handle next steps
      }

      // Third click - just click and move on
      console.log("=== THIRD NEXT CLICK ===");
      await this.clickNextSafelyV2();

      // If we reach here, the page didn't close, so we can continue
      if (!this.page.isClosed()) {
        console.log("Page still open, looking for onboard button");
        // Look for the onboard button or handle next steps
      }

      // Click Onboard
      await this.compOnboardButton.waitFor({ state: "visible" });
      await this.compOnboardButton.click();

      // Wait for success and view application button
      await this.viewApplicationButton.waitFor({ state: "visible", timeout: 60000 });
      await this.page.waitForLoadState("domcontentloaded");

      console.log(`Component ${name} onboarded successfully`);
    } catch (error) {
      console.error(`Error onboarding component ${name}:`, error);
      throw error;
    }
  }

  async viewComponent(
    componentName: string,
    componentRow: Locator,
    nextButtonComponentTable: Locator
  ): Promise<Locator> {
    try {
      console.log(`Viewing component: ${componentName}`);
      await this.handlePagination(
        componentRow,
        nextButtonComponentTable,
        "exists"
      );
      console.log(`Component ${componentName} found successfully`);
      return this.componentRow(componentName);
    } catch (error) {
      console.error(`Error viewing component ${componentName}:`, error);
      throw error;
    }
  }

  // ---------------------------
  // Component Editing Function
  // ---------------------------
  async editComponentByName(
    kind: string,
    componentName: string,
    updatedDescription: string,
    newOwner?: string,
    newEnvironment?: string,
    newRepoLink?: string,
    newApiDefinition?: string,
    newGcpProjectID?: string
  ): Promise<void> {
    try {
      console.log(`Editing component: ${componentName}`);

      // Navigate to application view (assume already inside)
      await this.page.waitForLoadState("domcontentloaded");

      // Locate component row and click Edit
      console.log(`Finding component row for: ${componentName}`);
      await this.handlePagination(
        this.componentRow(componentName),
        this.nextButtonComponentTable,
        "exists"
      );

      const editBtn = this.editButtonInRow(componentName);
      await editBtn.waitFor({ state: "visible", timeout: 10000 });
      await editBtn.click();
      console.log("Edit button clicked");

      // Update editable fields (Kind & Name not editable)
      // Update description
      if (updatedDescription) {
        console.log(`Updating description to: ${updatedDescription}`);
        await this.compDescription.waitFor({ state: "visible" });
        await this.compDescription.fill(updatedDescription);
      }

      // Update Owner (optional)
      if (newOwner) {
        console.log(`Updating owner to: ${newOwner}`);
        await this.compOwner.waitFor({ state: "visible" });
        await this.compOwner.click();
        await this.page.getByLabel(newOwner).click();
      }

      // Next step
      console.log("Clicking Next to proceed to next step");
      await this.nextButton.click();

      // Update Environment
      if (newEnvironment) {
        console.log(`Updating environment to: ${newEnvironment}`);
        await this.environmentDropdown.waitFor({ state: "visible" });
        await this.environmentDropdown.click();
        await this.selectEnvironmentOption(newEnvironment).click();
      }

      // Update Repo link
      if (newRepoLink) {
        console.log(`Updating repository link to: ${newRepoLink}`);
        await this.repoLinkField.waitFor({ state: "visible" });
        await this.repoLinkField.fill(newRepoLink);
      }

      // Update API Definition (if applicable)
      if (newApiDefinition) {
        console.log(`Updating API definition to: ${newApiDefinition}`);
        await this.apiDefinitionField.waitFor({ state: "visible" });
        await this.apiDefinitionField.fill(newApiDefinition);
      }

      // Update GCP Project ID
      if (newGcpProjectID) {
        console.log(`Updating GCP project ID to: ${newGcpProjectID}`);
        await this.gcpProjectField.waitFor({ state: "visible" });
        await this.gcpProjectField.fill(newGcpProjectID);
      }

      // Next → Preview → Save
      console.log("Clicking Next to proceed to preview");
      await this.nextButton.click();
      await this.nextButton.waitFor({ state: "visible" });
      await this.nextButton.click();

      console.log("Clicking Onboard to save changes");
      await this.compOnboardButton.waitFor({ state: "visible" });
      await this.compOnboardButton.click();

      console.log(`Component ${componentName} edited successfully`);
    } catch (error) {
      console.error(`Error editing component ${componentName}:`, error);
      throw error;
    }
  }
}
