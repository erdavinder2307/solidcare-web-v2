import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class InvoicesPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async gotoList(): Promise<void> {
    await super.goto("/billing/invoices");
  }

  async gotoCreate(): Promise<void> {
    await super.goto("/billing/invoices/new");
  }

  async gotoDetail(invoiceId: string): Promise<void> {
    await super.goto(`/billing/invoices/${invoiceId}`);
  }

  async expectListLoaded(): Promise<void> {
    await expect(this.page.getByRole("heading", { level: 1, name: "Invoices" })).toBeVisible();
  }
}
