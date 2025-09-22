import { Page, Locator, expect } from "@playwright/test";

export class JiraPage {
  readonly page: Page;
  readonly searchBox: Locator;
  readonly projectDropdown: Locator;
  readonly epicDropdown: Locator;
  //readonly sprintDropdown: Locator;
  readonly statusDropdown: Locator;
  readonly openPrsButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchBox = page.getByPlaceholder('Search tickets by ID, summary');
  
    // Dropdown buttons (just keep Locators, no .toString(), no .click())
    this.projectDropdown = page.locator('button').filter({ hasText: 'All Projects' });
    this.epicDropdown = page.locator('button').filter({ hasText: 'All Epics' });
    //this.sprintDropdown = page.locator('button').filter({ hasText: /^All$/ }); // exact "All"
    this.statusDropdown = page.locator('button').filter({ hasText: 'All Status' });
    this.openPrsButton = page.getByRole('tab', { name: 'Open PRs' });
  }

  async searchTask(value: string) {
    await this.searchBox.waitFor({ state: 'visible', timeout: 15000 });
    await this.searchBox.fill(value);
    await this.page.keyboard.press('Enter');
  }

  async selectProject(projectName: string) {
    await this.projectDropdown.click(); // open dropdown
    await this.page.getByText(projectName, { exact: true }).click(); // select option
  }
  
  async selectEpic(epicName: string) {
    await this.epicDropdown.click();
    await this.page.locator('[role="option"]', { hasText: epicName }).click();
  }  
  
  //async selectSprint(sprintName: string) {
   // await this.sprintDropdown.click();
    //await this.page.getByText(sprintName, { exact: true }).click();
  //}
  
  async selectStatus(status: string) {
    await this.statusDropdown.click(); // open dropdown
    await this.page.locator('[role="option"]').getByText(status, { exact: true }).click(); 
    await this.page.waitForLoadState("networkidle");
  }
  
  //click the OpenPrsbutton and wait for loading
  async openPrs() {
    await this.openPrsButton.click();
    await this.page.waitForLoadState("networkidle");
  }

}
