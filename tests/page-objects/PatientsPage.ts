import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { PatientData } from "../test-data/factories";

export class PatientsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async gotoList(): Promise<void> {
    await super.goto("/patients");
  }

  async gotoRegister(): Promise<void> {
    await super.goto("/patients/new");
  }

  async gotoPatient(patientId: string): Promise<void> {
    await super.goto(`/patients/${patientId}`);
  }

  async gotoEdit(patientId: string): Promise<void> {
    await super.goto(`/patients/${patientId}/edit`);
  }

  async registerPatient(data: PatientData): Promise<{ id: string }> {
    await this.fillByLabel("First name *", data.first_name);
    await this.fillByLabel("Last name *", data.last_name);
    await this.fillByLabel("Phone *", data.phone);
    if (data.email) await this.fillByLabel("Email", data.email);

    const [response] = await Promise.all([
      this.page.waitForResponse(
        (r) => r.url().includes("/patients") && r.request().method() === "POST",
      ),
      this.page.getByRole("button", { name: /register patient/i }).click(),
    ]);

    expect(response.status(), await response.text()).toBe(201);
    const body = await response.json();
    await expect(this.page).toHaveURL(new RegExp(`/patients/${body.id}`));
    return body;
  }

  async searchPatient(name: string): Promise<void> {
    await this.page.getByPlaceholder(/search by name/i).fill(name);
  }

  async expectPatientInList(name: string): Promise<void> {
    await expect(this.page.getByRole("row", { name: new RegExp(name, "i") })).toBeVisible();
  }

  async expectListLoaded(): Promise<void> {
    await expect(this.page.getByRole("heading", { level: 1, name: "Patients" })).toBeVisible();
  }
}
