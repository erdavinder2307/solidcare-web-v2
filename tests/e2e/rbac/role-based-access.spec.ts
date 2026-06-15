import { test, expect, loginAs } from "../../fixtures/test-fixtures";
import { TEST_USERS } from "../../test-data/users";

test.describe("Role-Based Access Control @rbac @regression", () => {
  test("super admin can access all admin routes", async ({ page }) => {
    await loginAs(page, TEST_USERS.superAdmin);
    await page.goto("/admin/users");
    await expect(page.getByRole("heading", { level: 1, name: "Users" })).toBeVisible();
    await page.goto("/admin/clinics");
    await expect(page.getByRole("heading", { level: 1, name: "Clinics" })).toBeVisible();
  });

  test("doctor can access clinical workspace", async ({ page }) => {
    await loginAs(page, TEST_USERS.doctor);
    await page.goto("/clinical/workspace");
    await expect(page.getByRole("heading", { level: 1, name: "Clinical Workspace" })).toBeVisible({
      timeout: 20_000,
    });
    await page.goto("/encounters");
    await expect(page.getByRole("heading", { level: 1, name: "Encounters" })).toBeVisible();
  });

  test("doctor cannot access admin users", async ({ page }) => {
    await loginAs(page, TEST_USERS.doctor);
    await page.goto("/admin/users");
    const denied = page.getByText(/don't have permission|not found|403/i);
    const onUsers = page.getByRole("heading", { name: /user/i });
    await page.waitForTimeout(2000);
    const hasAccess = await onUsers.isVisible().catch(() => false);
    if (hasAccess) {
      test.info().annotations.push({
        type: "security",
        description: "Doctor role can access /admin/users — RBAC gap",
      });
    }
    expect(hasAccess).toBeFalsy();
  });

  test("receptionist can access patients and appointments", async ({ page }) => {
    await loginAs(page, TEST_USERS.receptionist);
    await page.goto("/patients");
    await expect(page.getByRole("heading", { level: 1, name: "Patients" })).toBeVisible();
    await page.goto("/appointments");
    await expect(page.getByRole("heading", { level: 1, name: "Schedule" })).toBeVisible();
  });

  test("receptionist cannot access prescriptions create", async ({ page }) => {
    await loginAs(page, TEST_USERS.receptionist);
    await page.goto("/prescriptions/new");
    await page.waitForTimeout(2000);
    const denied = await page.getByText(/don't have permission/i).isVisible().catch(() => false);
    const onCreate = await page.getByRole("heading", { name: /prescription/i }).isVisible().catch(() => false);
    expect(denied || !onCreate).toBeTruthy();
  });

  test("billing clerk can access invoices", async ({ page }) => {
    await loginAs(page, TEST_USERS.billingClerk);
    await page.goto("/billing/invoices");
    await expect(page.getByRole("heading", { level: 1, name: "Invoices" })).toBeVisible();
  });

  test("billing clerk cannot access admin clinics", async ({ page }) => {
    await loginAs(page, TEST_USERS.billingClerk);
    await page.goto("/admin/clinics");
    await page.waitForTimeout(2000);
    const hasAccess = await page.getByRole("heading", { name: /clinic/i }).isVisible().catch(() => false);
    expect(hasAccess).toBeFalsy();
  });

  test("org admin can access dashboard and patients", async ({ page }) => {
    await loginAs(page, TEST_USERS.orgAdmin);
    await page.goto("/dashboard");
    await expect(page.getByText("Today's appointments")).toBeVisible({ timeout: 20_000 });
    await page.goto("/patients");
    await expect(page.getByRole("heading", { level: 1, name: "Patients" })).toBeVisible();
  });
});
