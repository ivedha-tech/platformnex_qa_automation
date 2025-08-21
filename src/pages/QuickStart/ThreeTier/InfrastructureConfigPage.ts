// src/pages/QuickStart/ThreeTier/InfrastructureConfigPage.ts
import { Page, expect } from '@playwright/test';

export class InfrastructureConfigPage {
  readonly page: Page;

  // Locators
  readonly projectInput = '//*[@id="project"]';
  readonly nextButton = '//*[@id="radix-:rl:"]/div[4]/div/button[2]';

  constructor(page: Page) {
    this.page = page;
  }

  async fillInfrastructureConfig(project: string) {
    // Wait for Project input to be visible
    await this.page.waitForSelector(this.projectInput, { state: "visible" });

    // Fill Project
    await this.page.fill(this.projectInput, project);
    await expect(this.page.locator(this.projectInput)).toHaveValue(project);
    await this.page.waitForTimeout(1500); // Optional: wait for input to stabilize

    // Click Next
    await this.page.click(this.nextButton);

    // Wait for next page to load completely
    await this.page.waitForLoadState('networkidle');
  }
}
