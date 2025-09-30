import { Page, Locator, expect } from "@playwright/test";

export class ComponentOnboardingPage {
  componentOnboardingPage(compName: any, description: any, repoLink: any) {
      throw new Error("Method not implemented.");
  }
  readonly page: Page;

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

  constructor(page: Page) {
    this.page = page;

    this.onboardButton = page.getByRole("button", { name: "add Onboard Component" });
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
    this.onboardSubmit = page.getByRole("button", { name: "Onboard", exact: true });
    this.viewAppButton = page.getByRole("button", { name: "View Application" });
  }

  async onboardComponent(name: string, desc: string, repo: string) {
    await expect(this.onboardButton).toBeVisible({ timeout: 30000 });
    await this.onboardButton.click();

    // Step 1
    await this.kindDropdown.click();
    await this.componentOption.click();
    const uniqueName = `${name}-${Date.now()}`;
    await this.nameInput.fill(uniqueName);
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
  }

  private async clickNextSafely(waitForLocator: () => Locator, timeout = 60000) {
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
    throw new Error("Next button not clickable or next step not visible in timeout");
  }
}
