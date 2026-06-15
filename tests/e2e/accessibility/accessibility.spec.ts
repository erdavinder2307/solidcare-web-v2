import { test, expect } from "../../fixtures/test-fixtures";
import { LoginPage } from "../../page-objects/LoginPage";
import { runAccessibilityScan, testKeyboardNavigation } from "../../helpers/accessibility-helper";

test.describe("Accessibility @a11y @regression", () => {
  test("login page accessibility scan", async ({ browser, loginPage }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const login = new LoginPage(page);
    await login.goto();
    const report = await runAccessibilityScan(page, "login");
    expect(report.violations).toBeLessThanOrEqual(5);
    await context.close();
  });

  test("dashboard accessibility scan", async ({ dashboardPage, page }) => {
    await dashboardPage.goto();
    await dashboardPage.expectLoaded();
    const report = await runAccessibilityScan(page, "dashboard");
    expect(report.violations).toBeLessThanOrEqual(10);
  });

  test("patients list accessibility scan", async ({ patientsPage, page }) => {
    await patientsPage.gotoList();
    const report = await runAccessibilityScan(page, "patients-list");
    expect(report.violations).toBeLessThanOrEqual(10);
  });

  test("keyboard navigation on dashboard", async ({ dashboardPage, page }) => {
    await dashboardPage.goto();
    await page.locator("#main-content").focus();
    await page.keyboard.press("Tab");
    const tag = await page.evaluate(() => document.activeElement?.tagName ?? "");
    expect(tag.length).toBeGreaterThan(0);
    expect(tag).not.toBe("BODY");
  });

  test("ARIA labels on topbar controls", async ({ dashboardPage, page }) => {
    await dashboardPage.goto();
    await dashboardPage.expectLoaded();
    await expect(page.getByRole("button", { name: "Account menu" })).toBeVisible();
    await expect(page.getByRole("button", { name: /notification/i })).toBeVisible();
  });
});
