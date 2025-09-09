import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class DevopsPage extends BasePage {
  // ---------------------------
  // Locators
  // ---------------------------
  readonly devopsTab: Locator;

  // component selector in DevOps
  readonly componentSelectorButton: Locator;
  readonly componentOptionByName: (name: string) => Locator;

  // SonarQube missing/setup locators
  readonly missingPluginHeading: Locator; // "Missing Plugin SonarQube"
  readonly setupNewButton: Locator; // "Set Up New"
  readonly onboardingConfirmTitle: Locator; // "Confirm Onboarding"
  readonly onboardingConfirmBody: Locator; // text "Do you want to confirm"
  readonly onboardingConfirmButton: Locator; // "Confirm"
  readonly onboardingModalCloseButton: Locator; // "Close"
  readonly setupInProgressHeading: Locator; // "SonarQube Setup in Progress"

  // Pull Requests section
  readonly pullRequestsSectionTitle: Locator; // "Pull Requests"
  readonly onboardSonarPRRowByPrefix: (prefix: string) => Locator;

  // PR details page
  readonly prTitlePrefixHeading: Locator; // "Onboard SonarQube:"
  readonly mergeButton: Locator; // "Merge"
  public mergingBlockedBanner: Locator; // "Merging is blocked"
  public bypassRuleCheckbox: Locator; // "Merge without waiting for requirement..."
  public mergeAnywayButton: Locator; // "Merge anyway"
  public confirmMergeDialogTitle: Locator; // "Confirm Merge"
  public confirmMergeButton: Locator; // "Confirm"

  // Code Quality cards after refresh
  readonly codeQualityHeading: Locator; // "Code Quality"
  readonly qualityCardByName: (name: string) => Locator; // reliability/security/etc.

  //Devops Ui
  readonly commitInsightsSection: Locator;
  readonly libraryCheckerSection: Locator;
  readonly viewMoreButton: Locator;
  readonly recentCommits: Locator;


  constructor(page: Page) {
    super(page);

    // DevOps tab
    this.devopsTab = page.getByRole("tab", { name: "DevOps" });

    // component selector (button shows current selection), option by visible text
    this.componentSelectorButton = page
      .locator("button").filter({
  hasText: /web_asset.+/i,
});
    this.componentOptionByName = (name: string) =>
      page.getByRole("option", {
        name: new RegExp(`web_asset\\s+${name}$`, "i"),
      });

    // SonarQube missing/setup
    this.missingPluginHeading = page.getByRole("heading", {
      name: /Missing Plugin SonarQube/i,
    });
    this.setupNewButton = page.getByRole("button", { name: /Set Up New/i });
    this.onboardingConfirmTitle = page.getByRole("heading", {
      name: /Confirm Onboarding/i,
    });
    this.onboardingConfirmBody = page.getByText(/Do you want to confirm/i);
    this.onboardingConfirmButton = page.getByRole("button", {
      name: /^Confirm$/i,
    });
    this.onboardingModalCloseButton = page.getByRole("button", {
      name: /^Close$/i,
    });
    this.setupInProgressHeading = page.getByRole('heading', { name: 'SonarQube Setup in Progress' });

    // Pull Requests
    this.pullRequestsSectionTitle = page.getByText(/Pull Requests/i);
    this.onboardSonarPRRowByPrefix = (prefix: string) =>
      // Any row that starts with "Onboard SonarQube:" regardless of suffix
      page.getByRole("row", { name: new RegExp(`${prefix}\\s*`, "i") });

    // PR details
    this.prTitlePrefixHeading = page.getByText(/^Onboard SonarQube:/);
    this.mergeButton = page.getByRole("button", { name: /^Merge$/i });
    this.mergingBlockedBanner = page.getByLabel(/Merging is blocked/i);
    this.bypassRuleCheckbox = page.getByLabel(
      /Merge without waiting for.*bypass rule/i
    );
    this.mergeAnywayButton = page.getByRole("button", {
      name: /Merge anyway/i,
    });
    this.confirmMergeDialogTitle = page.getByLabel(/Confirm Merge/i);
    this.confirmMergeButton = page.getByRole("button", { name: /^Confirm$/i });

    // Code Quality
    this.codeQualityHeading = page.getByText(/Code Quality/i);
    this.qualityCardByName = (name: string) =>
      page.getByRole("button", { name: new RegExp(`${name}`, "i") });

    //Devops UI
    this.devopsTab = page.getByRole("tab", { name: "DevOps" });
    this.commitInsightsSection = page.getByText("Commit Insights");
    this.libraryCheckerSection = page.getByText("Library Checker");
    this.viewMoreButton = page.getByRole("button", { name: "View more" });
    this.recentCommits = page.getByText(/Recent Commits/i);
  }

  // ---------------------------
  // Actions
  // ---------------------------

  async openDevOpsTab(): Promise<void> {
    await this.devopsTab.waitFor({ state: "visible" });
    await this.devopsTab.click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async selectComponentByName(name: string): Promise<void> {
  // Open dropdown
  await this.componentSelectorButton.waitFor({ state: "visible" });
  await this.componentSelectorButton.click();

  // Wait for the option with the given name to be visible
  const option = this.componentOptionByName(name);
  await option.waitFor({ state: "visible", timeout: 10000 });

  // Scroll into view (to be safe) and click it
  await option.scrollIntoViewIfNeeded();
  await option.click();

  // Wait for page to render after selection
  await this.page.waitForLoadState("domcontentloaded");
}

  async setupNewSonarQube(): Promise<void> {
    await this.missingPluginHeading.waitFor({
      state: "visible",
      timeout: 30000,
    });
    await this.setupNewButton.click();

    // Confirm onboarding
    await this.onboardingConfirmTitle.waitFor({
      state: "visible",
      timeout: 15000,
    });
    await this.onboardingConfirmBody.waitFor({ state: "visible" });
    await this.onboardingConfirmButton.click();

    // Wait for modal content to stabilize then close
    await this.setupInProgressHeading.waitFor({
      state: "visible",
      timeout: 60000,
    });
    await this.onboardingModalCloseButton.click();
  }

  async openOnboardSonarQubePullRequest(prefix: string): Promise<void> {
    await this.pullRequestsSectionTitle.waitFor({ state: "visible" });
    const prRow = this.onboardSonarPRRowByPrefix(prefix);
    await prRow.waitFor({ state: "visible", timeout: 60000 });
    await prRow.click();
    await this.prTitlePrefixHeading.waitFor({
      state: "visible",
      timeout: 30000,
    });
  }

  private async scrollAndWait(locator: Locator, timeout = 30000) {
  await locator.waitFor({ state: "attached", timeout });
  await locator.scrollIntoViewIfNeeded();
  await locator.waitFor({ state: "visible", timeout });
}

  async bypassAndMergePR(): Promise<void> {
    await this.mergeButton.waitFor({ state: "visible" });
    await this.mergeButton.click();

    await this.mergingBlockedBanner.waitFor({
      state: "visible",
      timeout: 15000,
    });
    await this.bypassRuleCheckbox.check();

    await this.mergeAnywayButton.waitFor({ state: "visible" });
    await this.mergeAnywayButton.click();

    await this.confirmMergeDialogTitle.waitFor({ state: "visible" });
    await this.confirmMergeButton.click();
  }

  async refreshAndEnsureComponent(componentName: string): Promise<void> {
    // Hard refresh
    await this.page.reload();
    await this.page.waitForLoadState("domcontentloaded");

    // If not selected, select
    const dropdownText = await this.componentSelectorButton.textContent();
    const selected = (dropdownText || "").includes(componentName);
    if (!selected) {
      await this.selectComponentByName(componentName);
    }
  }

  async selectFilter(filterName: string) {
    await this.page.getByRole("button", { name: "This Month" }).click();
    await this.page.getByText(filterName).click();
  }

  async selectBranchDropdown(branchRegex: RegExp, optionRegex: RegExp) {
    await this.page.getByRole("combobox", { name: branchRegex }).click();
    await this.page.getByText(optionRegex).click();
  }

  async verifyCommitInsights() {
  await this.scrollAndWait(this.commitInsightsSection);
  await expect(this.commitInsightsSection).toBeVisible();
}

async verifyLibraryChecker() {
  await this.scrollAndWait(this.libraryCheckerSection);
  await expect(this.libraryCheckerSection).toBeVisible();
  await this.scrollAndWait(this.page.getByText(/All dependencies are secure/i));
  await expect(this.page.getByText(/All dependencies are secure/i)).toBeVisible();
}

async expandLibraryDependencies() {
  await this.scrollAndWait(this.viewMoreButton);
  await this.viewMoreButton.click();
  await this.scrollAndWait(this.page.getByText("Library Dependencies"));
  await expect(this.page.getByText("Library Dependencies")).toBeVisible();
}

async verifyRecentCommits() {
  await this.scrollAndWait(this.recentCommits);
  await expect(this.recentCommits).toBeVisible();
}
}
