import { Page, Locator } from '@playwright/test';

export class LoginPage {
  private page: Page;

  //Xpaths
  private togglePasswordVisibilityIconXpath: string = '//*[@id="root"]/main/div/div/div/div/form/div[2]/div/div/div/button'

  //Locators
  readonly signinButtonMain: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly emailErrorMessage: Locator;
  readonly passwordErrorMessage: Locator;
  readonly togglePasswordVisibilityIcon: Locator;

  constructor(page: Page) {
    console.log("Initializing LoginPage...");
    
    this.page = page;
    this.signinButtonMain = page.getByRole('button', { name: 'login Sign in with OAuth' });
    this.emailInput = page.getByPlaceholder('Enter Email'); 
    this.passwordInput = page.getByPlaceholder('Enter Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.emailErrorMessage = page.getByText('Invalid email address');  
    this.passwordErrorMessage = page.getByText('Invalid login. Please try');
    this.togglePasswordVisibilityIcon = page.locator(`xpath=${this.togglePasswordVisibilityIconXpath}`);    
    
    console.log("LoginPage initialized successfully");
  }

  //Navigate to the Login popup window
  async navigateToLoginPage(): Promise<Page> {
    console.log("Starting navigation to login page...");
    
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'), 
      this.signinButtonMain.click(), 
    ]);
  
    console.log("Login popup window opened, waiting for content to load...");
    await newPage.waitForLoadState('domcontentloaded'); 
    
    console.log("Login page navigation completed successfully");
    return newPage; 
  }

  // Perform login action
  async login(email: string, password: string) {
    console.log(`Starting login process for email: ${email}`);
    
    await this.page.waitForLoadState('networkidle');
    console.log("Page reached network idle state");
    
    await this.emailInput.waitFor({ state: 'visible' });
    console.log("Email input field is visible");

    // Enter email
    console.log("Clicking and typing email...");
    await this.emailInput.click();
    await this.page.keyboard.type(email);
    await this.page.waitForTimeout(2000);
    console.log("Email entered successfully");

    // Enter password
    console.log("Clicking and typing password...");
    await this.passwordInput.click();
    await this.page.keyboard.type(password);
    await this.page.waitForTimeout(2000);
    console.log("Password entered successfully");

    // Click login button
    console.log("Clicking login button...");
    await this.loginButton.click();
    console.log("Login button clicked, waiting for authentication...");
  }

  // Get the error message
  async getErrorMessage(type: 'email' | 'password'): Promise<string> {
    console.log(`Getting error message for: ${type}`);
    
    const locator = type === 'email' ? this.emailErrorMessage : this.passwordErrorMessage;
    await this.page.waitForLoadState('domcontentloaded');
    console.log("Page content loaded");
    
    await locator.waitFor({ state: 'attached', timeout: 120000 });
    console.log("Error message element is attached");
    
    const message = (await locator.textContent())?.trim() || '';
    console.log(`Retrieved error message: "${message}"`);
    
    return message;
  }

  //Verify error message is displayed
  async isErrorMessageDisplayed(type: 'email' | 'password', expectedMessage: string): Promise<boolean> {
    console.log(`Verifying error message for ${type}. Expected: "${expectedMessage}"`);
    
    const actualMessage = await this.getErrorMessage(type);
    const isMatch = actualMessage?.trim() === expectedMessage;
    
    console.log(`Error message verification result: ${isMatch ? "PASS" : "FAIL"}`);
    console.log(`Actual message: "${actualMessage}"`);
    
    return isMatch;
  }

  // Check if the password is masked
  async isPasswordMasked(password: string): Promise<boolean> {
    console.log("Checking if password is masked...");
    
    await this.page.waitForLoadState('domcontentloaded');
    console.log("Page content loaded");

    // Enter password
    console.log("Entering password into password field...");
    await this.passwordInput.click();
    await this.page.keyboard.type(password);
    await this.page.waitForTimeout(2000);
    console.log("Password entered");

    // Check input type
    const inputType = await this.page.getAttribute('#password_field', 'type');
    const isMasked = inputType === 'password';
    
    console.log(`Password field type: ${inputType}`);
    console.log(`Password is masked: ${isMasked}`);
    
    return isMasked; 
  }

  // Check if the password is visible
  async isPasswordVisible(): Promise<boolean> {
    console.log("Checking if password is visible...");
    
    const inputType = await this.page.getAttribute('#password_field', 'type');
    const isVisible = inputType === 'text';
    
    console.log(`Password field type: ${inputType}`);
    console.log(`Password is visible: ${isVisible}`);
    
    return isVisible; 
  }

  // Toggle password visibility
  async togglePasswordVisibility(): Promise<void> {
    console.log("Toggling password visibility...");
    
    await this.togglePasswordVisibilityIcon.click();
    console.log("Password visibility toggle clicked");
    
    // Wait a moment for the toggle to take effect
    await this.page.waitForTimeout(500);
    console.log("Password visibility toggle completed");
  }

  // Additional helper method for better login flow tracking
  async waitForLoginCompletion(): Promise<void> {
    console.log("Waiting for login process to complete...");
    
    try {
      await this.page.waitForLoadState('networkidle', { timeout: 30000 });
      console.log("Login process completed - network is idle");
    } catch (error) {
      console.log("Network idle state not reached, waiting for DOM content loaded instead");
      await this.page.waitForLoadState('domcontentloaded');
      console.log("DOM content loaded after login attempt");
    }
  }

  // Method to verify login success by checking URL or page elements
  async verifyLoginSuccess(): Promise<boolean> {
    console.log("Verifying login success...");
    
    try {
      // Check if we're redirected away from login page
      const currentUrl = this.page.url();
      const isLoginPage = currentUrl.includes('login') || currentUrl.includes('auth');
      
      console.log(`Current URL: ${currentUrl}`);
      console.log(`Is login page: ${isLoginPage}`);
      
      // If we're not on a login-related page, assume success
      const success = !isLoginPage;
      console.log(`Login verification result: ${success ? "SUCCESS" : "PENDING/FAILED"}`);
      
      return success;
    } catch (error) {
      console.error("Error during login verification:", error);
      return false;
    }
  }
}