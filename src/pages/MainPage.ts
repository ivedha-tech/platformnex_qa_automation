import { Page, Locator } from '@playwright/test';
import { BasePage } from "../pages/BasePage";

export class MainPage extends BasePage {
  private signinButtonMain: Locator;
  private sidebarTabApplication: Locator;

  constructor(page: Page) {
    super(page);
    this.signinButtonMain = page.getByRole('button', { name: 'login Sign in with OAuth' });
    this.sidebarTabApplication = page.getByRole('link', { name: 'Applications' });
  }

  // Navigate to the main page
  async navigateToHomePage() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  // Open the login window
  async openLoginPage(): Promise<Page> {
    await Promise.all([
      this.page.waitForLoadState('domcontentloaded', { timeout: 120000 }),
      this.signinButtonMain.click()
    ]);
    return this.page;
  }

  // Navigate to the Application tab from sidebar + handle tour
  async navigateToApplication() {
    await this.sidebarTabApplication.waitFor({ state: 'visible', timeout: 30000 });
    await this.sidebarTabApplication.click();
    await this.page.waitForLoadState('domcontentloaded'); 
    
    //Call BasePage function after navigating
    
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
}