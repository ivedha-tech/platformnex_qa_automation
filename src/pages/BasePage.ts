import { Page, Locator } from "@playwright/test";

export class BasePage {
  
  constructor(protected page: Page) {
    this.page = page;
  }

  // ---------------------------
  // Tour Locators
  // ---------------------------
  readonly primaryButtonSecond: Locator = this.page.locator("locator-for-primary-button-second");
  readonly nextStepButton: Locator = this.page.locator("locator-for-next-step-button");
  readonly finishButton: Locator = this.page.locator("locator-for-finish-button");
  readonly skipTourButton: Locator = this.page.locator("locator-for-skip-tour-button");

  // ---------------------------
  // Pagination Handler
  // ---------------------------
  /**
   * Handles pagination and performs an action (like click) when the target element is found.
   * @param targetLocator - Playwright locator to identify the target element
   * @param nextButtonLocator - Locator for the "Next" pagination button
   * @param action - Action to perform on the found element (default: click)
   */
  async handlePagination(
    targetLocator: Locator,
    nextButtonLocator: Locator,
    action: "click" | "getText" | "exists" = "click"
  ): Promise<string | boolean | void> {
    let found = false;

    while (!found) {
      if (await targetLocator.isVisible({ timeout: 2000 }).catch(() => false)) {
        switch (action) {
          case "click":
            await targetLocator.click();
            return;
          case "getText":
            return await targetLocator.innerText();
          case "exists":
            return true;
        }
      }

      if (await nextButtonLocator.isVisible({ timeout: 2000 }).catch(() => false)) {
        await nextButtonLocator.click();
        await this.page.waitForLoadState("networkidle"); // wait for page load
      } else {
        if (action === "exists") return false; // for existence check
        throw new Error("Target element not found in any page");
      }
    }
  }

// ---------------------------
// Tour Functions
// ---------------------------
async completeTour(): Promise<void> {
  await this.primaryButtonSecond.waitFor({ state: "visible", timeout: 6000 });
  await this.primaryButtonSecond.click();

  await this.nextStepButton.waitFor({ state: "visible", timeout: 6000 });
  await this.nextStepButton.click();

  await this.finishButton.waitFor({ state: "visible", timeout: 6000 });
  await this.finishButton.click();
}

async skipTour(): Promise<void> {
  await this.skipTourButton.waitFor({ state: "visible", timeout: 6000 });
  await this.skipTourButton.click();
}

async handleTour(): Promise<void> {
  await this.page.waitForLoadState("domcontentloaded");
  await this.skipTour();
  await this.completeTour();
  await this.skipTour();
}
}