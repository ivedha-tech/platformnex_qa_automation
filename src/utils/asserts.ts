import { Locator, expect } from "@playwright/test";

export class Asserts {
  /**
   * Validate that a success message is visible and optionally matches the expected text.
   */
  static async validateSuccessMessage(locator: Locator, expectedMessage?: string): Promise<void> {
    await locator.waitFor({ state: "visible", timeout: 60000 });

    const actualMessage = (await locator.textContent())?.trim();

    expect.soft(actualMessage, "Success message should not be empty").toBeTruthy();

    if (expectedMessage) {
      expect.soft(
        actualMessage,
        `Expected success message to contain: "${expectedMessage}", but got "${actualMessage}"`
      ).toContain(expectedMessage);
    }

    console.log(`Success message checked: "${actualMessage}"`);
  }

  /**
   * Validate a generic error message.
   */
  static async validateErrorMessage(locator: Locator, expectedMessage: string): Promise<void> {
    await locator.waitFor({ state: "visible", timeout: 60000 });

    const actualMessage = (await locator.textContent())?.trim();

    expect.soft(actualMessage, "Error message should not be empty").toBeTruthy();

    expect.soft(
      actualMessage,
      `Expected error message: "${expectedMessage}", but got "${actualMessage}"`
    ).toBe(expectedMessage);

    console.log(`Error message checked: "${actualMessage}"`);
  }

  /**
   * Validate that a section is visible.
   */
  static async validateSectionVisible(locator: Locator): Promise<void> {
    await locator.waitFor({ state: "visible", timeout: 60000 });

    const isVisible = await locator.isVisible();

    expect.soft(isVisible, "Section should be visible").toBe(true);

    console.log("Section visibility checked.");
  }

  /**
   * Validate that text inside a locator matches the expected text.
   */
  static async validateText(locator: Locator, expectedText: string): Promise<void> {
    await locator.waitFor({ state: "visible", timeout: 60000 });

    const actualText = (await locator.textContent())?.trim();

    expect.soft(actualText, "Locator text should not be empty").toBeTruthy();

    expect.soft(
      actualText,
      `Expected text: "${expectedText}", but got "${actualText}"`
    ).toBe(expectedText);

    console.log(`Text checked: "${actualText}"`);
  }

  /** Validate locator visible and its text contains expected snippet */
  static async validateTextContains(locator: Locator, expectedSubstring: string): Promise<void> {
    await locator.waitFor({ state: "visible", timeout: 60000 });

    const text = (await locator.textContent())?.trim() || "";

    expect.soft(
      text.toLowerCase(),
      `Expected text to contain: "${expectedSubstring}", but got "${text}"`
    ).toContain(expectedSubstring.toLowerCase());

    console.log(`Text contains check done: "${expectedSubstring}"`);
  }

  /** Validate a locator is visible (no text assertion) */
  static async validateLocatorVisible(locator: Locator): Promise<boolean> {
    await locator.waitFor({ state: "visible", timeout: 60000 });

    const isVisible = await locator.isVisible();

    expect.soft(isVisible, "Locator should be visible").toBe(true);
    
    console.log("Locator visibility checked.");
    return isVisible;
  }
}