import { defineConfig, devices } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:5173";
const API_URL = process.env.PLAYWRIGHT_API_URL ?? "http://localhost:8000/api/v1";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 2 : 1,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  globalSetup: path.join(__dirname, "tests/helpers/global-setup.ts"),
  globalTeardown: path.join(__dirname, "tests/helpers/global-teardown.ts"),
  reporter: [
    ["list"],
    ["html", { outputFolder: "tests/reports/html", open: "never" }],
    ["json", { outputFile: "tests/reports/results.json" }],
    ["junit", { outputFile: "tests/reports/junit.xml" }],
    [path.join(__dirname, "tests/helpers/custom-reporter.ts")],
  ],
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    extraHTTPHeaders: {
      Accept: "application/json",
    },
  },
  projects: [
    { name: "setup", testMatch: /auth\.setup\.ts/ },
    {
      name: "chromium-desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
        storageState: "tests/.auth/admin.json",
      },
      dependencies: ["setup"],
      testIgnore: [/auth\.setup\.ts/, /authentication\.spec\.ts/, /security\.spec\.ts/, /responsive/, /role-based-access\.spec\.ts/, /smoke\.spec\.ts/],
    },
    {
      name: "chromium-auth",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
      testMatch: [/authentication\.spec\.ts/, /security\.spec\.ts/, /smoke\.spec\.ts/, /role-based-access\.spec\.ts/],
    },
    {
      name: "chromium-responsive",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "tests/.auth/admin.json",
      },
      dependencies: ["setup"],
      testMatch: /responsive/,
    },
  ],
  webServer: process.env.CI
    ? undefined
    : {
        command: "npm run dev",
        url: BASE_URL,
        reuseExistingServer: true,
        timeout: 120_000,
      },
  metadata: {
    apiUrl: API_URL,
  },
});
