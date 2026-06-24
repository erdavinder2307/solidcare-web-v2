import { test, expect } from "../../fixtures/test-fixtures";

const API_URL = process.env.PLAYWRIGHT_API_URL ?? "http://localhost:8000/api/v1";
const API_BASE = API_URL.replace(/\/api\/v1$/, "");

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
    const healthUrl = process.env.PLAYWRIGHT_API_HEALTH ?? `${API_BASE}/health`;
    const res = await request.get(healthUrl);
    expect(res.ok()).toBeTruthy();
  });

  test("protected route redirects to login", async ({ page }) => {
    await page.goto("/patients");
    await expect(page).toHaveURL(/\/login/);
  });
});
