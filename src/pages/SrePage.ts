import { Page, Locator } from "@playwright/test";

export class SrePage {
  readonly page: Page;

  // Tabs
  readonly sreTab: Locator;
  readonly overviewTab: Locator;
  readonly logsTab: Locator;
  readonly resourcesTab: Locator;

  // Overview elements
  readonly dashboardTitle: Locator;
  readonly latencyPanel: Locator;
  readonly errorRatePanel: Locator;

  // Controls
  readonly developmentButton: Locator;
  readonly logsLevelButton: Locator;
  readonly logsTimeButton: Locator;

  // Resources
  readonly resourcesTable: Locator;

  // Cloud Run form fields
  readonly updateCloudRunButton: Locator;
  readonly projectSlugInput: Locator;
  readonly serviceNameInput: Locator;
  readonly locationInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.sreTab = page.getByRole("tab", { name: "SRE", exact: true }).first();
    this.overviewTab = page.getByLabel('SRE').getByRole('tab', { name: 'Overview' }).first();
    this.logsTab = page.getByRole("tab", { name: "Logs", exact: true }).first();
    this.resourcesTab = page.getByRole("tab", { name: "Resources", exact: true }).first();

    this.dashboardTitle = page.getByText("SRE Dashboard").first();
    this.latencyPanel = page.getByRole("heading", { name: "Latency" }).first();
    this.errorRatePanel = page.getByRole("heading", { name: "Error Rate" }).first();

    this.developmentButton = page.getByText("development").first();
    this.logsLevelButton = page.getByRole("button", { name: "All Levels" }).first();
    this.logsTimeButton = page.getByRole("button", { name: "last 1 day" }).first();

    this.resourcesTable = page.locator("table, [role='table']").first();

    this.updateCloudRunButton = page.getByRole("button", { name: "Update Cloud Run" }).first();
    this.projectSlugInput = page.getByLabel("cloudrun-project-slug *").first();
    this.serviceNameInput = page.getByLabel("cloudrun-service-name *").first();
    this.locationInput = page.getByLabel("cloudrun-location *").first();
    this.submitButton = page.getByRole("button", { name: "Submit" }).first();
  }

  async openSre() {
    await this.sreTab.waitFor({ state: "visible", timeout: 30000 });
    await this.sreTab.click();
    await this.page.waitForLoadState("networkidle");
  }

  async updateCloudRun(config: { projectSlug: string; serviceName: string; location: string }) {
    await this.updateCloudRunButton.click();
    await this.projectSlugInput.fill(config.projectSlug);
    await this.serviceNameInput.fill(config.serviceName);
    await this.locationInput.fill(config.location);
    await this.submitButton.click();
    await this.page.waitForLoadState("networkidle");
  }

  async refreshPage() {
    await this.page.reload();
    await this.page.waitForLoadState("networkidle");
  }

  async selectOverviewTab() {
    await this.overviewTab.click();
    await this.page.waitForLoadState("networkidle");
  }

  async selectLogsTab() {
    await this.logsTab.click();
    await this.page.waitForLoadState("networkidle");
  }

  async selectResourcesTab() {
    await this.resourcesTab.click();
    await this.page.waitForLoadState("networkidle");
  }
}
