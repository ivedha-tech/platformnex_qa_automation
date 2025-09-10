import { Page, Locator, expect } from "@playwright/test";

export class CloudOpsPage {
  readonly page: Page;

  // --- Common Locators ---
  readonly cloudOpsTab: Locator;
  readonly addResourceButton: Locator;
  readonly createResourceButton: Locator;
  readonly totalResourcesCount: Locator;
  readonly stackHealth: Locator;
  readonly workspaceStatus: Locator;
  readonly deleteAllResourcesButton: Locator;
  // Removed duplicate declaration of createDatabaseButton

  // --- Storage Locators ---
  readonly storageNameInput: Locator;

  // --- Database Locators ---
  readonly databaseTab: Locator;
  readonly databaseInstanceNameInput: Locator;
  readonly databaseNameInput: Locator;
  readonly databaseUsernameInput: Locator;
  readonly databasePasswordInput: Locator;
  readonly createDatabaseButton: Locator;
  

  constructor(page: Page) {
    this.page = page;

    // --- Common ---
    this.cloudOpsTab = page.getByRole("tab", { name: "CloudOps" });
    this.addResourceButton = page.getByRole("button", { name: "add Add Resource" });;
    this.createResourceButton = page.getByRole("button", { name: "Create Resource" });
    this.totalResourcesCount = page.locator('div').filter({ hasText: /^Total Resources9resources$/ }).nth(1);
    this.stackHealth = page.locator('div').filter({ hasText: /^Stack Health88%healthy$/ }).nth(1);
    this.workspaceStatus = page.locator('div').filter({ hasText: /^Workspace StatusActiverunning$/ }).nth(1);
    this.deleteAllResourcesButton = page.getByRole('button', { name: 'delete Delete Environment' });
    

    // --- Storage ---
    this.storageNameInput = page.getByPlaceholder("Enter storage name");

    // --- Database ---
    this.databaseTab = page.getByRole('tab', { name: 'Database' });
    this.databaseInstanceNameInput = page.getByPlaceholder('Enter database instance name');
    this.databaseNameInput = page.getByPlaceholder('Enter database name');
    this.databaseUsernameInput = page.getByPlaceholder("Enter database username");
    this.databasePasswordInput = page.getByPlaceholder("Enter database password");
    // Initialization of createDatabaseButton remains in the Database Locators section
        this.createDatabaseButton = page.getByRole('button', { name: 'Create Resource' });
    
  }

  // ---------- Common Methods ----------
  async openCloudOps() {
    await this.cloudOpsTab.waitFor({ state: "visible", timeout: 30000 });
    await this.cloudOpsTab.click();
    await this.page.waitForLoadState("networkidle");
  }

  async verifyPageLoaded() {
    await expect(this.addResourceButton).toBeVisible({ timeout: 30000 });
  }
  async addResource(resourceName: string) {
    await this.storageNameInput.waitFor({ state: "visible", timeout: 10000 });
    await this.storageNameInput.fill(resourceName);
  }

  async create() {
    await this.createResourceButton.waitFor({ state: "visible", timeout: 10000 });
    await this.createResourceButton.click();
  }

  async verifyResourceCreated(name: string) {
    const created = this.page.getByText(name);
    await expect(created).toBeVisible({ timeout: 20000 });
  }

  async getTotalResourcesCount() {
    const text = await this.totalResourcesCount.innerText();
    return parseInt(text);
  }

  async verifyStackHealthVisible() {
    await expect(this.stackHealth).toBeVisible({ timeout: 10000 });
  }

  async verifyWorkspaceStatus(expected: string) {
    const status = await this.workspaceStatus.innerText();
    expect(status.trim()).toBe(expected);
  }

  async deleteAllResources() {
    await this.deleteAllResourcesButton.waitFor({ state: "visible", timeout: 10000 });
    await this.deleteAllResourcesButton.click();
    const confirmBtn = this.page.getByRole("button", { name: "Confirm" });
    await confirmBtn.waitFor({ state: "visible", timeout: 10000 });
    await confirmBtn.click();
  }

  // ---------- Storage Methods ----------
  async addStorage(name: string) {
    await this.storageNameInput.waitFor({ state: "visible", timeout: 10000 });
    await this.storageNameInput.fill(name);
  }

  // ---------- Database Methods ----------
  async openDatabaseTab() {
    await this.databaseTab.waitFor({ state: "visible", timeout: 30000 });
    await this.databaseTab.click();
  }

  async fillDatabaseForm(instanceName: string, version: string, dbName: string, username: string, password: string) {
    await this.databaseInstanceNameInput.fill(instanceName);
    await this.databaseNameInput.fill(dbName);
    await this.databaseUsernameInput.fill(username);
    await this.databasePasswordInput.fill(password);
  }

    async clickCreateDatabaseButton() {
        await this.createDatabaseButton.waitFor({ state: "visible", timeout: 10000 });
        await this.createDatabaseButton.click();
    }
}
