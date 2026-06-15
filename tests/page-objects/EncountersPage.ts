import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class EncountersPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async gotoList(): Promise<void> {
    await super.goto("/encounters");
  }

  async gotoDetail(encounterId: string): Promise<void> {
    await super.goto(`/encounters/${encounterId}`);
  }

  async expectListLoaded(): Promise<void> {
    await expect(this.page.getByRole("heading", { level: 1, name: "Encounters" })).toBeVisible();
  }
}
