import { test, expect } from "../../fixtures/test-fixtures";

test.describe("Clinical Modules @clinical @regression", () => {
  test("view encounters list", async ({ encountersPage }) => {
    await encountersPage.gotoList();
    await encountersPage.expectListLoaded();
  });

  test("view prescriptions list", async ({ prescriptionsPage }) => {
    await prescriptionsPage.gotoList();
    await prescriptionsPage.expectListLoaded();
  });

  test("clinical waiting room loads", async ({ waitingRoomPage }) => {
    await waitingRoomPage.gotoClinicalWaitingRoom();
    await waitingRoomPage.expectClinicalWorkspaceLoaded();
  });

  test("doctor workspace loads", async ({ page }) => {
    await page.goto("/clinical/workspace");
    await expect(page.getByRole("heading", { level: 1, name: "Clinical Workspace" })).toBeVisible();
  });
});
