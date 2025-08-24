import { Page, Locator } from '@playwright/test';

export class MainPage {
  private page: Page;
  private signinButtonMain: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signinButtonMain = page.locator('xpath=//*[@id="root"]/div[2]/div/div/div[2]/button');
  }

  // Navigate to the main page
  async  navigateToHomePage() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  //Open the login window
  async openLoginPage(): Promise<Page> {
  await Promise.all([
    this.page.waitForLoadState('domcontentloaded', { timeout: 120000 }),
    this.signinButtonMain.click()
  ]);
  return this.page;

  }
  //navigate to the dashboard page
  async isDashboardLoaded(): Promise<boolean> {
    try {
      await this.page.waitForLoadState('domcontentloaded', { timeout: 120000 });
      return true;
    } catch {
      return false;
    }

  }
}
//verify 3- tier choose button is clicked 
// async is3TierButtonClicked(): Promise<boolean> {
//   try {
//     await this.page.waitForSelector('xpath=//*[@id="root"]/div[2 ]/div/div/div[2]/div[2]/div[1]/div[2]/button', { timeout: 10000 });
//     return true;
//   } catch {
