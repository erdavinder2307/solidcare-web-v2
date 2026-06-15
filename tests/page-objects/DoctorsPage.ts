import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class DoctorsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async gotoList(): Promise<void> {
    await super.goto("/doctors");
  }

  async gotoRegister(): Promise<void> {
    await super.goto("/doctors/new");
  }

  async expectListLoaded(): Promise<void> {
    await expect(this.page.getByRole("heading", { level: 1, name: "Doctors" })).toBeVisible();
  }
}
