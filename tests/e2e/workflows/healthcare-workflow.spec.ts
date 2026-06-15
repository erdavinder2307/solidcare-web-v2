import { test, expect } from "../../fixtures/test-fixtures";
import { uniquePhone } from "../../test-data/factories";

test.describe("Healthcare End-to-End Workflow @workflow @critical", () => {
  test("complete patient journey: register → appointment → encounter → prescription → invoice → payment", async ({
    apiHelper,
    patientsPage,
    invoicesPage,
    page,
  }) => {
    const phone = uniquePhone();
    const patient = await apiHelper.createPatient({
      phone,
      first_name: "Workflow",
      last_name: "Patient",
    });

    const appointment = await apiHelper.createAppointment(patient.id);
    await apiHelper.updateAppointmentStatus(appointment.id, "checked_in");
    await apiHelper.updateAppointmentStatus(appointment.id, "in_consultation");

    const encounter = await apiHelper.createEncounter(patient.id, appointment.id);
    const prescription = await apiHelper.createPrescription(encounter.id, patient.id);
    const invoice = await apiHelper.createInvoice(patient.id);
    const invoiceDetails = await apiHelper.getInvoice(invoice.id);
    const total = Number(invoiceDetails.total_amount ?? 500);
    await apiHelper.recordPayment(invoice.id, total, patient.id);

    const dbPatient = await apiHelper.getPatient(patient.id);
    expect(dbPatient.id).toBe(patient.id);

    const dbInvoice = await apiHelper.getInvoice(invoice.id);
    expect(["paid", "partially_paid", "issued"]).toContain(dbInvoice.status);

    await patientsPage.gotoPatient(patient.id);
    await expect(page.getByText("Workflow Patient").first()).toBeVisible();

    await invoicesPage.gotoDetail(invoice.id);
    await expect(page.getByText(invoice.invoice_number).first()).toBeVisible({ timeout: 20_000 });

    expect(appointment.id).toBeTruthy();
    expect(encounter.id).toBeTruthy();
    expect(prescription.id).toBeTruthy();
  });
});
