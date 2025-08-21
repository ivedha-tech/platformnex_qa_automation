// src/pages/QuickStart/ThreeTier/BackendConfigPage.ts
import { Page, expect } from "@playwright/test";

export class BackendConfigPage {
  readonly page: Page;

  // Locators
  readonly ownerInput ='//*[@id="radix-:rl:"]/div[3]/div/div/div[3]/div[3]/div/div[2]/input';
  readonly repositoryInput ='//*[@id="radix-:rl:"]/div[3]/div/div/div[3]/div[3]/div/div[3]/input';
  readonly serviceNameInput = '//*[@id="backend_service_name"]';
  readonly dbServiceNameInput = '//*[@id="database_service_name"]';
  readonly dbNameInput = '//*[@id="database_name"]';
  readonly dbPasswordInput = "#database_password";
  readonly nextButton = '//*[@id="radix-:rl:"]/div[4]/div/button[2]';

  constructor(page: Page) {
    this.page = page;
  }

  async fillBackendConfig(
    owner: string,
    repository: string,
    serviceName: string,
    dbServiceName: string,
    dbName: string,
    dbPassword: string
  ) {
    // Fill Owner
    await this.page.fill(this.ownerInput, owner);
    await expect(this.page.locator(this.ownerInput)).toHaveValue(owner);
    await this.page.waitForTimeout(1500); // Optional: wait for input to stabilize

    // Fill Repository
    await this.page.fill(this.repositoryInput, repository);
    await expect(this.page.locator(this.repositoryInput)).toHaveValue(repository);
    await this.page.waitForTimeout(1500); // Optional: wait for input to stabilize

    // Fill Service Name
    await this.page.fill(this.serviceNameInput, serviceName);
    await expect(this.page.locator(this.serviceNameInput)).toHaveValue(serviceName);
    await this.page.waitForTimeout(1500); // Optional: wait for input to stabilize

    // Fill Database Service Name
    await this.page.fill(this.dbServiceNameInput, dbServiceName);
    await expect(this.page.locator(this.dbServiceNameInput)).toHaveValue(dbServiceName);
    await this.page.waitForTimeout(1500); // Optional: wait for input to stabilize

    // Fill Database Name
    await this.page.fill(this.dbNameInput, dbName);
    await expect(this.page.locator(this.dbNameInput)).toHaveValue(dbName);
    await this.page.waitForTimeout(1500); // Optional: wait for input to stabilize

    // Fill Database Password
    await this.page.fill(this.dbPasswordInput, dbPassword);
    await expect(this.page.locator(this.dbPasswordInput)).toHaveValue(dbPassword);
    await this.page.waitForTimeout(1500); // Optional: wait for input to stabilize

    // Click Next
    await this.page.click(this.nextButton);

    // Wait for navigation / next step to finish
    await this.page.waitForLoadState("networkidle");
  }
}
