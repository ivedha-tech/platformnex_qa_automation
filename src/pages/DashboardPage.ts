import { Page, Locator } from '@playwright/test';

export class DashboardPage {
  private page: Page;

  //Locators
  readonly header: Locator;

  constructor(page: Page) {
    console.log("Initializing DashboardPage...");
    this.page = page;
    this.header = page.getByRole('heading', { name: 'Home' }); 
    console.log("DashboardPage initialized successfully");
  }

  async isDashboardLoaded(): Promise<boolean> {
    console.log("Checking if dashboard is loaded");
    try {
      // Wait for the DOM content to load and the header to be visible
      console.log("Waiting for DOM content to load");
      await Promise.all([
        this.page.waitForLoadState('domcontentloaded', { timeout: 120_000 }),
        this.header.waitFor({ state: 'visible', timeout: 10_000 }), 
      ]);

      console.log("DOM content loaded, checking header visibility");
      const isHeaderVisible = await this.header.isVisible();
      
      if (isHeaderVisible) {
        console.log("Dashboard loaded successfully - header is visible");
      } else {
        console.log("Dashboard header is not visible");
      }
      
      return isHeaderVisible;
    } catch (error) {
      console.error('Error while verifying dashboard load:', error);
      return false;
    }
  }
}