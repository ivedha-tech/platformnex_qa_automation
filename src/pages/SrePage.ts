import { Page, Locator, expect } from "@playwright/test";

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

  constructor(page: Page) {
    this.page = page;

    this.sreTab = page.getByRole('tab', { name: 'SRE', exact: true }).first();

    // Fix: pick first visible Overview tab to avoid strict mode violation
    this.overviewTab = page.getByRole('tab', { name: 'Overview', exact: true }).first();
    this.logsTab = page.getByRole('tab', { name: 'Logs', exact: true }).first();
    this.resourcesTab = page.getByRole('tab', { name: 'Resources', exact: true }).first();

    this.dashboardTitle = page.getByText('SRE Dashboard').first();
    this.latencyPanel = page.getByRole('heading', { name: 'Latency' }).first();
    this.errorRatePanel = page.getByRole('heading', { name: 'Error Rate' }).first();

    this.developmentButton = page.getByText('development').first();
    this.logsLevelButton = page.locator('button', { hasText: 'All Levels' }).first();
    this.logsTimeButton = page.locator('button', { hasText: 'last 1 day' }).first();

    this.resourcesTable = page.locator('table, [role="table"]').first();
  }

  // ---------- Navigation ----------
  async openSre() {
    await this.sreTab.waitFor({ state: 'visible', timeout: 30000 });
    await this.sreTab.click();
    await this.page.waitForLoadState('networkidle');
  }

  async openOverview() {
    await this.overviewTab.waitFor({ state: 'visible', timeout: 15000 });
    await this.overviewTab.click();
  }

  async openLogs() {
    await this.logsTab.waitFor({ state: 'visible', timeout: 15000 });
    await this.logsTab.click();
  }

  async openResources() {
    await this.resourcesTab.waitFor({ state: 'visible', timeout: 15000 });
    await this.resourcesTab.click();
  }

  // ---------- Verifications ----------
  async verifyTabsVisible() {
    await expect(this.overviewTab).toBeVisible();
    await expect(this.logsTab).toBeVisible();
    await expect(this.resourcesTab).toBeVisible();
  }

  async verifyOverviewUI() {
    await expect(this.dashboardTitle).toBeVisible({ timeout: 30000 });
    await expect(this.latencyPanel).toBeVisible({ timeout: 30000 });
    await expect(this.errorRatePanel).toBeVisible({ timeout: 30000 });
  }

  async verifyLogsTable() {
    const logsTable = this.page.locator('[data-test-id="logs-table"]').first();
    await logsTable.waitFor({ state: 'visible', timeout: 20000 });
    const rows = await logsTable.locator('tr').count();
    if (rows === 0) throw new Error("Logs table is empty");
  }

  async verifyResourcesTable() {
    await expect(this.resourcesTable).toBeVisible({ timeout: 30000 });
  }

  // ---------- Manual Dropdown & Filters ----------
  async selectDevelopmentEnvironment() {
    await this.developmentButton.click();
    const listboxOption = this.page.getByLabel('development').getByText('development').first();
    await listboxOption.click();
  }

  async setOverviewFilters(latencyRange: string, errorRateRange: string) {
    await this.openOverview();

    // Latency filter
    await this.latencyPanel.click();
    await this.page
      .locator('div', { hasText: new RegExp(`^Latency.*${latencyRange}$`) })
      .getByRole('combobox')
      .first()
      .click();
    await this.page.getByText(latencyRange, { exact: true }).first().click();

    // Error Rate filter
    await this.errorRatePanel.click();
    await this.page
      .locator('button', { hasText: new RegExp(`${errorRateRange}`) })
      .first()
      .click();
    await this.page.getByText(errorRateRange, { exact: true }).first().click();
  }

  async filterLogs(level: string, timeRange: string) {
    await this.openLogs();

    await this.logsLevelButton.click();
    await this.page.getByText(level, { exact: true }).first().click();

    await this.logsTimeButton.click();
    await this.page.locator('button', { hasText: timeRange }).first().click();
  }

  async verifyCompleteSREUI(): Promise<void> {
    console.log("Verifying complete SRE UI...");
    await this.verifyTabsVisible();
    await this.verifyOverviewUI();
    await this.verifyLogsTable();
    await this.verifyResourcesTable();
  }

  // ---------- Complete Sequential Flow ----------
  async completeSREFlow() {
    await this.selectDevelopmentEnvironment();
    await this.verifyTabsVisible();
    await this.setOverviewFilters('last 3 hours', 'last 6 hours');
    await this.verifyOverviewUI();
    await this.filterLogs('Error', 'last 1 day');
    await this.verifyLogsTable();
    await this.openResources();
    await this.verifyResourcesTable();
  }
}
