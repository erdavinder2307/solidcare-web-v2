import { test, expect } from "../../fixtures/test-fixtures";

test.describe("Admin & Settings @admin @regression", () => {
  test("view users list", async ({ usersPage }) => {
    await usersPage.goto();
    await usersPage.expectLoaded();
  });

  test("view clinics list", async ({ clinicsPage }) => {
    await clinicsPage.gotoList();
    await clinicsPage.expectListLoaded();
  });

  test("view clinic detail", async ({ clinicsPage }) => {
    await clinicsPage.gotoDetail("00000000-0000-0000-0000-000000000010");
    await expect(clinicsPage.page.getByRole("heading", { level: 1, name: /Solidcare Demo Clinic/i })).toBeVisible();
  });

  test("view doctors list", async ({ doctorsPage }) => {
    await doctorsPage.gotoList();
    await doctorsPage.expectListLoaded();
  });

  test("view settings page", async ({ settingsPage }) => {
    await settingsPage.goto();
    await settingsPage.expectLoaded();
    await settingsPage.expectProfileSection();
  });
});
