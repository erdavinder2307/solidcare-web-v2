import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestUser } from "../test-data/users";

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await super.goto("/login");
  }

  async login(user: TestUser): Promise<void> {
    await this.fillByLabel("Email address", user.email);
    await this.fillByLabel("Password", user.password);
    await this.page.getByRole("button", { name: "Sign in" }).click();
    await this.page.waitForURL(/\/(dashboard|mfa)/, { timeout: 30_000 });
  }

  async loginWithCredentials(email: string, password: string): Promise<void> {
    await this.fillByLabel("Email address", email);
    await this.fillByLabel("Password", password);
    await this.page.getByRole("button", { name: "Sign in" }).click();
  }

  async expectLoginError(): Promise<void> {
    await expect(this.page.getByRole("alert")).toBeVisible();
  }

  async expectPasswordValidation(): Promise<void> {
    await expect(this.page.getByText(/at least 8 characters/i)).toBeVisible();
  }

  async expectOnLoginPage(): Promise<void> {
    await expect(this.page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  }
}
