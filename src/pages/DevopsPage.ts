import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class DevopsPage extends BasePage {
  // ---------------------------
  // Locators
  // ---------------------------
  readonly devopsTab: Locator;
  readonly subTabCICD: Locator;

  // component selector in DevOps
  readonly componentSelectorButton: Locator;
  readonly searchBar: Locator;
  readonly componentOptionByName: (name: string) => Locator;

  // SonarQube missing/setup locators
  readonly missingPluginHeading: Locator;
  readonly setupNewButton: Locator;
  readonly onboardingConfirmTitle: Locator;
  readonly onboardingConfirmBody: Locator;
  readonly onboardingConfirmButton: Locator;
  readonly onboardingModalCloseButton: Locator;
  readonly setupInProgressHeading: Locator;

  // Pull Requests section
  readonly pullRequestsSectionTitle: Locator;
  readonly onboardSonarPRRowByPrefix: (prefix: string) => Locator;

  // PR details page
  readonly prTitlePrefixHeading: Locator;
  readonly mergeButton: Locator;
  public mergingBlockedBanner: Locator;
  public bypassRuleCheckbox: Locator;
  public mergeAnywayButton: Locator;
  public confirmMergeDialogTitle: Locator;
  public confirmMergeButton: Locator;

  // Code Quality cards after refresh
  readonly codeQualityHeading: Locator;
  readonly qualityCardByName: (name: string) => Locator;

  //Devops Ui
  readonly commitInsightsSection: Locator;
  readonly libraryCheckerSection: Locator;
  readonly viewMoreButton: Locator;
  readonly backArrowButton: Locator;
  readonly recentCommits: Locator;

  // CI/CD
  readonly cicdTab: Locator;
  readonly configureCICDButton: Locator;
  readonly gcpProjectInput: Locator;
  readonly nextStepButton: Locator;
  readonly createTriggerButton: Locator;
  readonly configCompleteNotification: Locator;

  constructor(page: Page) {
    super(page);
    console.log("🔄 Initializing DevopsPage...");

    // DevOps tab
    this.devopsTab = page.getByRole("tab", { name: "DevOps" });
    this.subTabCICD = page.getByRole('button', { name: 'Configure CI/CD' });

    // component selector
    this.componentSelectorButton = page
      .locator("button").filter({
        hasText: /web_asset.+/i,
      });
    this.searchBar = page.getByPlaceholder('Search');
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
    this.backArrowButton = page.getByLabel('DevOps').getByRole('button');
    this.recentCommits = page.getByText(/Recent Commits/i);

    // CI/CD locators
    this.cicdTab = page.getByRole("tab", { name: "CI/CD" });
    this.configureCICDButton = page.getByRole("button", { name: "Configure CI/CD" });
    this.gcpProjectInput = page.getByPlaceholder("your-gcp-project-id");
    this.nextStepButton = page.getByRole("button", { name: "Next Step" });
    this.createTriggerButton = page.getByRole("button", { name: "Create Trigger" });
    this.configCompleteNotification = page.getByText(/CI\/CD Configuration Complete/i);

    console.log("DevopsPage initialized successfully");
  }

  // ---------------------------
  // Actions
  // ---------------------------

  async openDevOpsTab(): Promise<void> {
    console.log("📊 Opening DevOps tab...");
    await this.devopsTab.waitFor({ state: "visible" });
    await this.devopsTab.click();
    await this.page.waitForLoadState("domcontentloaded");
    console.log("DevOps tab opened successfully");
  }

  async openSubTabs(name: string): Promise<void> {
    console.log(`📂 Opening sub-tab: ${name}...`);
    await this.subTabCICD.waitFor({state: "visible"});
    await this.subTabCICD.click();
    await this.page.waitForLoadState("domcontentloaded");
    console.log(`Sub-tab ${name} opened successfully`);
  }

  async selectComponentByName(name: string): Promise<void> {
    console.log(`Starting component selection for: "${name}"`);
    
    // Always start with a refresh
    console.log("Refreshing page before component selection...");
    await this.page.reload();
    await this.page.waitForLoadState("domcontentloaded");
    console.log("Page refreshed successfully");

    try {
      console.log(`🔍 Trying dropdown selection for component "${name}"...`);

      // Open dropdown
      await this.componentSelectorButton.waitFor({ state: "visible" });
      await this.componentSelectorButton.click();
      console.log("Component dropdown opened");

      // Try to locate option in dropdown
      const option = this.componentOptionByName(name);
      await option.waitFor({ state: "visible", timeout: 5000 });
      await option.scrollIntoViewIfNeeded();
      await option.click();
      console.log(`Successfully selected component "${name}" from dropdown`);
      
    } catch (error) {
      console.error(`Dropdown selection failed for component "${name}":`, error);
      console.log(`Falling back to search bar for component "${name}"...`);

      // Use search bar instead
      await this.searchBar.waitFor({ state: "visible" });
      await this.searchBar.fill(name);
      console.log(`Search term "${name}" entered`);

      // Wait for filtered option to appear
      const filteredOption = this.componentOptionByName(name);
      await filteredOption.waitFor({ state: "visible", timeout: 10000 });
      await filteredOption.scrollIntoViewIfNeeded();
      await filteredOption.click();
      console.log(`Successfully selected component "${name}" using search bar`);
    }

    // Ensure selection applies
    await this.page.waitForLoadState("domcontentloaded");
    console.log(`Component selection process completed for "${name}"`);
  }

  async setupNewSonarQube(): Promise<void> {
    console.log("Starting SonarQube setup process...");
    
    await this.missingPluginHeading.waitFor({
      state: "visible",
      timeout: 30000,
    });
    console.log("Missing plugin heading found");
    
    await this.setupNewButton.click();
    console.log("'Set Up New' button clicked");

    // Confirm onboarding
    await this.onboardingConfirmTitle.waitFor({
      state: "visible",
      timeout: 15000,
    });
    await this.onboardingConfirmBody.waitFor({ state: "visible" });
    console.log("Onboarding confirmation dialog appeared");
    
    await this.onboardingConfirmButton.click();
    console.log("Onboarding confirmed");
    
    await this.onboardingModalCloseButton.click();
    console.log("Modal closed");

    // Wait for setup progress
    await this.setupInProgressHeading.waitFor({
      state: "visible",
      timeout: 60000,
    });
    console.log("SonarQube setup in progress heading visible");
    console.log("SonarQube setup process completed successfully");
  }

  async openOnboardSonarQubePullRequest(prefix: string): Promise<void> {
    console.log(`Looking for SonarQube PR with prefix: "${prefix}"`);
    
    await this.pullRequestsSectionTitle.waitFor({ state: "visible" });
    console.log("Pull Requests section found");
    
    const prRow = this.onboardSonarPRRowByPrefix(prefix);
    await prRow.waitFor({ state: "visible", timeout: 60000 });
    console.log(`PR row with prefix "${prefix}" found`);
    
    await prRow.click();
    console.log("PR row clicked");
    
    await this.prTitlePrefixHeading.waitFor({
      state: "visible",
      timeout: 30000,
    });
    console.log("PR details page loaded successfully");
  }

  private async ensureDevOpsLoaded(): Promise<void> {
    console.log("🔍 Ensuring DevOps page is fully loaded...");
    
    const mustHaveSections: Locator[] = [
      this.commitInsightsSection,
      this.libraryCheckerSection,
    ];

    for (const section of mustHaveSections) {
      console.log(`Waiting for required section: ${await section.toString()}`);
      await this.scrollAndWait(section, 15000);
      console.log("Section loaded successfully");
    }

    // Optional sections fallback
    const optionalSections: Locator[] = [
      this.pullRequestsSectionTitle,
      this.codeQualityHeading,
      this.recentCommits,
    ];
    
    for (const section of optionalSections) {
      try {
        console.log(`Checking optional section: ${await section.toString()}`);
        await this.scrollAndWait(section, 8000);
        console.log("Optional section found");
      } catch {
        console.log(`Optional DevOps section not found: ${await section.toString()}`);
      }
    }
    
    console.log("DevOps page loading verification completed");
  }

  private async scrollAndWait(locator: Locator, timeout = 30000) {
    console.log(`Scrolling to and waiting for locator (timeout: ${timeout}ms)`);
    await locator.waitFor({ state: "attached", timeout });
    await locator.scrollIntoViewIfNeeded();
    await locator.waitFor({ state: "visible", timeout });
    console.log("Locator is now visible and in view");
  }

  async bypassAndMergePR(): Promise<void> {
    console.log("🔄 Starting PR bypass and merge process...");
    
    await this.mergeButton.waitFor({ state: "visible" });
    await this.mergeButton.click();
    console.log("Merge button clicked");

    await this.mergingBlockedBanner.waitFor({
      state: "visible",
      timeout: 15000,
    });
    console.log("Merging blocked banner appeared");
    
    await this.bypassRuleCheckbox.check();
    console.log("Bypass rule checkbox checked");

    await this.mergeAnywayButton.waitFor({ state: "visible" });
    await this.mergeAnywayButton.click();
    console.log("'Merge anyway' button clicked");

    await this.confirmMergeDialogTitle.waitFor({ state: "visible" });
    await this.confirmMergeButton.click();
    console.log("Merge confirmed");
    
    console.log("PR bypass and merge completed successfully");
  }

  async refreshAndEnsureComponent(componentName: string): Promise<void> {
    console.log(`Refreshing and ensuring component "${componentName}" is selected...`);
    
    // Hard refresh
    await this.page.reload();
    await this.page.waitForLoadState("domcontentloaded");
    console.log("Page refreshed");

    // Check if component is already selected
    const dropdownText = await this.componentSelectorButton.textContent();
    const selected = (dropdownText || "").includes(componentName);
    
    if (!selected) {
      console.log(`Component "${componentName}" not selected, selecting now...`);
      await this.selectComponentByName(componentName);
      await this.page.mouse.click(0, 0); // Click away to close dropdown
      console.log("Component selection ensured");
    } else {
      console.log(`Component "${componentName}" already selected`);
    }
    
    console.log("Component refresh and ensure process completed");
  }

  async selectFilter(filterName: string) {
    console.log(`Selecting filter: "${filterName}"`);
    await this.page.getByRole("button", { name: "This Month" }).click();
    await this.page.getByText(filterName).click();
    console.log(`Filter "${filterName}" selected successfully`);
  }

  async selectBranchDropdown(branchRegex: RegExp, optionRegex: RegExp) {
    console.log(`Selecting branch dropdown option`);
    await this.page.getByRole("combobox", { name: branchRegex }).click();
    await this.page.getByText(optionRegex).click();
    console.log("Branch dropdown option selected");
  }

  async verifyCommitInsights() {
    console.log("Verifying Commit Insights section...");
    await this.scrollAndWait(this.commitInsightsSection);
    await expect(this.commitInsightsSection).toBeVisible();
    console.log("Commit Insights section verified successfully");
  }

  async verifyLibraryChecker() {
    console.log("Verifying Library Checker section...");
    await this.scrollAndWait(this.libraryCheckerSection);
    await expect(this.libraryCheckerSection).toBeVisible();
    
    await this.scrollAndWait(this.page.getByText(/All dependencies are secure/i));
    await expect(this.page.getByText(/All dependencies are secure/i)).toBeVisible();
    console.log("Library Checker section verified successfully");
  }

  async expandLibraryDependencies() {
    console.log("Expanding Library Dependencies...");
    await this.scrollAndWait(this.viewMoreButton);
    await this.viewMoreButton.click();
    
    await this.scrollAndWait(this.page.getByText("Library Dependencies"));
    await expect(this.page.getByText("Library Dependencies")).toBeVisible();
    
    await this.backArrowButton.click();
    console.log("Library Dependencies expanded and navigated back successfully");
  }

  async verifyRecentCommits() {
    console.log("Verifying Recent Commits section...");
    await this.scrollAndWait(this.recentCommits);
    await expect(this.recentCommits).toBeVisible();
    console.log("Recent Commits section verified successfully");
  }

  async openCICDTab(): Promise<void> {
    console.log("Opening CI/CD tab...");
    await this.cicdTab.waitFor({ state: "visible" });
    await this.cicdTab.click();
    await this.page.waitForLoadState("domcontentloaded");
    console.log("CI/CD tab opened successfully");
  }

  async configureCICD(projectId: string): Promise<void> {
    console.log(`Starting CI/CD configuration for project: ${projectId}`);
    
    await this.configureCICDButton.waitFor({ state: "visible" });
    await this.configureCICDButton.click();
    console.log("Configure CI/CD button clicked");

    // Fill project ID
    await this.gcpProjectInput.waitFor({ state: "visible" });
    await this.gcpProjectInput.fill(projectId);
    console.log(`GCP Project ID filled: ${projectId}`);

    // Walk through the steps
    console.log("🚶 Walking through configuration steps...");
    await this.nextStepButton.click();
    console.log("Step 1 completed");
    
    await this.nextStepButton.click();
    console.log("Step 2 completed");
    
    await this.createTriggerButton.click();
    console.log("Trigger creation initiated");

    // Validate notification
    await this.configCompleteNotification.waitFor({ state: "visible", timeout: 30_000 });
    await expect(this.configCompleteNotification).toBeVisible();
    console.log("CI/CD configuration completed successfully");
  }
}