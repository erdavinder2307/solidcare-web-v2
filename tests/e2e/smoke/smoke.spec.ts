import { test, expect } from "../../fixtures/test-fixtures";

test.describe("Smoke Tests @smoke @critical", () => {
  test("application loads login page", async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.expectOnLoginPage();
  });

  test("admin can login and reach dashboard", async ({ loginPage, dashboardPage, adminUser }) => {
    await loginPage.goto();
    await loginPage.login(adminUser);
    await dashboardPage.expectLoaded();
  });

  test("API health check", async ({ request }) => {
    const res = await request.get("http://localhost:8000/health");
    expect(res.ok()).toBeTruthy();
  });

  test("protected route redirects to login", async ({ page }) => {
    await page.goto("/patients");
    await expect(page).toHaveURL(/\/login/);
  });
});
