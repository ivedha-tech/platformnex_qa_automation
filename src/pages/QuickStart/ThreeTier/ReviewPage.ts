import { Page } from '@playwright/test';

export class ReviewPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async reviewAndSubmit() {
    // Click the "Review & Submit" button
    await this.page.click('//*[@id="radix-:rl:"]/div[4]/div/button[2]');

    // ✅ Wait until "Pulumi Infrastructure Logs Completed" appears (up to 10 minutes)
    await this.page
      .locator('text=Pulumi Infrastructure Logs Completed')
      .waitFor({ timeout: 600_000 });

    // Ensure network requests settle
    await this.page.waitForLoadState('networkidle');
  }
}
