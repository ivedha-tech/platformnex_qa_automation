// src/pages/LoginPage.ts
import { Page, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('https://icx-auth-web-non-prod-pyzx2jrmda-uc.a.run.app/sso/login?key=platformnex-frontend-qa1');
  }

  async login(username: string, password: string) {
    await this.page.fill('#user_name_field', username);
    await this.page.fill('#password_field', password);
    await this.page.click('//*[@id="root"]/main/div/div/div/div/form/button');

    // Wait until we are redirected to Platformnex dashboard
    await this.page.waitForURL('https://platformnex-v2-frontend-qa1-pyzx2jrmda-uc.a.run.app/**', { timeout: 30000 });
    await this.page.waitForLoadState('networkidle');
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      // Check if the URL contains /dashboard or any other landing page path
      const currentURL = await this.page.url();
      if (!currentURL.includes('platformnex-v2-frontend-qa1-pyzx2jrmda-uc.a.run.app')) {
        return false;
      }

      // Check for a unique dashboard element (replace selector with something you always see after login)
      await this.page.locator('//*[@id="root"]/div[2]/aside/div/div/nav/a[1]').first().waitFor({ timeout: 15000 });

      return true;
    } catch {
      return false;
    }
  }
}
