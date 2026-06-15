import { test, expect } from "../../fixtures/test-fixtures";
import { createPatient, uniquePhone } from "../../test-data/factories";

test.describe("Patient Management @patients @regression", () => {
  test("view patient list", async ({ patientsPage }) => {
    await patientsPage.gotoList();
    await patientsPage.expectListLoaded();
  });

  test("create patient via UI", async ({ patientsPage, page }) => {
    const patient = {
      first_name: "E2E",
      last_name: `Patient${Date.now()}`,
      phone: `98${String(Date.now()).slice(-8)}`,
    };
    await patientsPage.gotoRegister();
    await patientsPage.registerPatient(patient);
    await expect(page).toHaveURL(/\/patients\/[a-f0-9-]+/);
  });

  test("search patient", async ({ patientsPage, apiHelper }) => {
    const uniqueName = `Search${Date.now()}`;
    const patient = await apiHelper.createPatient({
      phone: uniquePhone(),
      first_name: uniqueName,
      last_name: "Target",
    });
    await patientsPage.gotoList();
    await patientsPage.searchPatient(uniqueName);
    await expect(patientsPage.page.getByText(`${uniqueName} Target`).first()).toBeVisible({
      timeout: 15_000,
    });
  });

  test("view patient workspace", async ({ patientsPage, apiHelper, page }) => {
    const patient = await apiHelper.createPatient({ phone: uniquePhone() });
    await patientsPage.gotoPatient(patient.id);
    await expect(page.getByRole("heading", { level: 2, name: patient.full_name })).toBeVisible({
      timeout: 20_000,
    });
    await expect(page.getByRole("link", { name: /overview/i })).toBeVisible();
  });

  test("edit patient", async ({ patientsPage, apiHelper, page }) => {
    const patient = await apiHelper.createPatient({ phone: uniquePhone() });
    await patientsPage.gotoEdit(patient.id);
    await expect(page.getByRole("button", { name: "Save" })).toBeVisible({ timeout: 20_000 });
    const newCity = `Mohali${Date.now()}`;
    await patientsPage.fillByLabel(/^city$/i, newCity);

    const [response] = await Promise.all([
      page.waitForResponse(
        (r) => r.url().includes(`/patients/${patient.id}`) && r.request().method() === "PATCH",
      ),
      page.getByRole("button", { name: "Save" }).click(),
    ]);

    expect(response.ok(), await response.text()).toBeTruthy();
  });
});
