import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { billingApi } from "../api/billingApi";
import { patientsApi } from "@/features/patients/api/patientsApi";
import { clinicsApi } from "@/features/clinics/api/clinicsApi";
import { formatCurrency, formatDate, formatDateTime } from "@/shared/utils/formatters";

const METHOD_LABELS: Record<string, string> = {
  cash: "Cash",
  card: "Card",
  upi: "UPI",
  net_banking: "Net Banking",
  cheque: "Cheque",
  insurance: "Insurance",
  advance: "Advance",
  other: "Other",
};

export default function PaymentReceiptPage() {
  const { invoiceId } = useParams<{ invoiceId: string }>();

  const { data: invoice } = useQuery({
    queryKey: ["invoice", invoiceId],
    queryFn: () => billingApi.getInvoice(invoiceId!),
    enabled: !!invoiceId,
  });

  const { data: payments } = useQuery({
    queryKey: ["invoice-payments", invoiceId],
    queryFn: () => billingApi.listPayments(invoiceId!),
    enabled: !!invoiceId,
  });

  const { data: patient } = useQuery({
    queryKey: ["patient", invoice?.patient_id],
    queryFn: () => patientsApi.get(invoice!.patient_id),
    enabled: !!invoice?.patient_id,
  });

  const { data: clinic } = useQuery({
    queryKey: ["clinic", invoice?.clinic_id],
    queryFn: () => clinicsApi.get(invoice!.clinic_id),
    enabled: !!invoice?.clinic_id,
  });

  // Auto-print once all data loaded
  useEffect(() => {
    if (invoice && patient && clinic && payments) {
      const timer = setTimeout(() => window.print(), 400);
      return () => clearTimeout(timer);
    }
  }, [invoice, patient, clinic, payments]);

  if (!invoice || !patient) {
    return <div style={{ padding: 40, fontFamily: "Arial, sans-serif" }}>Loading…</div>;
  }

  const paidPayments = (payments ?? []).filter((p) => p.status === "completed");
  const totalPaid = paidPayments.reduce((acc, p) => acc + p.amount, 0);

  return (
    <>
      <style>{`
        @media print {
          @page { size: A5 portrait; margin: 12mm 14mm 14mm 14mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
        }

        body { margin: 0; padding: 0; background: #fff; }

        .receipt-page {
          font-family: Arial, sans-serif;
          font-size: 12px;
          color: #1a1a1a;
          max-width: 560px;
          margin: 0 auto;
          padding: 20px 24px;
        }

        /* Header */
        .receipt-header {
          text-align: center;
          border-bottom: 2px solid #1565c0;
          padding-bottom: 10px;
          margin-bottom: 14px;
        }
        .receipt-clinic { font-size: 18px; font-weight: 700; color: #1565c0; }
        .receipt-clinic-meta { font-size: 10px; color: #555; margin-top: 2px; }
        .receipt-title { font-size: 15px; font-weight: 700; margin-top: 8px; letter-spacing: 1px; text-transform: uppercase; }

        /* Info row */
        .receipt-info {
          display: flex;
          justify-content: space-between;
          background: #f5f8ff;
          border-radius: 6px;
          padding: 8px 12px;
          margin-bottom: 12px;
          gap: 16px;
        }
        .receipt-info-col label { font-size: 10px; color: #888; display: block; margin-bottom: 1px; }
        .receipt-info-col span { font-size: 12px; font-weight: 600; }

        /* Line items */
        .receipt-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
        .receipt-table thead tr { background: #1565c0; color: #fff; }
        .receipt-table thead th { padding: 6px 8px; text-align: left; font-size: 10px; }
        .receipt-table thead th:last-child { text-align: right; }
        .receipt-table tbody tr:nth-child(even) { background: #f0f4ff; }
        .receipt-table tbody td { padding: 6px 8px; font-size: 11px; border-bottom: 1px solid #e0e0e0; }
        .receipt-table tbody td:last-child { text-align: right; }

        /* Totals */
        .receipt-totals { border-top: 1px solid #ccc; margin-top: 4px; padding-top: 8px; }
        .receipt-row { display: flex; justify-content: space-between; margin-bottom: 4px; }
        .receipt-row-bold { font-weight: 700; font-size: 13px; }
        .receipt-paid { color: #2e7d32; }

        /* Payments */
        .receipt-section-title { font-size: 11px; font-weight: 700; color: #555; text-transform: uppercase; letter-spacing: 0.5px; margin: 12px 0 6px; }

        /* Footer */
        .receipt-footer {
          margin-top: 20px;
          border-top: 1px dashed #ccc;
          padding-top: 10px;
          text-align: center;
          font-size: 10px;
          color: #888;
        }

        /* Screen buttons */
        .no-print {
          position: fixed;
          bottom: 24px;
          right: 24px;
          display: flex;
          gap: 10px;
        }
        .btn-print { background: #1565c0; color: #fff; border: none; border-radius: 6px; padding: 10px 22px; font-size: 14px; cursor: pointer; font-weight: 600; }
        .btn-close { background: #e0e0e0; color: #333; border: none; border-radius: 6px; padding: 10px 22px; font-size: 14px; cursor: pointer; }
      `}</style>

      <div className="receipt-page">
        {/* Header */}
        <div className="receipt-header">
          <div className="receipt-clinic">{clinic?.name ?? "Clinic"}</div>
          <div className="receipt-clinic-meta">
            {[clinic?.city, clinic?.state].filter(Boolean).join(", ")}
            {clinic?.phone ? ` · ${clinic.phone}` : ""}
            {clinic?.email ? ` · ${clinic.email}` : ""}
          </div>
          <div className="receipt-title">Payment Receipt</div>
        </div>

        {/* Info */}
        <div className="receipt-info">
          <div className="receipt-info-col">
            <label>Patient</label>
            <span>{patient.full_name}</span>
          </div>
          <div className="receipt-info-col">
            <label>Invoice No.</label>
            <span>{invoice.invoice_number}</span>
          </div>
          <div className="receipt-info-col">
            <label>Date</label>
            <span>{formatDate(invoice.invoice_date)}</span>
          </div>
          <div className="receipt-info-col">
            <label>Status</label>
            <span style={{ textTransform: "capitalize" }}>{invoice.status.replace("_", " ")}</span>
          </div>
        </div>

        {/* Line items */}
        <table className="receipt-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Category</th>
              <th style={{ textAlign: "right" }}>Qty</th>
              <th style={{ textAlign: "right" }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.line_items.map((line) => (
              <tr key={line.id}>
                <td>{line.description}</td>
                <td style={{ textTransform: "capitalize" }}>{line.service_category}</td>
                <td style={{ textAlign: "right" }}>{line.quantity}</td>
                <td>{formatCurrency(line.total_amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="receipt-totals">
          <div className="receipt-row">
            <span>Subtotal</span>
            <span>{formatCurrency(invoice.subtotal)}</span>
          </div>
          {invoice.discount_amount > 0 && (
            <div className="receipt-row">
              <span>Discount</span>
              <span>−{formatCurrency(invoice.discount_amount)}</span>
            </div>
          )}
          {invoice.total_tax > 0 && (
            <div className="receipt-row">
              <span>GST (CGST + SGST)</span>
              <span>{formatCurrency(invoice.total_tax)}</span>
            </div>
          )}
          <div className="receipt-row receipt-row-bold">
            <span>Total</span>
            <span>{formatCurrency(invoice.total_amount)}</span>
          </div>
          <div className="receipt-row receipt-paid">
            <span>Paid</span>
            <span>{formatCurrency(invoice.paid_amount)}</span>
          </div>
          {invoice.outstanding_amount > 0 && (
            <div className="receipt-row" style={{ color: "#c62828" }}>
              <span>Outstanding</span>
              <span>{formatCurrency(invoice.outstanding_amount)}</span>
            </div>
          )}
        </div>

        {/* Payment breakdown */}
        {paidPayments.length > 0 && (
          <>
            <div className="receipt-section-title">Payment details</div>
            {paidPayments.map((p) => (
              <div key={p.id} className="receipt-row" style={{ fontSize: 11 }}>
                <span>
                  {METHOD_LABELS[p.payment_method] ?? p.payment_method}
                  {p.transaction_reference ? ` · Ref: ${p.transaction_reference}` : ""}
                  {p.receipt_number ? ` · Rcpt: ${p.receipt_number}` : ""}
                </span>
                <span>{formatCurrency(p.amount)}</span>
              </div>
            ))}
            <div className="receipt-row receipt-row-bold receipt-paid" style={{ marginTop: 4 }}>
              <span>Total paid</span>
              <span>{formatCurrency(totalPaid)}</span>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="receipt-footer">
          <div>Thank you for choosing {clinic?.name ?? "us"}.</div>
          <div style={{ marginTop: 4 }}>This is a computer-generated receipt and does not require a signature.</div>
        </div>
      </div>

      <div className="no-print">
        <button className="btn-print" onClick={() => window.print()}>Print</button>
        <button className="btn-close" onClick={() => window.close()}>Close</button>
      </div>
    </>
  );
}
