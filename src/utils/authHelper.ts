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

  // Verify dashboard
  const isLoaded = await dashboardPage.isDashboardLoaded();
  if (!isLoaded) {
    throw new Error("Dashboard did not load after login!");
  }

  return { dashboardPage, loginPage, mainPage };
}