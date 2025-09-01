import { Locator, expect } from "@playwright/test";

export class Asserts {
  
  /**
   * Validate that a success message is visible and optionally matches the expected text.
   * @param locator - Playwright locator for the success message
   * @param expectedMessage - Optional expected text to validate against
   */
  static async validateSuccessMessage(locator: Locator, expectedMessage?: string): Promise<void> {
    try {
      // Wait until the locator is visible
      await locator.waitFor({ state: "visible", timeout: 60000 });

      // Get and trim the text content
      const actualMessage = (await locator.textContent())?.trim();

      // Check if text exists
      if (!actualMessage) {
        throw new Error("Success message is visible but contains no text.");
      }

      // Assert that message is not empty
      expect(actualMessage).toBeTruthy();

      // Assert that actual message contains expected text (if provided)
      if (expectedMessage) {
        expect(actualMessage).toContain(expectedMessage);
      }

      console.log(`Success message validated: "${actualMessage}"`);
    } catch (error) {
      console.error(
        `Failed to validate success message. 
         Expected: "${expectedMessage || "any message"}". 
         Error: ${(error as Error).message}`
      );
      throw error; 
    }
  }

  /**
 * Validate a generic error message.
 * @param locator - Playwright locator for the error message
 * @param expectedMessage - The exact expected text
 */
static async validateErrorMessage(locator: Locator, expectedMessage: string): Promise<void> {
  try {
    await locator.waitFor({ state: "visible", timeout: 60000 });
    const actualMessage = (await locator.textContent())?.trim();

    if (!actualMessage) {
      throw new Error("Error message is visible but contains no text.");
    }

    expect(actualMessage).toBe(expectedMessage);
    console.log(`Error message validated: "${actualMessage}"`);
  } catch (error) {
    console.error(
      `Failed to validate error message. 
       Expected: "${expectedMessage}". 
       Error: ${(error as Error).message}`
    );
    throw error;
  }
}

/**
 * Validate that a section is visible.
 * @param locator - Playwright locator for the section
 */
static async validateSectionVisible(locator: Locator): Promise<void> {
  try {
    await locator.waitFor({ state: "visible", timeout: 60000 });

    const isVisible = await locator.isVisible();
    if (!isVisible) {
      throw new Error("Section is not visible.");
    }

    expect(isVisible).toBe(true);
    console.log("Section validated as visible.");
  } catch (error) {
    console.error(`Failed to validate section visibility. Error: ${(error as Error).message}`);
    throw error;
  }
}

/**
 * Validate that text inside a locator matches the expected text.
 * @param locator - Playwright locator
 * @param expectedText - Expected text
 */
static async validateText(locator: Locator, expectedText: string): Promise<void> {
  try {
    await locator.waitFor({ state: "visible", timeout: 60000 });
    const actualText = (await locator.textContent())?.trim();

    if (!actualText) {
      throw new Error("Locator is visible but contains no text.");
    }

    expect(actualText).toBe(expectedText);
    console.log(`Text validated: "${actualText}"`);
  } catch (error) {
    console.error(
      `Failed to validate text. 
       Expected: "${expectedText}". 
       Error: ${(error as Error).message}`
    );
    throw error;
  }
}

/** Validate locator visible and its text contains expected snippet */
  static async validateTextContains(locator: Locator, expectedSubstring: string): Promise<void> {
    await locator.waitFor({ state: "visible", timeout: 60000 });
    const text = (await locator.textContent())?.trim() || "";
    expect(text.toLowerCase()).toContain(expectedSubstring.toLowerCase());
  }

  /** Validate a locator is visible (no text assertion) */
  static async validateLocatorVisible(locator: Locator): Promise<void> {
    await locator.waitFor({ state: "visible", timeout: 60000 });
    expect(await locator.isVisible()).toBe(true);
  }
}