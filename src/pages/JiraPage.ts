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
    await this.searchBox.waitFor({ state: "visible", timeout: 15000 });
    await this.searchBox.fill(value);
    await this.page.keyboard.press("Enter");
  }
  
  private async selectDropdownOption(dropdown: Locator, optionText: string) {
    await dropdown.click(); // open dropdown
    const option = this.page.locator('[role="option"]').getByText(
      new RegExp(`^${optionText}\\s*$`, "i")
    );
    await option.waitFor({ state: "visible" });
    await option.click();
    await this.page.waitForLoadState("networkidle"); // wait for UI refresh
  }
  
  async selectProject(projectName: string) {
    await this.selectDropdownOption(this.projectDropdown, projectName);
  }
  
  async selectEpic(epicName: string) {
    await this.selectDropdownOption(this.epicDropdown, epicName);
  }
  
  //async selectSprint(sprintName: string) {
   // await this.selectDropdownOption(this.sprintDropdown, sprintName);
 // }
  
  async selectStatus(status: string) {
    await this.selectDropdownOption(this.statusDropdown, status);
  }
  
  
  //click the OpenPrsbutton and wait for loading
  async openPrs() {
    await this.openPrsButton.click();
    await this.page.waitForLoadState("networkidle");
  }

}
