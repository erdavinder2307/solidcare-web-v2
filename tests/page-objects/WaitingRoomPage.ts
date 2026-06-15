import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class WaitingRoomPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async gotoClinicalWaitingRoom(): Promise<void> {
    await super.goto("/clinical/workspace/waiting-room");
  }

  async gotoAppointmentQueue(): Promise<void> {
    await super.goto("/appointments/queue");
  }

  async expectClinicalWorkspaceLoaded(): Promise<void> {
    await expect(this.page.getByRole("heading", { level: 1, name: "Clinical Workspace" })).toBeVisible();
  }

  async expectQueueLoaded(): Promise<void> {
    await expect(this.page.getByRole("heading", { level: 1, name: "Waiting Room" })).toBeVisible();
  }
}
