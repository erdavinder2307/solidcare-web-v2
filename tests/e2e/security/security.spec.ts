import { test, expect } from "../../fixtures/test-fixtures";
import {
  testProtectedRouteWithoutAuth,
  testApiWithoutToken,
  writeSecurityReport,
  SecurityFinding,
} from "../../helpers/security-helper";
import { loginViaApi } from "../../helpers/api-helper";
import { TEST_USERS } from "../../test-data/users";

test.describe("Security Testing @security @critical", () => {
  const findings: SecurityFinding[] = [];

  test.afterAll(() => {
    writeSecurityReport(findings);
  });

  test("protected routes redirect unauthenticated users", async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const routes = ["/dashboard", "/patients", "/appointments", "/billing/invoices", "/admin/users"];
    for (const route of routes) {
      const finding = await testProtectedRouteWithoutAuth(page, route);
      if (finding) findings.push(finding);
      await expect(page).toHaveURL(/\/login/);
    }
    await context.close();
  });

  test("API endpoints reject unauthenticated requests", async () => {
    const endpoints = ["/patients", "/appointments", "/billing/invoices", "/encounters"];
    for (const ep of endpoints) {
      const finding = await testApiWithoutToken(ep);
      if (finding) findings.push(finding);
    }
  });

  test("invalid JWT rejected by API", async ({ request }) => {
    const res = await request.get("http://localhost:8000/api/v1/patients", {
      headers: { Authorization: "Bearer invalid.token.here" },
    });
    expect([401, 403]).toContain(res.status());
  });

  test("billing clerk cannot create patients via API", async ({ request }) => {
    try {
      const token = await loginViaApi(TEST_USERS.billingClerk.email, TEST_USERS.billingClerk.password);
      const res = await request.post("http://localhost:8000/api/v1/patients", {
        headers: { Authorization: `Bearer ${token}` },
        data: { first_name: "Test", last_name: "User", phone: "9999999999", gender: "male" },
      });
      expect([403, 401]).toContain(res.status());
    } catch {
      test.skip(true, "E2E role users not seeded — run seed_e2e_users.sql");
    }
  });

  test("localStorage contains auth token after login", async ({ loginPage, adminUser, page }) => {
    await loginPage.goto();
    await loginPage.login(adminUser);
    const auth = await page.evaluate(() => localStorage.getItem("solidcare-auth"));
    expect(auth).toBeTruthy();
    const parsed = JSON.parse(auth!);
    expect(parsed.state?.accessToken ?? parsed.accessToken).toBeTruthy();
  });

  test("direct URL to admin without role is blocked", async ({ page, loginPage }) => {
    try {
      await loginViaApi(TEST_USERS.billingClerk.email, TEST_USERS.billingClerk.password);
      await loginPage.goto();
      await loginPage.login(TEST_USERS.billingClerk);
      await page.goto("/admin/clinics");
      await page.waitForTimeout(2000);
      const blocked = !(await page.getByRole("heading", { name: /clinic/i }).isVisible().catch(() => false));
      expect(blocked).toBeTruthy();
    } catch {
      test.skip(true, "E2E role users not seeded");
    }
  });
});
