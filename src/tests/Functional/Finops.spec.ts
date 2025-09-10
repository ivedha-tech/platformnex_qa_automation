import { test  } from "@playwright/test";
import { MainPage } from "../../pages/MainPage";
import { LoginPage } from "../../pages/LoginPage";
import { FinopsPage } from "../../pages/FinopsPage";
import { loadYamlData } from "../../utils/ymalHelper";

let mainPage: MainPage;
let loginPage: LoginPage;
let finopsPage: FinopsPage;

const testData: { 
    login: { 
      valid: { email: string, password: string } 
    }, 
    finops: {
      "gcp-projectid": string,
      "gcp-dataset-id": string,
      "gcp-table-id": string
    }
  } = loadYamlData("src/utils/testData.yaml");
test.setTimeout(180000); 


test.beforeEach(async ({ page }) => {
  mainPage = new MainPage(page);
  loginPage = new LoginPage(page);
  finopsPage = new FinopsPage(page);

  // ---------- Login ----------
  await mainPage.navigateToHomePage();
  await mainPage.openLoginPage();
  await loginPage.login(testData.login.valid.email, testData.login.valid.password);

  // ---------- Wait for dashboard / applications page ----------
  // ---------- Select Application ----------
  await page.getByRole("link", { name: "Applications" }).click();
  await page.goto("https://platformnex-v2-frontend-qa1-pyzx2jrmda-uc.a.run.app/applications");
  await page.getByText("dnsPlatformnexOwned by:").click();
  await page.waitForLoadState("networkidle")

  // ---------- Click application ----------
  const appLink = page.getByText("dnsPlatformnexOwned by:");
  await appLink.waitFor({ state: "visible", timeout: 20000 });
  await appLink.click();

  // ---------- Open Finops ----------
  await finopsPage.openFinops();
  
  //click update fineopsconfig
  

});


//


