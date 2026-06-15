import { test, expect } from "../../fixtures/test-fixtures";
import { captureResponsiveScreenshot } from "../../helpers/security-helper";

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "laptop", width: 1280, height: 800 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
];

test.describe("Responsive Layout @responsive", () => {
  for (const vp of VIEWPORTS) {
    test(`dashboard renders on ${vp.name} (${vp.width}x${vp.height})`, async ({ dashboardPage, page }) => {
      await dashboardPage.goto();
      await captureResponsiveScreenshot(page, "dashboard", vp);
      await expect(page.getByText("Today's appointments")).toBeVisible();
    });
  }

  test("mobile navigation toggle visible on small screens", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/dashboard");
    await expect(page.getByRole("button", { name: /navigation menu/i })).toBeVisible();
  });

  test("patients list on tablet", async ({ patientsPage, page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await patientsPage.gotoList();
    await captureResponsiveScreenshot(page, "patients-tablet", { width: 768, height: 1024 });
    await patientsPage.expectListLoaded();
  });
});
