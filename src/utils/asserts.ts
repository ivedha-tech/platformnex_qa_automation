import { Locator, expect } from '@playwright/test';

export class Asserts {
  /**
   * Validates that the error message matches the expected text.
   * @param locator - Locator of the error message element
   * @param expectedMessage - The expected error message text
   */
  static async validateErrorMessage(locator: Locator, expectedMessage: string) {
    const actualMessage = (await locator.textContent())?.trim();
    console.log('Actual Error Message:', actualMessage);
    expect(actualMessage).toBe(expectedMessage);
  }
}