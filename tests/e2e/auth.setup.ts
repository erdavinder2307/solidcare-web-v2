import { test as setup, expect } from "@playwright/test";
import { LoginPage } from "../page-objects/LoginPage";
import { TEST_USERS } from "../test-data/users";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const authDir = path.join(__dirname, "../.auth");
const authFile = path.join(authDir, "admin.json");

setup("authenticate as admin", async ({ page }) => {
  fs.mkdirSync(authDir, { recursive: true });
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(TEST_USERS.superAdmin);
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 30_000 });
  await page.context().storageState({ path: authFile });
});
