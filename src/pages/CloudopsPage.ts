import { Page, Locator, expect } from "@playwright/test";

export class CloudOpsPage {
  readonly page: Page;

  // --- Common Locators ---
  readonly cloudOpsTab: Locator;
  readonly updateGcpButton: Locator;
  readonly gcpProjectInput: Locator;
  readonly submitButton: Locator;
  readonly addResourceButton: Locator;
  readonly createResourceButton: Locator;
  readonly totalResourcesCount: Locator;
  readonly stackHealth: Locator;
  readonly workspaceStatus: Locator;
  readonly deleteAllResourcesButton: Locator;
  readonly confirmDeleteButton: Locator;

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
    this.updateGcpButton = page.getByRole("button", { name: "Update GCP Project ID" });
    this.gcpProjectInput = page.getByPlaceholder("prj-dev-platform-next");
    this.submitButton = page.getByRole("button", { name: "Submit" });
    this.addResourceButton = page.getByRole("button", { name: "add Add Resource" });
    this.createResourceButton = page.getByRole("button", { name: "Create Resource" });
    this.totalResourcesCount = page.locator("div").filter({ hasText: /^Total Resources/ }).first();
    this.stackHealth = page.locator("div").filter({ hasText: /^Stack Health/ }).first();
    this.workspaceStatus = page.locator("div").filter({ hasText: /^Workspace Status/ }).first();
    this.deleteAllResourcesButton = page.getByRole('button', { name: 'delete Delete Stack' });
    this.confirmDeleteButton = page.getByRole('button', { name: ' Delete Stack' });
    
    // --- Storage ---
    this.storageNameInput = page.getByPlaceholder("Enter storage name");
    this.createResourceButton = page.getByRole('button', { name: 'Create Resource' });

    // --- Database ---
    this.databaseTab = page.getByRole("tab", { name: "Database" });
    this.databaseInstanceNameInput = page.getByPlaceholder("Enter database instance name");
    this.databaseNameInput = page.getByPlaceholder("Enter database name");
    this.databaseUsernameInput = page.getByPlaceholder("Enter database username");
    this.databasePasswordInput = page.getByPlaceholder("Enter database password");
    this.createDatabaseButton = page.getByRole("button", { name: "Create Resource" });
  }
  // Dynamic select component from dropdown
async selectComponentForUpdate(componentName: string) {
  // click apiTestAPI-* button (dynamic one)
  const dynamicButton = this.page.locator("button").filter({ hasText: "apiTestAPI-" }).first();
  await dynamicButton.click();

  // select the component created just now
  const option = this.page.getByRole("option", { name: new RegExp(componentName) });
  await option.click();
}

// Update GCP Project ID
async updateGcpProjectId(projectId: string) {
  await this.updateGcpButton.click();
  await this.gcpProjectInput.fill(projectId);
  await this.submitButton.click();

  // Hard refresh after update
  await this.page.reload();
  await this.page.waitForLoadState("networkidle");
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

  async getTotalResourcesCount() {
    // Check if "No Cloud Resources" heading is visible
    if (await this.page.getByRole('heading', { name: 'No Cloud Resources' }).isVisible()) {
      return 0;
    }
  
    // Else parse the count from "Total Resources" text
    const text = await this.totalResourcesCount.innerText();
    const match = text.match(/Total Resources\s+(\d+)/);
    if (!match) throw new Error(`Unexpected text: ${text}`);
    return parseInt(match[1], 10);
  }

  async deleteAllResources() {
    await this.deleteAllResourcesButton.waitFor({ state: "visible", timeout: 20000 });
    await this.deleteAllResourcesButton.click();
    await this.confirmDeleteButton.waitFor({ state: "visible", timeout: 20000 });
    await this.confirmDeleteButton.click();
  }

  // ---------- Storage Methods ----------
  async addStorage(name: string) {
    await this.storageNameInput.waitFor({ state: "visible", timeout: 20000 });
    await this.storageNameInput.fill(name);
  }

  async createStorage() {
    await this.createResourceButton.waitFor({ state: "visible", timeout: 20000 });
    await this.createResourceButton.click();
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

  async createDatabase() {
    await this.createDatabaseButton.waitFor({ state: "visible", timeout: 10000 });
    await this.createDatabaseButton.click();
  }
}
