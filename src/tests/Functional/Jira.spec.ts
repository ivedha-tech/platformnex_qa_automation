import { test, expect } from "@playwright/test";
import { JiraPage } from "../../pages/JiraPage";
import { LoginPage } from "../../pages/LoginPage";
import { MainPage } from "../../pages/MainPage";
import { loadYamlData } from "../../utils/ymalHelper";

const testData = loadYamlData("src/utils/testData.yaml");

test("TC - Full Jira workflow (search + all dropdowns)", async ({ page }) => {
  test.setTimeout(100000); // 100 seconds

  const loginPage = new LoginPage(page);
  const mainPage = new MainPage(page);
  const jiraPage = new JiraPage(page);

  // Navigate and login
  await mainPage.navigateToHomePage();
  await mainPage.openLoginPage();
  await loginPage.login(
    testData.login.valid.email,
    testData.login.valid.password
  );

// Search for a task
await jiraPage.searchTask(testData.jira.search.byId);

// wait for search results to load
await page.waitForTimeout(5000); // Adjust timeout as needed

// Select Project
await jiraPage.selectProject(testData.jira.filters.project);
await page.waitForTimeout(3000);

// Select Epic
await jiraPage.selectEpic(testData.jira.filters.epic);
await page.waitForTimeout(3000);

// Select Sprint
//await jiraPage.selectSprint(testData.jira.filters.sprint);
//await page.waitForTimeout(3000);

// Select Status
await jiraPage.selectStatus(testData.jira.filters.status);
await page.waitForTimeout(3000);

// ✅ Validation step
await expect(page.getByText(testData.jira.search.byId)).toBeVisible();
});

