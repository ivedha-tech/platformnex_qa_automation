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
    this.sidebarTabApplication = page.getByRole('complementary').getByRole('link', { name: 'Applications' });

    // Component locators
    this.onboardExistingComponentButton = page.getByRole('button', { name: /onboard\s+existing\s+component/i });
    this.onboardComponentButton = page.getByRole('button', { name: /onboard\s+component/i });
    this.kindDropdown = page.getByLabel("Kind:");
    this.kindComponentOption = (kind: string) => page.getByLabel(`${kind}`);
    this.newCompNameField = page.getByPlaceholder("Name...");
    this.compDescription = page.getByPlaceholder("Enter description...");
    this.compOwner = page.getByLabel("Owner:");
    this.compTags = page.getByLabel("Tags");
    this.typeDropdown = page.getByLabel("Type:");
    this.selectTypeOption = (type: string) => page.getByLabel(`${type}`);
    this.environmentDropdown = page.getByLabel('Environment:');
    this.selectEnvironmentOption = (environment: string) => page.getByLabel(`${environment}`);
    this.sourceControlProvider = page.getByRole('button', { name: /github/i });
    this.selecSourceControlOption = (option: string) => page.getByLabel(`${option}`);
    this.repoLinkField = page.getByPlaceholder("repository link...");
    this.gcpProjectField = page.getByPlaceholder("gcp project name...");
    this.nextButton = page.getByRole('button', { name: 'Next' });
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
      this.page.getByRole('row', { name: new RegExp(`^${name} .*`, 'i') }).getByRole('img').nth(1);

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
    this.componentOnboardedSuccess = page.getByRole("heading", {
      name: /Component/,
    });
    this.apiOnboardedSuccess = page.getByRole("heading", { name: /API/ });
    this.resourceOnboardedSuccess = page.getByRole("heading", {
      name: /Resource/,
    });
    this.editComponentSuccess = page.getByRole("heading", {
      name: /Successfully!/,
    });

    // application
    this.applicationCardByName = (name: string) => page.getByRole('heading', { name: new RegExp(`^${name}$`, 'i') });
    this.paginationNextButton = page.getByRole('button', { name: 'chevron_right' });
  }

  // ---------------------------
  // Application Functions
  // ---------------------------
  async onboardNewApplication(
    name: string,
    description: string,
    owner: string
  ): Promise<void> {
    //await this.handleTour();
    await this.onboardApplicationButton.click();

    await this.newAppName.waitFor({ state: "visible" });
    await this.newAppName.fill(name);

    await this.appDescription.waitFor({ state: "visible" });
    await this.appDescription.fill(description);

    await this.appOwner.click();
    await this.appOwnerselector.click();
    await this.appOnboardButton.click();

    await this.page.waitForLoadState("domcontentloaded");
  }

  async viewApplication(name?: string): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    if (name) {
      // Navigate to Applications list first, then select by name
      await this.sidebarTabApplication.waitFor({ state: 'visible', timeout: 30000 });
      await this.sidebarTabApplication.click();
      await this.page.waitForLoadState('networkidle');
      await this.selectApplicationByName(name);
    } else {
      await this.viewApplicationButton.waitFor({ state: 'visible' });
      await this.viewApplicationButton.click();
    }
  }

  async startOverApplication(): Promise<void> {
    await this.startOverButton.waitFor({ state: "visible" });
    await this.startOverButton.click();
  }

  async editApplication(
    name: string,
    updatedDescription: string,
    tags: string[]
  ): Promise<void> {
    await this.appDescription.waitFor({ state: "visible" });
    await this.appDescription.fill(updatedDescription);

    if (tags.length) {
      await this.compTags.waitFor({ state: "visible" });
      await this.compTags.fill(tags.join(", "));
    }

    await this.appOnboardButton.waitFor({ state: "visible" });
    await this.appOnboardButton.click();

    await this.applicationNameView(name).waitFor({
      state: "visible",
      timeout: 60000,
    });
  }
  async selectApplicationByName(name: string): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded");
    await this.handlePagination(
      this.applicationCardByName(name),
      this.paginationNextButton,
      "click"
    );
  }

  // ---------------------------
  // Component Functions
  // ---------------------------
  async clickOnboardComponentButton() {
    // Ensure we are on Components tab if it exists
    const componentsTab = this.page.getByRole('tab', { name: /components/i });
    if (await componentsTab.isVisible().catch(() => false)) {
      await componentsTab.click();
      await this.page.waitForLoadState('domcontentloaded');
    }

    const candidates: Locator[] = [
      this.onboardExistingComponentButton,
      this.onboardComponentButton,
      this.page.getByRole('button', { name: /Onboard\s+(Existing\s+)?Component/i }),
      this.page.locator('button:has-text("Onboard Component")'),
      this.page.locator('button:has-text("Onboard Existing Component")'),
      this.page.getByRole('button', { name: /onboard/i }),
    ];

    for (const candidate of candidates) {
      if (await candidate.isVisible().catch(() => false)) {
        await candidate.click();
        return;
      }
    }

    // Try opening any add/create menu to reveal options
    const addButtons = [
      this.page.getByRole('button', { name: /add|add_circle|create|new/i }),
      this.page.locator('button:has-text("add")'),
    ];
    for (const addBtn of addButtons) {
      if (await addBtn.isVisible().catch(() => false)) {
        await addBtn.click();
        const menuOptions: Locator[] = [
          this.page.getByRole('menuitem', { name: /Onboard\s+Component/i }),
          this.page.getByRole('menuitem', { name: /Onboard\s+Existing\s+Component/i }),
          this.page.getByRole('menuitem', { name: /Onboard/i }),
          this.page.getByRole('button', { name: /Onboard\s+Component/i }),
          this.page.getByRole('button', { name: /Onboard\s+Existing\s+Component/i }),
        ];
        for (const opt of menuOptions) {
          if (await opt.isVisible().catch(() => false)) {
            await opt.click();
            return;
          }
        }
      }
    }

    // Debug: list all buttons to help identify correct selector
    try {
      const allButtons = await this.page.getByRole('button').allTextContents();
      console.log('Onboard Component button not found. Buttons on page:', allButtons);
      console.log('Current URL:', this.page.url());
      const bodyText = await this.page.locator('body').innerText();
      const snippet = bodyText.slice(0, 4000);
      console.log('Page text snippet:', snippet);
    } catch {}

    throw new Error("No Onboard Component button found in the application view.");
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

    // Click Next
    await this.nextButton.click();

    // Select Type
    await this.typeDropdown.waitFor({ state: "visible" });
    await this.typeDropdown.click();
    await this.selectTypeOption(type).click();

    // Select Environment
    await this.environmentDropdown.waitFor({ state: "visible" });
    await this.environmentDropdown.click();
    await this.selectEnvironmentOption(environment).click();

    // -----------------------------------------
    // Region (only if type === "RESOURCE")
    // -----------------------------------------
    if (kind.toLowerCase() === "resource") {
      await this.resourceRegionField.waitFor({ state: "visible" });
      await this.resourceRegionField.fill(apiDefinitionPath);
    }

    // -----------------------------------------
    // Fill repository link (only in component and api)
    // -------------------------------------
    if (kind.toLowerCase() === "component" || kind.toLowerCase() === "api") {
      // Select source control provider
      await this.sourceControlProvider.waitFor({ state: "visible" });
      await this.sourceControlProvider.click();
      await this.selecSourceControlOption(option).click();

      // Fill repository
      await this.repoLinkField.waitFor({ state: "visible" });
      await this.repoLinkField.click();
      await this.repoLinkField.fill(repoLink);
    }
    
    // -----------------------------------------
    // API Definition (only if type === "API")
    // -----------------------------------------
    if (kind.toLowerCase() === "api" && apiDefinitionPath) {
      await this.apiDefinitionField.waitFor({ state: "visible" });
      await this.apiDefinitionField.fill(apiDefinitionPath);
    }

    // Fill GCP project name
    await this.gcpProjectField.waitFor({ state: "visible" });
    await this.gcpProjectField.fill(gcpProjectID);

    // Click Next 
    await this.nextButton.waitFor({ state: "visible" });
    await this.nextButton.click();
    await this.page.waitForLoadState("domcontentloaded");

    // -----------------------------------------
    // TODO: check preview with entered values
    // -----------------------------------------

    // Click Next 
    await this.page.waitForLoadState("domcontentloaded");
    await this.nextButton.waitFor({ state: "visible" });
    await this.nextButton.click();

    // Click Onboard
    await this.compOnboardButton.waitFor({ state: "visible" });
    await this.compOnboardButton.click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async viewComponent(componentName: string, componentRow: Locator, nextButtonComponentTable: Locator): Promise<Locator> {
    await this.handlePagination(
      componentRow,
      nextButtonComponentTable,
      "exists"
    );
    return this.componentRow(componentName);
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
    // Navigate to application view (assume already inside)
    await this.page.waitForLoadState("domcontentloaded");

    // Locate component row and click Edit
    await this.handlePagination(
      this.componentRow(componentName),
      this.nextButtonComponentTable,
      "exists"
    );

    const editBtn = this.editButtonInRow(componentName);
    await editBtn.waitFor({ state: "visible", timeout: 10000 });
    await editBtn.click();

    // -----------------------------------------
    // Update editable fields (Kind & Name not editable)
    // -----------------------------------------

    // Update description
    if (updatedDescription) {
      await this.compDescription.waitFor({ state: "visible" });
      await this.compDescription.fill(updatedDescription);
    }

    // Update Owner (optional)
    if (newOwner) {
      await this.compOwner.waitFor({ state: "visible" });
      await this.compOwner.click();
      await this.page.getByLabel(newOwner).click();
    }

    // Next step
    await this.nextButton.click();

    // Update Environment
    if (newEnvironment) {
      await this.environmentDropdown.waitFor({ state: "visible" });
      await this.environmentDropdown.click();
      await this.selectEnvironmentOption(newEnvironment).click();
    }

    // Update Repo link
    if (newRepoLink) {
      await this.repoLinkField.waitFor({ state: "visible" });
      await this.repoLinkField.fill(newRepoLink);
    }

    // Update API Definition (if applicable)
    if (newApiDefinition) {
      await this.apiDefinitionField.waitFor({ state: "visible" });
      await this.apiDefinitionField.fill(newApiDefinition);
    }

    // Update GCP Project ID
    if (newGcpProjectID) {
      await this.gcpProjectField.waitFor({ state: "visible" });
      await this.gcpProjectField.fill(newGcpProjectID);
    }

    // Next → Preview → Save
    await this.nextButton.click();
    await this.nextButton.waitFor({ state: "visible" });
    await this.nextButton.click();

    await this.compOnboardButton.waitFor({ state: "visible" });
    await this.compOnboardButton.click();
  }
}
