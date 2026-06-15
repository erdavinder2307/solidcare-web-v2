import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class DashboardPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await super.goto("/dashboard");
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/dashboard/, { timeout: 20_000 });
    await expect(this.page.getByText("Today's appointments")).toBeVisible({ timeout: 20_000 });
  }

  async expectQuickAction(label: string): Promise<void> {
    await expect(this.page.getByRole("link", { name: label })).toBeVisible();
  }

  async clickQuickAction(label: string): Promise<void> {
    await this.page.getByRole("link", { name: label }).click();
  }
}
