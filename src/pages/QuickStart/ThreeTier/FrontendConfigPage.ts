// src/pages/QuickStart/ThreeTier/FrontendConfigPage.ts
import { Page, expect } from '@playwright/test';

export class FrontendConfigPage {
  readonly page: Page;

  // Locators (only editable fields)
  readonly ownerInput = '//*[@id="radix-:rl:"]/div[3]/div/div/div[2]/div[5]/div/div[2]/input';        // Owner input box
  readonly repoInput = '//*[@id="radix-:rl:"]/div[3]/div/div/div[2]/div[5]/div/div[3]/input';         // Repository name
  readonly serviceNameInput = '//*[@id="frontend_service_name"]';                                     // Service Name
  readonly serviceDescInput = '//*[@id="frontend_service_description"]';                              // Service Description
  readonly nextButton = '//*[@id="radix-:rl:"]/div[4]/div/button[2]';                                // Next button

  constructor(page: Page) {
    this.page = page;
  }

  async fillFrontendConfig(owner: string, repo: string, serviceName: string, serviceDesc: string) {
    // Fill Owner
    await this.page.waitForSelector(this.ownerInput, { state: "visible" });
    await this.page.fill(this.ownerInput, owner);
    await expect(this.page.locator(this.ownerInput)).toHaveValue(owner);
    await this.page.waitForTimeout(1500); // Optional: wait for input to stabilize

    // Fill Repository
    await this.page.waitForSelector(this.repoInput, { state: "visible" });
    await this.page.fill(this.repoInput, repo);
    await expect(this.page.locator(this.repoInput)).toHaveValue(repo);
    await this.page.waitForTimeout(1500); // Optional: wait for input to stabilize

    // Fill Service Name
    await this.page.waitForSelector(this.serviceNameInput, { state: "visible" });
    await this.page.fill(this.serviceNameInput, serviceName);
    await expect(this.page.locator(this.serviceNameInput)).toHaveValue(serviceName);
    await this.page.waitForTimeout(1500); // Optional: wait for input to stabilize

    // Fill Service Description
    await this.page.waitForSelector(this.serviceDescInput, { state: "visible" });
    await this.page.fill(this.serviceDescInput, serviceDesc);
    await expect(this.page.locator(this.serviceDescInput)).toHaveValue(serviceDesc);
    await this.page.waitForTimeout(1500); // Optional: wait for input to stabilize

    // Click Next
    await this.page.click(this.nextButton);

    // Wait for next page to fully load
    await this.page.waitForLoadState('networkidle');
  }
}
