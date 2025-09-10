import { Page, Locator } from "@playwright/test";

export class Quickstart3TierPage {
  readonly page: Page;
   // ---------- Actions ----------

  // Click 3-Tier button and wait for navigation/modal
  async click3TierButton(): Promise<boolean> {
    try {
      const button = this.page.locator(
        'xpath=//*[@id="root"]/div[2]/div/div/div/div[4]/div[3]/div/div[3]/button'
      );
      await button.waitFor({ state: "visible", timeout: 10000 });
      await button.click();
  
      // Wait for first input in 3-Tier form to appear
      await this.nameInput.waitFor({ state: "visible", timeout: 10000 });
      return true;
    } catch (error) {
      console.error("Failed to click 3-Tier button:", error);
      return false;
    }
  }


  // ---------- Locators ----------
  // Basic Info
  readonly nameInput: Locator;
  readonly descriptionInput: Locator;
  readonly ownerInput: Locator;
  readonly systemInput: Locator;
  readonly basicNextButton: Locator;

  // Frontend
  readonly repoOwnerInput: Locator;
  readonly repoNameInput: Locator;
  readonly serviceNameInput: Locator;
  readonly serviceDescInput: Locator;
  readonly frontendNextButton: Locator;

  // Backend
  readonly backendRepoOwnerInput: Locator;
  readonly backendRepoNameInput: Locator;
  readonly backendServiceNameInput: Locator;
  readonly backendServiceDescInput: Locator;
  readonly dependOnServiceInput: Locator;
  readonly dbServiceNameInput: Locator;
  readonly dbNameInput: Locator;
  readonly dbPasswordInput: Locator;
  readonly backendNextButton: Locator;

  // Infra & submit
  readonly projectInput: Locator;
  readonly infraNextButton: Locator;
  readonly submitButton: Locator;
  readonly successMsg: Locator;

  constructor(page: Page) {
    this.page = page;

    // Basic Info
    this.nameInput = page.getByPlaceholder('Unique name of the component');
    this.descriptionInput = page.getByPlaceholder('Help others understand what');
    this.ownerInput = page.getByLabel('Owner*');
    this.systemInput = page.getByLabel('System*');
    this.basicNextButton = page.getByRole('button', { name: 'Next' });

    // Frontend
    this.repoOwnerInput = page.getByRole('textbox', { name: 'Enter GitHub username or' });
    this.repoNameInput = page.getByRole('textbox', { name: 'Enter repository name' });
    this.serviceNameInput = page.getByRole('textbox', { name: 'Service Name*' });
    this.serviceDescInput = page.getByRole('textbox', { name: 'Service Description' });
    this.frontendNextButton = page.getByRole('button', { name: 'Next' });

    // Backend
    this.backendRepoOwnerInput = page.getByRole('textbox', { name: 'Enter GitHub username or' });
    this.backendRepoNameInput = page.getByRole('textbox', { name: 'Enter repository name' });
    this.backendServiceNameInput = page.getByRole('textbox', { name: 'Service Name*', exact: true });
    this.backendServiceDescInput = page.getByRole('textbox', { name: 'Service Description' });
    this.dependOnServiceInput = page.getByPlaceholder('Depend On Service Name for');
    this.dbServiceNameInput = page.getByPlaceholder('Service Name for the database');
    this.dbNameInput = page.getByPlaceholder('Name of the database (default');
    this.dbPasswordInput = page.getByPlaceholder('Password for the database');
    this.backendNextButton = page.getByRole('button', { name: 'Next' });

    // Infra & submit
    this.projectInput = page.getByPlaceholder('Project for deployments');
    this.infraNextButton = page.getByRole('button', { name: 'Next' });
    this.submitButton = page.getByRole('button', { name: 'Create' });
    this.successMsg = page.getByText('Log streaming completed');
  }

  // ---------- Actions ----------
  async fillBasicInfo(data: { name: string; description: string; owner: string; system: string }) {
    await this.nameInput.fill(data.name);
    await this.descriptionInput.fill(data.description);

   // Owner Dropdown
  const ownerDropdown = this.ownerInput;
    await ownerDropdown.click();
    await this.page.getByText(data.owner, { exact: true }).click();
    // System Dropdown
    const systemDropdown = this.systemInput;
    await systemDropdown.click();
    await this.page.getByText(data.system, { exact: true }).click();                                  
    await this.basicNextButton.click();
  }

  async fillFrontendConfig(data: { repoOwner: string; repoName: string; serviceName: string; serviceDescription: string }) {
    await this.repoOwnerInput.fill(data.repoOwner);
    await this.repoNameInput.fill(data.repoName);
    await this.serviceNameInput.fill(data.serviceName);
    await this.serviceDescInput.fill(data.serviceDescription);
    await this.frontendNextButton.click();
  }

  async fillBackendConfig(data: { repoOwner: string; repoName: string; serviceName: string; serviceDescription: string; dependOnService: string; dbServiceName: string; dbName: string; dbPassword: string }) {
    await this.backendRepoOwnerInput.fill(data.repoOwner);
    await this.backendRepoNameInput.fill(data.repoName);
    await this.backendServiceNameInput.fill(data.serviceName);
    await this.backendServiceDescInput.fill(data.serviceDescription);
    await this.dependOnServiceInput.fill(data.dependOnService);
    await this.dbServiceNameInput.fill(data.dbServiceName);
    await this.dbNameInput.fill(data.dbName);
    await this.dbPasswordInput.fill(data.dbPassword);
    await this.backendNextButton.click();
  }

  async fillInfrastructureConfig(data: { project: string }) {
    await this.projectInput.fill(data.project);
    await this.infraNextButton.click();
  }

  async reviewAndSubmit() {
    // Click Submit button
    await this.submitButton.click();

    // Wait for the Pulumi success message
    await this.successMsg.waitFor({ timeout: 600_000 });

    // Optional log
    console.log("Log streaming completed");
}
}
