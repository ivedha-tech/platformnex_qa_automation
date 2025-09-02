import { Page, Locator, expect } from "@playwright/test";

export class FinopsPage {
  readonly page: Page;

  // --- Common Locators ---
  readonly finopsTab: Locator;
  readonly updateFinopsConfigButton: Locator;
  readonly gcpProjectIdInput: Locator;
  readonly gcpDatasetIdInput: Locator;
  readonly gcpTableIdInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // --- Common ---
    this.finopsTab = page.getByRole("tab", { name: "FinOps" }); // ✅ changed to FinOps tab
    this.updateFinopsConfigButton = page.getByRole('button', { name: 'Update FinOps Configs' });
    this.gcpProjectIdInput = page.getByLabel('gcp-projectid *');
    this.gcpDatasetIdInput = page.getByLabel("gcp-dataset-id *");
    this.gcpTableIdInput = page.getByLabel("gcp-table-id *");
    this.submitButton = page.getByRole("button", { name: "Submit" });
  }

  // ---------- Common Methods ----------
  async openFinops() {
    await this.finopsTab.waitFor({ state: "visible", timeout: 30000 });
    await this.finopsTab.click();
    await this.page.waitForLoadState("networkidle");
  }

  async updateFinopsConfig(projectId: string, datasetId: string, tableId: string) {
    await this.updateFinopsConfigButton.click();

    await this.gcpProjectIdInput.fill(projectId);
    await this.gcpDatasetIdInput.fill(datasetId);
    await this.gcpTableIdInput.fill(tableId);

    await this.submitButton.click();
  }
}
    