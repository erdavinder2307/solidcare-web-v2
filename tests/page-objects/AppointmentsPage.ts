import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class AppointmentsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async gotoList(): Promise<void> {
    await super.goto("/appointments");
  }

  async gotoBook(): Promise<void> {
    await super.goto("/appointments/new");
  }

  async gotoQueue(): Promise<void> {
    await super.goto("/appointments/queue");
  }

  async bookAppointment(options: {
    patientName: string;
    doctorName?: string;
    date?: string;
    time?: string;
    complaint?: string;
  }): Promise<void> {
    await this.page.getByLabel("Patient").click();
    await this.page.getByRole("option", { name: new RegExp(options.patientName, "i") }).click();

    await this.page.getByLabel("Doctor").click();
    const doctorPattern = options.doctorName ?? /./;
    await this.page.getByRole("option", { name: doctorPattern }).first().click();

    if (options.date) await this.fillByLabel("Date", options.date);
    if (options.time) await this.fillByLabel("Start time", options.time);
    if (options.complaint) await this.fillByLabel(/chief complaint/i, options.complaint);

    await this.page.getByRole("button", { name: /book appointment/i }).click();
  }

  async expectListLoaded(): Promise<void> {
    await expect(this.page.getByRole("heading", { level: 1, name: "Schedule" })).toBeVisible();
  }

  async expectQueueLoaded(): Promise<void> {
    await expect(this.page.getByRole("heading", { level: 1 })).toBeVisible();
  }
}
