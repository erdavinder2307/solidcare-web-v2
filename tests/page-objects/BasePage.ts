import { Page, Locator } from "@playwright/test";

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string): Promise<void> {
    await this.page.goto(path);
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
  }

  get heading(): Locator {
    return this.page.getByRole("heading").first();
  }

  async clickNav(label: string): Promise<void> {
    await this.page.getByRole("button", { name: label, exact: true }).click();
  }

  async navigateSidebar(label: string): Promise<void> {
    await this.page.locator(".MuiDrawer-root").getByText(label, { exact: true }).click();
  }

  async fillByLabel(label: string | RegExp, value: string): Promise<void> {
    await this.page.getByLabel(label).fill(value);
  }

  async selectByLabel(label: string | RegExp, value: string): Promise<void> {
    await this.page.getByLabel(label).click();
    await this.page.getByRole("option", { name: value, exact: true }).click();
  }

  async openAccountMenu(): Promise<void> {
    await this.page.getByRole("button", { name: "Account menu" }).click();
  }

  async logout(): Promise<void> {
    await this.openAccountMenu();
    await this.page.getByRole("menuitem", { name: /sign out/i }).click();
  }

  async submitForm(buttonText = "Save"): Promise<void> {
    await this.page.getByRole("button", { name: buttonText }).click();
  }

  async expectToast(text: string | RegExp): Promise<void> {
    await this.page.getByText(text).waitFor({ state: "visible", timeout: 10_000 });
  }
}
