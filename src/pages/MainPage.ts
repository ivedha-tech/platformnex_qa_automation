import { Page, Locator } from '@playwright/test';
import { BasePage } from "../pages/BasePage";

export class MainPage extends BasePage {
  private signinButtonMain: Locator;
  private sidebarTabApplication: Locator;

  private userIcon: Locator;
  private settingsButton: Locator;
  private authenticationSection: Locator;
  private versionControlSection: Locator;
  private githubCard: Locator;
  private githubStatus: Locator;

  constructor(page: Page) {
    super(page);
    console.log("Initializing MainPage...");
    
    this.signinButtonMain = page.getByRole('button', { name: 'login Sign in with OAuth' });
    this.sidebarTabApplication = page.getByRole('link', { name: 'Applications' });

    this.userIcon = page.getByLabel("User menu"); 
    this.settingsButton = page.getByRole("menuitem", { name: "Settings" });
    this.authenticationSection = page.getByRole("heading", { name: "Authentications" });
    this.versionControlSection = page.getByText("Version Controls");
    this.githubCard = page.getByRole("heading", { name: "GitHub" }).locator(".."); // parent container
    this.githubStatus = this.githubCard.locator('[data-testid="status-label"]'); // adjust if needed
    
    console.log("MainPage initialized successfully");
  }

  // Navigate to the main page
  async navigateToHomePage() {
    console.log("Navigating to home page");
    try {
      await this.page.goto('/');
      await this.page.waitForLoadState('networkidle');
      console.log("Successfully navigated to home page");
    } catch (error) {
      console.error("Error navigating to home page:", error);
      throw error;
    }
  }

  // Open the login window
  async openLoginPage(): Promise<Page> {
    console.log("Opening login page");
    try {
      await Promise.all([
        this.page.waitForLoadState('domcontentloaded', { timeout: 120000 }),
        this.signinButtonMain.click()
      ]);
      console.log("Login page opened successfully");
      return this.page;
    } catch (error) {
      console.error("Error opening login page:", error);
      throw error;
    }
  }

  // Navigate to the Application tab from sidebar + handle tour
  async navigateToApplication() {
    console.log("Navigating to Application tab");
    try {
      await this.sidebarTabApplication.waitFor({ state: 'visible', timeout: 30000 });
      await this.sidebarTabApplication.click();
      await this.page.waitForLoadState('domcontentloaded'); 
      console.log("Successfully navigated to Application tab");
      
      //Call BasePage function after navigating
    } catch (error) {
      console.error("Error navigating to Application tab:", error);
      throw error;
    }
  }

  // Navigate to the dashboard page and verify it's loaded
  async isDashboardLoaded(): Promise<boolean> {
    console.log("Checking if dashboard is loaded");
    try {
      await this.page.waitForLoadState('domcontentloaded', { timeout: 200000 });
      console.log("Dashboard loaded successfully");
      return true;
    } catch (error) {
      console.error("Error loading dashboard:", error);
      return false;
    }
  }

  // Check if GitHub is logged in
  async isGithubLoggedIn(): Promise<boolean> {
    console.log("Checking GitHub login status");
    try {
      const statusText = await this.githubStatus.innerText();
      const isConnected = statusText.includes("Connected");
      
      if (isConnected) {
        console.log("GitHub is connected");
      } else {
        console.log(`GitHub status: ${statusText}`);
      }
      
      return isConnected;
    } catch (error) {
      console.error("Error checking GitHub status:", error);
      return false;
    }
  }
}