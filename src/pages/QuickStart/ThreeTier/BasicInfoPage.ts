// src/pages/QuickStart/ThreeTier/BasicInfoPage.ts
import { Page } from '@playwright/test';

export class BasicInfoPage {
  readonly page: Page;

  // Locators
  readonly projectNameInput = '//*[@id="component_id"]';
  readonly descriptionInput = '//*[@id="description"]';
  readonly ownerDropdown = '//*[@id="owner"]';
  readonly systemDropdown = '//*[@id="system"]';
  readonly nextButton = 'css=.gap-2 > .bg-primary';

  constructor(page: Page) {
    this.page = page;
  }

  async fillBasicInfo(projectName: string, description: string, owner: string, system: string) {
    // Fill Project Name and Description
    await this.page.fill(this.projectNameInput, projectName);
    await this.page.waitForTimeout(1500); // Optional: wait for input to stabilize
    await this.page.fill(this.descriptionInput, description);
    await this.page.waitForTimeout(1500); // Optional: wait for input to stabilize

  // click the ownwer dropdown and select quests
    await this.page.click(this.ownerDropdown);
    await this.page.click(`//button[contains(.,'guests')]`, { force: true });
    await this.page.waitForTimeout(2500); // Optional: wait for dropdown to stabilize

    // Select System
    await this.page.click(this.systemDropdown);
    await this.page.click("//button[contains(.,'Platformnex')]", { force: true });
    await this.page.waitForTimeout(2500); // Optional: wait for dropdown to stabilize

    // Click Next
    await this.page.click(this.nextButton);

    // Optional: wait until next page is loaded
    await this.page.waitForLoadState('networkidle');
  }
}
