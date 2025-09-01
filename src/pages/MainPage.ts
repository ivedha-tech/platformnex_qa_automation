import { Page, Locator } from '@playwright/test';

export class MainPage {
  private page: Page;

  //Locators
  private signinButtonMain: Locator;
  private sidebarTabApplication: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signinButtonMain = page.getByRole('button', { name: 'login Sign in with OAuth' });
    this.sidebarTabApplication = page.getByRole('link', { name: 'Applications' });
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

  // Navigate to the Application tab from sidebar
  async navigateToApplication() {
    await this.sidebarTabApplication.waitFor({ state: 'visible', timeout: 30000 });
    await this.sidebarTabApplication.click();
    await this.page.waitForLoadState('networkidle'); 
  }

  // Navigate to the dashboard page and verify it’s loaded
  async isDashboardLoaded(): Promise<boolean> {
    try {
      await this.page.waitForLoadState('domcontentloaded', { timeout: 200000 });
      return true;
    } catch {
      return false;
    }
  }

  // (Optional) Verify 3-tier choose button is clicked
  // async is3TierButtonClicked(): Promise<boolean> {
  //   try {
  //     await this.page.waitForSelector(
  //       'xpath=//*[@id="root"]/div[2]/div/div/div[2]/div[2]/div[1]/div[2]/button',
  //       { timeout: 10000 }
  //     );
  //     return true;
  //   } catch {
  //     return false;
  //   }
  // }
}
