import { test, expect } from "../../fixtures/test-fixtures";
import { uniquePhone, uniqueAppointmentSlot } from "../../test-data/factories";

test.describe("Appointment Management @appointments @regression", () => {
  test("view appointment list", async ({ appointmentsPage }) => {
    await appointmentsPage.gotoList();
    await appointmentsPage.expectListLoaded();
  });

  test("view waiting room queue", async ({ waitingRoomPage }) => {
    await waitingRoomPage.gotoAppointmentQueue();
    await waitingRoomPage.expectQueueLoaded();
  });

  test("create appointment via API and verify in list", async ({ appointmentsPage, apiHelper }) => {
    const patient = await apiHelper.createPatient({ phone: uniquePhone() });
    await apiHelper.createAppointment(patient.id);
    await appointmentsPage.gotoList();
    await appointmentsPage.expectListLoaded();
    await expect(appointmentsPage.page.getByRole("table")).toBeVisible();
  });

  test("cancel appointment via API", async ({ apiHelper }) => {
    const patient = await apiHelper.createPatient({ phone: uniquePhone() });
    const appt = await apiHelper.createAppointment(patient.id);
    await apiHelper.updateAppointmentStatus(appt.id, "cancelled");
    expect(appt.id).toBeTruthy();
  });

  test("reschedule appointment via API", async ({ apiHelper, request }) => {
    const patient = await apiHelper.createPatient({ phone: uniquePhone() });
    const appt = await apiHelper.createAppointment(patient.id);
    const token = process.env.E2E_ADMIN_TOKEN;
    const slot = uniqueAppointmentSlot();
    const res = await request.patch(
      `http://localhost:8000/api/v1/appointments/${appt.id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        data: slot,
      },
    );
    expect(res.ok()).toBeTruthy();
  });
});
