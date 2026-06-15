import { test, expect } from "../../fixtures/test-fixtures";

test.describe("Navigation @navigation @regression", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByText("Today's appointments")).toBeVisible({ timeout: 20_000 });
  });

  test("sidebar navigates to patients", async ({ page, patientsPage }) => {
    await patientsPage.navigateSidebar("Patient Registry");
    await patientsPage.expectListLoaded();
    await expect(page).toHaveURL(/\/patients/);
  });

  test("sidebar navigates to appointments", async ({ page, appointmentsPage }) => {
    await appointmentsPage.navigateSidebar("Schedule");
    await appointmentsPage.expectListLoaded();
    await expect(page).toHaveURL(/\/appointments$/);
  });

  test("sidebar navigates to invoices", async ({ page, invoicesPage }) => {
    await invoicesPage.navigateSidebar("Invoices");
    await invoicesPage.expectListLoaded();
    await expect(page).toHaveURL(/\/billing\/invoices/);
  });

  test("sidebar navigates to settings", async ({ page, settingsPage }) => {
    await settingsPage.navigateSidebar("Settings");
    await settingsPage.expectLoaded();
    await expect(page).toHaveURL(/\/settings/);
  });

  test("sidebar navigates to doctors", async ({ page, doctorsPage }) => {
    await doctorsPage.navigateSidebar("Doctors");
    await doctorsPage.expectListLoaded();
    await expect(page).toHaveURL(/\/doctors/);
  });

  test("sidebar navigates to admin clinics", async ({ page, clinicsPage }) => {
    await clinicsPage.navigateSidebar("Clinics");
    await clinicsPage.expectListLoaded();
    await expect(page).toHaveURL(/\/admin\/clinics/);
  });
});
