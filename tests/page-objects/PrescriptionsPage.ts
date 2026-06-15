import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class PrescriptionsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async gotoList(): Promise<void> {
    await super.goto("/prescriptions");
  }

  async gotoCreate(): Promise<void> {
    await super.goto("/prescriptions/new");
  }

  async expectListLoaded(): Promise<void> {
    await expect(this.page.getByRole("heading", { level: 1, name: "Prescriptions" })).toBeVisible();
  }
}
