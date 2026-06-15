import { test, expect } from "../../fixtures/test-fixtures";

test.describe("Billing @billing @regression", () => {
  test("view invoices list", async ({ invoicesPage }) => {
    await invoicesPage.gotoList();
    await invoicesPage.expectListLoaded();
  });

  test("view invoice detail from API-created invoice", async ({ invoicesPage, apiHelper }) => {
    const patient = await apiHelper.createPatient();
    const invoice = await apiHelper.createInvoice(patient.id);
    await invoicesPage.gotoDetail(invoice.id);
    await expect(invoicesPage.page.getByText(invoice.invoice_number).first()).toBeVisible();
  });
});
