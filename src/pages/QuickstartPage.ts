// src/pages/QuickstartPage.ts
import { Page } from '@playwright/test';

export class QuickstartPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateToQuickstartPage() {
    await this.page.goto('https://platformnex-v2-frontend-qa1-pyzx2jrmda-uc.a.run.app/quickstart');
  }
  async clickQuickstart() {
    await this.page.click('text=Quickstart');
  }
  async selectThreeTier() {
    await this.page.click('//*[@id="root"]/div[2]/div/div/div/div[4]/div[3]/div/div[3]/button');
  }
  async ThreeTierQuickstart() {
    await this.navigateToQuickstartPage();
    await this.clickQuickstart();
    await this.selectThreeTier();
  }
  async startThreeTierQuickstart() {
    await this.page.click('text=Start 3-Tier Quickstart');
  }
}
