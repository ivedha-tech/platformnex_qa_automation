import { Page, Locator, expect } from "@playwright/test";

export class FinopsPage {
  readonly page: Page;

  // --- Tabs ---
  readonly overviewTab: Locator;
  readonly finopsTab: Locator;
  readonly usageExplorerTab: Locator;

  // --- Onboarding ---
  readonly onboardButton: Locator;
  readonly kindDropdown: Locator;
  readonly componentOption: Locator;
  readonly nameInput: Locator;
  readonly descriptionInput: Locator;
  readonly nextButton: Locator;
  readonly typeDropdown: Locator;
  readonly serviceOption: Locator;
  readonly envDropdown: Locator;
  readonly devEnvOption: Locator;
  readonly repoLinkInput: Locator;
  readonly onboardSubmit: Locator;
  readonly viewAppButton: Locator;

  // --- FinOps Config ---
  readonly updateFinopsConfigButton: Locator;
  readonly gcpProjectIdInput: Locator;
  readonly gcpDatasetIdInput: Locator;
  readonly gcpTableIdInput: Locator;
  readonly submitButton: Locator;

  // --- Project Dropdown ---
  readonly projectDropdownButton: Locator;
  readonly projectOption: (compname: string) => Locator;


  // --- Dashboard ---
  readonly spendChart: Locator;
  readonly breakdownSection: Locator;
  readonly anomalyPanel: Locator;
  readonly noDataMessage: Locator;
  readonly cloudSpendCard: Locator;
  readonly potentialSavingsCard: Locator;
  readonly timeRangeDropdown: Locator;

  constructor(page: Page) {
    this.page = page;

    // Tabs
    this.overviewTab = page.getByRole("tab", { name: "Overview" });
    this.finopsTab = page.getByRole("tab", { name: "FinOps" });
    this.usageExplorerTab = page.getByRole("tab", { name: "Usage Explorer" });

    // Onboarding
    this.onboardButton = page.getByRole("button", {name: "add Onboard Component",});
    this.kindDropdown = page.getByLabel("Kind:");
    this.componentOption = page.getByLabel("Component");
    this.nameInput = page.getByPlaceholder("Name...");
    this.descriptionInput = page.getByPlaceholder("Enter description...");
    this.nextButton = page.getByRole("button", { name: "Next" });
    this.typeDropdown = page.getByLabel("Type:");
    this.serviceOption = page.getByLabel("service");
    this.envDropdown = page.getByLabel("Environment:");
    this.devEnvOption = page.getByLabel("development").getByText("development");
    this.repoLinkInput = page.getByPlaceholder("repository link...");
    this.onboardSubmit = page.getByRole("button", {name: "Onboard",exact: true,});
    this.viewAppButton = page.getByRole("button", { name: "View Application" });
   // Project dropdown
    // Prefer common select patterns (combobox or listbox button) instead of hard-coded text
    // Dropdown button (any project name)
// Prefer common select patterns (combobox or listbox button) instead of hard-coded text 
this.projectDropdownButton = page.locator('button').filter({ hasText: 'web_assetcursor232166' }).first(); 
this.projectOption = (name: string) => page.getByRole("option", { name });

    // FinOps Config
    this.updateFinopsConfigButton = page.getByRole('button', { name: 'Update FinOps Configs' });
    this.gcpProjectIdInput = page.getByLabel("gcp-projectid *");
    this.gcpDatasetIdInput = page.getByLabel("gcp-dataset-id *");
    this.gcpTableIdInput = page.getByLabel("gcp-table-id *");
    this.submitButton = page.getByRole("button", { name: "Submit" });

    

    // Dashboard
    this.spendChart = page.locator("canvas");
    this.breakdownSection = page.getByText("Cost Breakdown");
    this.anomalyPanel = page.getByRole("region", { name: "Anomaly Alerts" });
    this.noDataMessage = page.getByText("No usage data available");
    this.cloudSpendCard = page.getByText("This Month Cloud Spend");
    this.potentialSavingsCard = page.getByText("Potential Savings");
    this.timeRangeDropdown = page.getByLabel("FinOps").getByRole("combobox");
  }

  // ---------- Methods ----------
  async onboardComponent(name: string, desc: string, repo: string) {
    await this.overviewTab.click();
    await expect(this.onboardButton).toBeVisible({ timeout: 30000 });
    await this.onboardButton.click();

    // Step 1
    await this.kindDropdown.click();
    await this.componentOption.click();
    await this.nameInput.fill(name);
    await this.descriptionInput.fill(desc);
    await this.clickNextSafely(() => this.page.getByLabel("Type:"));

    // Step 2
    await this.typeDropdown.click();
    await this.serviceOption.click();
    await this.envDropdown.click();
    await this.devEnvOption.click();
    await this.repoLinkInput.fill(repo);
    await this.clickNextSafely(() => this.onboardSubmit);

    // Step 3
    await this.onboardSubmit.click();
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(5000);

    // Verify onboarding success
    await expect(this.viewAppButton).toBeVisible({ timeout: 60000 });
    await this.viewAppButton.click();

    // Step 4
    await this.finopsTab.click();
    await this.page.waitForLoadState("networkidle");
  }

  async clickNextSafely(waitForLocator: () => Locator, timeout = 60000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      try {
        const nextBtn = this.page.getByRole("button", { name: "Next" });
        if ((await nextBtn.isVisible()) && (await nextBtn.isEnabled())) {
          await nextBtn.scrollIntoViewIfNeeded();
          await nextBtn.click({ force: true });
          for (let i = 0; i < 5; i++) {
            if (await waitForLocator().isVisible()) return;
            await this.page.waitForTimeout(300);
            await nextBtn.click({ force: true });
          }
        }
      } catch {}
      await this.page.waitForTimeout(500);
    }
    throw new Error(
      "Next button not clickable or next step not visible in timeout"
    );
  }
  //step 5
  async selectProject(projectName: string) {
    // Try primary dropdown
    await this.projectDropdownButton.click();

    // If options are not visible, attempt a secondary strategy
    const option = this.projectOption(projectName);
    if (!(await option.isVisible())) {
      const fallbackDropdown = this.page.locator("[role='combobox']").first();
      if (await fallbackDropdown.isVisible()) {
        await fallbackDropdown.click();
      }
    }

    await this.projectOption(projectName).click();
  }
  //step 6
  async updateFinopsConfig(projectId: string,datasetId: string,tableId: string) 
  {
    await this.updateFinopsConfigButton.click();
    await this.gcpProjectIdInput.fill(projectId);
    await this.gcpDatasetIdInput.fill(datasetId);
    await this.gcpTableIdInput.fill(tableId);
    await this.submitButton.click();
    await this.page.waitForLoadState("networkidle");
    // Wait for either the spend chart or no data message to appear
    await Promise 
    //add waiting time to load the dashboard
    await this.page.waitForTimeout(20000);
  }
  //step 6
  async validateFinopsUI() {
    await expect(this.cloudSpendCard).toBeVisible({ timeout: 60000 });
    await expect(this.potentialSavingsCard).toBeVisible({ timeout: 60000 });
    await expect(this.breakdownSection).toBeVisible({ timeout: 60000 });
    await expect(this.anomalyPanel).toBeVisible({ timeout: 60000 });
  }

  
  // click Usage Explorer tab
  async openUsageExplorer() {
    await this.usageExplorerTab.click();
    await this.page.waitForLoadState("networkidle");
  }

  async switchTimeRange(range: string) {
    // Open dropdown
    await this.timeRangeDropdown.click();
    await this.page.getByText(range, { exact: true }).click();
    await this.page.waitForTimeout(1000);   
  }  
  
}
