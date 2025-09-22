import { Page } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { MainPage } from "../pages/MainPage";
import { DashboardPage } from "../pages/DashboardPage";

export async function loginAsUser(page: Page, email: string, password: string) {
  const mainPage = new MainPage(page);
  const dashboardPage = new DashboardPage(page);

  // Navigate to main page
  await mainPage.navigateToHomePage();

  // Open login page in new window
  const loginPageContext = await mainPage.openLoginPage();
  const loginPage = new LoginPage(loginPageContext);

  // Login
  await loginPage.login(email, password);

  // Wait for login to complete and user to be redirected back to main page
  await page.waitForLoadState('networkidle', { timeout: 60000 });
  
  // Wait for the dashboard to load with retry logic
  let isLoaded = false;
  let retries = 5;
  
  while (retries > 0 && !isLoaded) {
    // Wait a bit before checking
    await page.waitForTimeout(3000);
    
    // Check if dashboard is loaded
    isLoaded = await dashboardPage.isDashboardLoaded();
    
    if (!isLoaded) {
      retries--;
      console.log(`Dashboard not loaded yet. ${retries} retries remaining...`);
      
      // Try to reload the page if dashboard isn't loading
      if (retries === 2) {
        console.log("Reloading page...");
        await page.reload();
        await page.waitForLoadState('networkidle', { timeout: 30000 });
      }
    }
  }

  if (!isLoaded) {
    throw new Error("Dashboard did not load after login!");
  }

  console.log("Dashboard loaded successfully!");
  return { dashboardPage, loginPage, mainPage };
}