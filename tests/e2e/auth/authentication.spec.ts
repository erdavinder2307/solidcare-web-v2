import { test, expect } from "../../fixtures/test-fixtures";

test.describe("Authentication @auth @regression", () => {
  test("login with valid credentials", async ({ loginPage, dashboardPage, adminUser }) => {
    await loginPage.goto();
    await loginPage.login(adminUser);
    await dashboardPage.expectLoaded();
  });

  test("login with invalid credentials shows error", async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.loginWithCredentials("invalid@test.com", "WrongPass123");
    await loginPage.expectLoginError();
  });

  test("password validation enforces minimum length", async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.fillByLabel("Email address", "test@example.com");
    await loginPage.fillByLabel("Password", "short");
    await loginPage.page.getByRole("button", { name: "Sign in" }).click();
    await loginPage.expectPasswordValidation();
  });

  test("logout clears session", async ({ loginPage, adminUser, page }) => {
    await page.goto("/login");
    await page.evaluate(() => localStorage.clear());
    await loginPage.login(adminUser);
    await expect(page.getByText("Today's appointments")).toBeVisible({ timeout: 20_000 });
    await loginPage.logout();
    await expect(page).toHaveURL(/\/login/);
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });

  test("session persists after page reload", async ({ loginPage, dashboardPage, adminUser, page }) => {
    await loginPage.goto();
    await loginPage.login(adminUser);
    await dashboardPage.expectLoaded();
    await page.reload();
    await expect(page).toHaveURL(/\/dashboard/);
    await dashboardPage.expectLoaded();
  });
});
