import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { MainPage } from '../../pages/MainPage'
import loadYamlData from '../../utils/yamlHelper';
import { Asserts } from '../../utils/asserts';
import { assert } from 'console';

let mainPage: MainPage;
let loginPage: LoginPage;
let dashboardPage: DashboardPage;
const testData = loadYamlData('src/utils/testData.yaml');

test.beforeEach(async ({ page }, testInfo) => {
  mainPage = new MainPage(page);
  loginPage = new LoginPage(page);
  dashboardPage = new DashboardPage(page);
  testInfo.setTimeout(testInfo.timeout + 30_000);
});

test.describe('Login Functionality Tests', () => {
  
  const { email, password } = testData.login.valid;
  const { invalidusername, invalidpassword } = testData.login.invalid;
  const { emptyusername, emptypassword } = testData.login.empty;
  const { expectedErrorMessageWrongMail,expectedErrorMessageWrongPassword, expectedErrorMessageEmpty } = testData.login.error;

  test('PE_T001 - Verify user could Login with valid credentials', async ({}, testInfo) => {
    testInfo.annotations.push({ type: 'tag', description: 'success' });

    // Navigate to the main page
    await mainPage.navigateToHomePage();

    // Open the login page in a new window
    const loginPageContext = await mainPage.openLoginPage();
  
    // Instantiate LoginPage and perform login
    loginPage = new LoginPage(loginPageContext);
    await loginPage.login(email, password);

    //Verify Dashboard loaded 
    const isLoaded = await dashboardPage.isDashboardLoaded();
    expect(isLoaded).toBe(true);
  });

  test('PE_T002 - Verify user unable to Login with invalid credentials', async ({}, testInfo) => {
    testInfo.annotations.push({ type: 'tag', description: 'negative' });
    // Navigate to the main page
    await mainPage.navigateToHomePage();

    // Open the login page in a new window
    const loginPageContext = await mainPage.openLoginPage();
  
    // Instantiate LoginPage and perform login
    loginPage = new LoginPage(loginPageContext);
    await loginPage.login(invalidusername, invalidpassword);

    //Verify Dashboard is not loaded 
    const isLoaded = await dashboardPage.isDashboardLoaded();
    expect(isLoaded).toBe(false);
  });

  test('PE_T003 - Verify User get error massage when invalid credentials', async ({}, testInfo) => {
    testInfo.annotations.push({ type: 'tag', description: 'negative' });
    // Navigate to the main page
    await mainPage.navigateToHomePage();

    // Open the login page in a new window
    const loginPageContext = await mainPage.openLoginPage();
  
    // Instantiate LoginPage and perform login
    loginPage = new LoginPage(loginPageContext);
    await loginPage.login(invalidusername, invalidpassword);

    //Verify error massage is showing
    const isDisplayed = await loginPage.isErrorMessageDisplayed('password', expectedErrorMessageWrongPassword);
    expect(isDisplayed).toBe(true);
  
  });

  test('PE_T004 - User couldn not Login with invalid Username', async ({}, testInfo) => {
    testInfo.annotations.push({ type: 'tag', description: 'negative' });
    // Navigate to the main page
    await mainPage.navigateToHomePage();

    // Open the login page in a new window
    const loginPageContext = await mainPage.openLoginPage();
  
    // Instantiate LoginPage and perform login
    loginPage = new LoginPage(loginPageContext);
    await loginPage.login(invalidusername, password);

    //Verify Dashboard loaded 
    const isLoaded = await dashboardPage.isDashboardLoaded();
    expect(isLoaded).toBe(false);
  
  });

  test('PE_T005 - Verify User get error massage when invalid email', async ({}, testInfo) => {
    testInfo.annotations.push({ type: 'tag', description: 'negative' });
    // Navigate to the main page
    await mainPage.navigateToHomePage();

    // Open the login page in a new window
    const loginPageContext = await mainPage.openLoginPage();
  
    // Instantiate LoginPage and perform login
    loginPage = new LoginPage(loginPageContext);
    await loginPage.login(invalidusername, password);

    //Verify error massage is showing
    const isDisplayed = await loginPage.isErrorMessageDisplayed('password',expectedErrorMessageWrongPassword);
    expect(isDisplayed).toBe(true);
  
  });

  test('PE_T006 - User couldn not Login with invalid Password', async ({}, testInfo) => {
    testInfo.annotations.push({ type: 'tag', description: 'negative' });
    // Navigate to the main page
    await mainPage.navigateToHomePage();

    // Open the login page in a new window
    const loginPageContext = await mainPage.openLoginPage();
  
    // Instantiate LoginPage and perform login
    loginPage = new LoginPage(loginPageContext);
    await loginPage.login(email, invalidpassword);

    //Verify Dashboard loaded 
    const isLoaded = await dashboardPage.isDashboardLoaded();
    expect(isLoaded).toBe(false);
  
  });

  test('PE_T007 - Verify User get error massage when invalid password', async ({}, testInfo) => {
    testInfo.annotations.push({ type: 'tag', description: 'negative' });
    // Navigate to the main page
    await mainPage.navigateToHomePage();

    // Open the login page in a new window
    const loginPageContext = await mainPage.openLoginPage();
  
    // Instantiate LoginPage and perform login
    loginPage = new LoginPage(loginPageContext);
    await loginPage.login(email, invalidpassword);

    //Verify error massage is showing
    const isDisplayed = await loginPage.isErrorMessageDisplayed('password',expectedErrorMessageWrongPassword);
    expect(isDisplayed).toBe(true);
  
  });

  test('PE_T008 - Verify Password should masked when entering', async ({}, testInfo) => {
    testInfo.annotations.push({ type: 'tag', description: 'success' });
    // Navigate to the main page
    await mainPage.navigateToHomePage();

    // Open the login page in a new window
    const loginPageContext = await mainPage.openLoginPage();
  
    // Instantiate LoginPage and perform login
    loginPage = new LoginPage(loginPageContext);

    //Verify the password is masked
    const isPasswordMasked = await loginPage.isPasswordMasked(password);
    expect(isPasswordMasked).toBe(true);
  
  });

  test('PE_T009 - Verify Password can make visible by clicking eye icon', async ({}, testInfo) => {
    testInfo.annotations.push({ type: 'tag', description: 'success' });
    // Navigate to the main page
    await mainPage.navigateToHomePage();

    // Open the login page in a new window
    const loginPageContext = await mainPage.openLoginPage();
  
    // Instantiate LoginPage and perform login
    loginPage = new LoginPage(loginPageContext);

    //Verify the password is masked
    const isPasswordMasked = await loginPage.isPasswordMasked(password);
    expect(isPasswordMasked).toBe(true);
    await loginPage.togglePasswordVisibility();
    const isPasswordVisible = await loginPage.isPasswordVisible();
    expect(isPasswordVisible).toBe(true);
  
  });

  test('PE_T010 - Verify Forget Password functionality', async ({}, testInfo) => {
    testInfo.annotations.push({ type: 'tag', description: 'success' });
    // Navigate to the main page
    await mainPage.navigateToHomePage();

    // Open the login page in a new window
    const loginPageContext = await mainPage.openLoginPage();
  
    //
  
  });

  test('PE_T011 - Verify User could not login with empty user name and password', async ({}, testInfo) => {
    testInfo.annotations.push({ type: 'tag', description: 'negative' });
    // Navigate to the main page
    await mainPage.navigateToHomePage();

    // Open the login page in a new window
    const loginPageContext = await mainPage.openLoginPage();

    // Instantiate LoginPage and perform login
    loginPage = new LoginPage(loginPageContext);
    await loginPage.login(emptyusername, emptypassword);
  
    //Verify Dashboard is not loaded 
    const isLoaded = await dashboardPage.isDashboardLoaded();
    expect(isLoaded).toBe(false);

    //Verify error massage is showing
    const isDisplayed = await loginPage.isErrorMessageDisplayed('email', expectedErrorMessageEmpty);
    expect(isDisplayed).toBe(true);
  
  });

  test('PE_T012 - Verify User could not login with empty user name and password', async ({}, testInfo) => {
    testInfo.annotations.push({ type: 'tag', description: 'negative' });
    // Navigate to the main page
    await mainPage.navigateToHomePage();

    // Open the login page in a new window
    const loginPageContext = await mainPage.openLoginPage();

    // Instantiate LoginPage and perform login
    loginPage = new LoginPage(loginPageContext);
    await loginPage.login(emptyusername, password);
  
    //Verify Dashboard is not loaded 
    const isLoaded = await dashboardPage.isDashboardLoaded();
    expect(isLoaded).toBe(false);

    //Verify error massage is showing
    const isDisplayed = await loginPage.isErrorMessageDisplayed('email', expectedErrorMessageEmpty);
    expect(isDisplayed).toBe(true);
   
  });

  test('PE_T013 - Verify User could not login with empty password', async ({}, testInfo) => {
    testInfo.annotations.push({ type: 'tag', description: 'negative' });
    // Navigate to the main page
    await mainPage.navigateToHomePage();

    // Open the login page in a new window
    const loginPageContext = await mainPage.openLoginPage();

    // Instantiate LoginPage and perform login
    loginPage = new LoginPage(loginPageContext);
    await loginPage.login(email, emptypassword);
  
    //Verify Dashboard is not loaded 
    const isLoaded = await dashboardPage.isDashboardLoaded();
    expect(isLoaded).toBe(false);

    //Verify error massage is showing
    const isDisplayed = await loginPage.isErrorMessageDisplayed('password', expectedErrorMessageEmpty);
    expect(isDisplayed).toBe(true);
  
  });
});