import { Page } from '@playwright/test';

export class LoginPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate() {
    await this.page.goto('/login'); // Use relative paths with baseURL
  }

  async login(username: string, password: string) {
    await this.page.fill('#username', username);
    await this.page.fill('#password', password);
    await this.page.click('#loginButton');
  }

  async isLoggedIn(): Promise<boolean> {
    return this.page.isVisible('#logoutButton');
  }
}