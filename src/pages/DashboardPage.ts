import { Page, Locator } from '@playwright/test';

export class DashboardPage {
  private page: Page;

  //Locators
  readonly header: Locator;
  //private dashboardContainer: Locator; 

  constructor(page: Page) {
    this.page = page;
    this.header = page.getByRole('heading', { name: 'Home' }); 
    //this.dashboardContainer = page.locator(`xpath=${this.dashboardMainContainerXpath}`); 

  }

  async isDashboardLoaded(): Promise<boolean> {
    try {
      // Wait for the DOM content to load and the header to be visible
      await Promise.all([
        this.page.waitForLoadState('domcontentloaded', { timeout: 120_000 }),
        this.header.waitFor({ state: 'visible', timeout: 10_000 }), 
      ]);

      // Optionally check if the main container is visible
      //const isContainerVisible = await this.dashboardContainer.isVisible();
      return (await this.header.isVisible());
    } catch (error) {
      console.error('Error while verifying dashboard load:', error);
      return false;
    }
  }

  
}

