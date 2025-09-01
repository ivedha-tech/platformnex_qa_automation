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

}