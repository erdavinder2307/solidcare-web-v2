import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class UsersPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await super.goto("/admin/users");
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page.getByRole("heading", { level: 1, name: "Users" })).toBeVisible();
  }
}
