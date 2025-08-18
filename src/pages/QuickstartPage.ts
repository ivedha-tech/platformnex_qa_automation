import { Page } from '@playwright/test';

export class QuickstartPage {
  constructor(private page: Page) {}

  async gotoQuickstart() {
    await this.page.locator('text=Quickstart').click();
    await this.page.locator('h1:has-text("Quickstart")').waitFor({ timeout: 10000 });
  }

  async chooseThreeTierApp() {
    await this.page.locator('button:has-text("3-Tier App")').click();
  }

  async fillBasicInfo(appName: string, description: string) {
    await this.page.fill('input[name="appName"]', appName);
    await this.page.fill('textarea[name="description"]', description);
  }

  async proceedNextSteps() {
    await this.page.locator('button:has-text("Next")').click();
    await this.page.waitForTimeout(1000); // tweak as needed
  }

  async runApp() {
    await this.page.locator('button:has-text("Run")').click();
    await this.page.locator('text=Success').waitFor({ timeout: 20000 });
  }
}
