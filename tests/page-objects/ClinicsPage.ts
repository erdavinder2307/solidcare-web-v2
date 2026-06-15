import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ClinicsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async gotoList(): Promise<void> {
    await super.goto("/admin/clinics");
  }

  async gotoDetail(clinicId: string): Promise<void> {
    await super.goto(`/admin/clinics/${clinicId}`);
  }

  async expectListLoaded(): Promise<void> {
    await expect(this.page.getByRole("heading", { level: 1, name: "Clinics" })).toBeVisible();
  }
}
