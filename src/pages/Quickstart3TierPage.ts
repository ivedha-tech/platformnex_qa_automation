import { Page } from "@playwright/test";

export class Quickstart3TierPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

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
      await this.page.waitForSelector(this.nameInput, { state: "visible", timeout: 10000 });
      return true;
    } catch (error) {
      console.error("Failed to click 3-Tier button:", error);
      return false;
    }
  }
  // ---------- Locators ----------
  readonly nameInput = '//*[@id="component_id"]';
  readonly descriptionInput = '//*[@id="description"]';
  readonly ownerInput = '//*[@id="owner"]';
  readonly systemInput = '//*[@id="system"]';
  readonly basicNextButton = '//*[@id="radix-:rl:"]/div[4]/div/button';

  readonly repoOwnerInput = '//*[@id="radix-:rl:"]/div[3]/div/div/div[2]/div[5]/div/div[2]/input';
  readonly repoNameInput = '//*[@id="radix-:rl:"]/div[3]/div/div/div[2]/div[5]/div/div[3]/input';
  readonly serviceNameInput = '//*[@id="frontend_service_name"]'
  readonly serviceDescInput = '//*[@id="frontend_service_description"]';
  readonly frontendNextButton = '//*[@id="radix-:rl:"]/div[4]/div/button[2]';

  readonly backendRepoOwnerInput = '//*[@id="radix-:rl:"]/div[3]/div/div/div[3]/div[3]/div/div[2]/input';
  readonly backendRepoNameInput = '//*[@id="radix-:rl:"]/div[3]/div/div/div[3]/div[3]/div/div[3]/input';
  readonly backendServiceNameInput = '//*[@id="backend_service_name"]';
  readonly backendServiceDescInput = '//*[@id="backend_service_description"]';
  readonly dependOnServiceInput = '//*[@id="backend_service_depend_on"]';
  readonly dbServiceNameInput = '//*[@id="database_service_name"]';
  readonly dbNameInput = '//*[@id="database_name"]';
  readonly dbPasswordInput =  "#database_password";
  readonly backendNextButton = '//*[@id="radix-:rl:"]/div[4]/div/button[2]';

  readonly projectInput = '//*[@id="project"]';
  readonly infraNextButton = '//*[@id="radix-:rl:"]/div[4]/div/button[2]';

  readonly submitButton = '//*[@id="radix-:rl:"]/div[4]/div/button[2]';
  readonly successMsg = "text=Log streaming completed";

  // ---------- Form Fill Methods ----------

  async fillBasicInfo(data: { name: string; description: string; owner: string; system: string }) {
    await this.page.fill(this.nameInput, data.name);
    await this.page.fill(this.descriptionInput, data.description);
  // Owner Dropdown
  const ownerDropdown = this.page.locator(this.ownerInput);
   await ownerDropdown.click(); // open dropdown
   await this.page.locator("role=option[name='guests']").click(); // direct click using accessible role

// System Dropdown
   const systemDropdown = this.page.locator(this.systemInput);
   await systemDropdown.click(); // open dropdown
   await this.page.locator("role=option[name='Platformnex']").click(); // direct click using role

    await this.page.click(this.basicNextButton);
    await this.page.waitForSelector(this.repoOwnerInput, { timeout: 30000 });
  }

  async fillFrontendConfig(data: { repoOwner: string; repoName: string; serviceName: string; serviceDescription: string }) {
    await this.page.fill(this.repoOwnerInput, data.repoOwner);
    await this.page.fill(this.repoNameInput, data.repoName);
    await this.page.fill(this.serviceNameInput, data.serviceName);
    await this.page.fill(this.serviceDescInput, data.serviceDescription);
    await this.page.click(this.frontendNextButton);
    await this.page.waitForSelector(this.backendRepoOwnerInput, { timeout: 50000 });
  }
  
  

  async fillBackendConfig(data: { repoOwner: string; repoName: string; serviceName: string; serviceDescription: string; dependOnService: string; dbServiceName: string; dbName: string; dbPassword: string }) {
    await this.page.fill(this.backendRepoOwnerInput, data.repoOwner);
    await this.page.fill(this.backendRepoNameInput, data.repoName);
    await this.page.fill(this.backendServiceNameInput, data.serviceName);
    await this.page.fill(this.backendServiceDescInput, data.serviceDescription);
    await this.page.fill(this.dependOnServiceInput, data.dependOnService);
    await this.page.fill(this.dbServiceNameInput, data.dbServiceName);
    await this.page.fill(this.dbNameInput, data.dbName);
    await this.page.fill(this.dbPasswordInput, data.dbPassword);
    await this.page.click(this.backendNextButton);
    await this.page.waitForSelector(this.projectInput, { timeout: 30000 });
  }

  async fillInfrastructureConfig(data: { project: string }) {
    await this.page.fill(this.projectInput, data.project);
    await this.page.click(this.infraNextButton);
    await this.page.waitForSelector(this.submitButton, { timeout: 50000 });
  }
  async reviewAndSubmit() {
    // Click Submit
    await this.page.click(this.submitButton);

    // Wait for the Pulumi success message up to 10 minutes
    await this.page.locator(this.successMsg).waitFor({ timeout: 600_000 });

    // Optional: log that deployment is complete
    console.log("Log streaming completed");
}

}
