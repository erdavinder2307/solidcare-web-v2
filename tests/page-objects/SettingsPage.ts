import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class SettingsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await super.goto("/settings");
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page.getByRole("heading", { level: 1, name: "Settings" })).toBeVisible();
  }

  async expectProfileSection(): Promise<void> {
    await expect(this.page.getByText("Profile", { exact: true })).toBeVisible();
  }
}
