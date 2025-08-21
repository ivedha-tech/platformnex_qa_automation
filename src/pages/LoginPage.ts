import { Page, Locator } from '@playwright/test';

export class LoginPage {
  private page: Page;

  //Xpaths
  private signinButtonMainXpath: string = '//*[@id="root"]/div[2]/div/div/div[2]/button';
  private emailXpath: string = '//*[@id="user_name_field"]';
  private passwordInputXpath: string = '//*[@id="password_field"]';
  private signinButtonXpath: string = '//*[@id="root"]/main/div/div/div/div/form/button';
  private emailErrorMessageXpath: string = '//*[@id="root"]/main/div/div/div/div/form/div[1]/span';
  private passwordErrorMessageXpath: string = '//*[@id="root"]/main/div/div/div/div/form/div[2]/span';
  private emailEmptyErrorXpath: string = '//*[@id="root"]/main/div/div/div/div/form/div[1]/span';
  private passwordEmptyErrorXpath: string = '//*[@id="root"]/main/div/div/div/div/form/div[2]/span';
  private togglePasswordVisibilityIconXpath: string = '//*[@id="root"]/main/div/div/div/div/form/div[2]/div/div/div/button'

  //Locators
  private signinButtonMain: Locator;
  private emailInput: Locator;
  private passwordInput: Locator;
  private signinButton: Locator;
  private emailErrorMessage: Locator;
  private passwordErrorMessage: Locator;
  private togglePasswordVisibilityIcon: Locator;

  constructor(page: Page) {

    this.page = page;
    this.signinButtonMain = page.locator(`xpath=${this.signinButtonMainXpath}`);
    this.emailInput = page.locator(`xpath=${this.emailXpath}`); 
    this.passwordInput = page.locator(`xpath=${this.passwordInputXpath}`); 
    this.signinButton = page.locator(`xpath=${this.signinButtonXpath}`);    
    this.emailErrorMessage = page.locator(`xpath=${this.emailErrorMessageXpath}`);  
    this.passwordErrorMessage = page.locator(`xpath=${this.passwordErrorMessageXpath}`);
    this.togglePasswordVisibilityIcon = page.locator(`xpath=${this.togglePasswordVisibilityIconXpath}`);    
  }

  //Navigate to the Login popup window
  async navigateToLoginPage(): Promise<Page> {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'), 
      this.signinButtonMain.click(), 
    ]);
  
    await newPage.waitForLoadState('domcontentloaded'); 
    return newPage; 
  }

  // Perform login action
  async login(email: string, password: string) {
    await this.page.waitForLoadState('networkidle');
    await this.emailInput.waitFor({ state: 'visible' });

    await this.emailInput.click();
    await this.page.keyboard.type(email);
    await this.page.waitForTimeout(2000);

    await this.passwordInput.click();
    await this.page.keyboard.type(password);
    await this.page.waitForTimeout(2000);

    await this.signinButton.click();
  }

  // Get the error message
  async getErrorMessage(type: 'email' | 'password'): Promise<string> {
    const locator = type === 'email' ? this.emailErrorMessage : this.passwordErrorMessage
    await this.page.waitForLoadState('domcontentloaded');
    await locator.waitFor({ state: 'attached', timeout: 120000 });
    return (await locator.textContent())?.trim() || '';
  }

  //Verify error message is displayed
  async isErrorMessageDisplayed(type: 'email' | 'password',expectedMessage: string): Promise<boolean> {
    const actualMessage = await this.getErrorMessage(type);
    return actualMessage?.trim() === expectedMessage;
  }

  // Check if the password is masked
  async isPasswordMasked(password: string): Promise<boolean> {
    await this.page.waitForLoadState('domcontentloaded');

    await this.passwordInput.click();
    await this.page.keyboard.type(password);
    await this.page.waitForTimeout(2000);

    const inputType = await this.page.getAttribute('#password_field' , 'type');
    return inputType === 'password'; 
  }

  // Check if the password is visible
async isPasswordVisible(): Promise<boolean> {
  const inputType = await this.page.getAttribute('#password_field', 'type');
  return inputType === 'text'; 
}

// Toggle password visibility
async togglePasswordVisibility(): Promise<void> {
  await this.togglePasswordVisibilityIcon.click()
}


}