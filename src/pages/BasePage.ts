import { Page, Locator } from "@playwright/test";

export class BasePage {
  
  constructor(protected page: Page) {
    console.log("Initializing BasePage...");
    this.page = page;
  }

  // ---------------------------
  // Tour Locators
  // ---------------------------
  readonly primaryButtonSecond: Locator = this.page.locator("locator-for-primary-button-second");
  readonly nextStepButton: Locator = this.page.locator("locator-for-next-step-button");
  readonly finishButton: Locator = this.page.locator("locator-for-finish-button");
  readonly skipTourButton: Locator = this.page.locator("locator-for-skip-tour-button");

  //Feedback form locators
  readonly feedbackForm: Locator = this.page.getByLabel("Page Feedback");
  readonly closeButton: Locator = this.page.getByRole("button", { name: "Cancel" });

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
    console.log(`Handling pagination with action: ${action}`);
    let found = false;
    let pageNumber = 1;

    try {
      while (!found) {
        console.log(`Checking for target on page ${pageNumber}`);
        
        if (await targetLocator.isVisible({ timeout: 2000 }).catch(() => false)) {
          console.log(`Target element found on page ${pageNumber}`);
          
          switch (action) {
            case "click":
              console.log("Clicking target element");
              await targetLocator.click();
              console.log("Successfully clicked target element");
              return;
            case "getText":
              const text = await targetLocator.innerText();
              console.log(`Retrieved text from target: ${text}`);
              return text;
            case "exists":
              console.log("Target element exists");
              return true;
          }
        } else {
          console.log(`Target not found on page ${pageNumber}`);
        }

        if (await nextButtonLocator.isVisible({ timeout: 2000 }).catch(() => false)) {
          console.log("Next page button found, clicking");
          await nextButtonLocator.click();
          await this.page.waitForLoadState("networkidle"); // wait for page load
          console.log("Next page loaded");
          pageNumber++;
        } else {
          console.log("No more pages available");
          if (action === "exists") {
            console.log("Returning false for existence check");
            return false; // for existence check
          }
          throw new Error("Target element not found in any page");
        }
      }
    } catch (error) {
      console.error("Error in handlePagination:", error);
      throw error;
    }
  }

  // ---------------------------
  // Tour Functions
  // ---------------------------
  async completeTour(): Promise<void> {
    try {
      console.log("Starting tour completion process");
      
      console.log("Waiting for primary button to be visible");
      await this.primaryButtonSecond.waitFor({ state: "visible", timeout: 6000 });
      console.log("Clicking primary button");
      await this.primaryButtonSecond.click();

      console.log("Waiting for next step button to be visible");
      await this.nextStepButton.waitFor({ state: "visible", timeout: 6000 });
      console.log("Clicking next step button");
      await this.nextStepButton.click();

      console.log("Waiting for finish button to be visible");
      await this.finishButton.waitFor({ state: "visible", timeout: 6000 });
      console.log("Clicking finish button");
      await this.finishButton.click();
      
      console.log("Tour completed successfully");
    } catch (error) {
      console.error("Error completing tour:", error);
      throw error;
    }
  }

  async skipTour(): Promise<void> {
    try {
      console.log("Skipping tour");
      console.log("Waiting for skip tour button to be visible");
      await this.skipTourButton.waitFor({ state: "visible", timeout: 6000 });
      console.log("Clicking skip tour button");
      await this.skipTourButton.click();
      console.log("Tour skipped successfully");
    } catch (error) {
      console.error("Error skipping tour:", error);
      throw error;
    }
  }

  async handleTour(): Promise<void> {
    try {
      console.log("Handling tour process");
      await this.page.waitForLoadState("domcontentloaded");
      console.log("Page loaded, attempting to skip tour");
      await this.skipTour();
      console.log("Attempting to complete tour");
      await this.completeTour();
      console.log("Attempting to skip tour again");
      await this.skipTour();
      console.log("Tour handling completed successfully");
    } catch (error) {
      console.error("Error handling tour:", error);
      throw error;
    }
  }

  async handleFeedbackPopup(): Promise<void> {

    const isVisible = await this.feedbackForm
      .isVisible({ timeout: 2000 })
      .catch(() => false);

    if (isVisible) {
      console.log("Feedback popup detected. Closing...");
      await this.closeButton.click();
      await this.page.waitForTimeout(500);
    }
  }
}