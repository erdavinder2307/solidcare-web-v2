import apiClient from "@/lib/api/apiClient";

export type InvoiceStatus = "draft" | "issued" | "partially_paid" | "paid" | "cancelled" | "refunded";
export type PaymentMethod = "cash" | "card" | "upi" | "net_banking" | "cheque" | "insurance" | "advance" | "other";
export type ServiceCategory = "consultation" | "procedure" | "lab" | "pharmacy" | "imaging" | "nursing" | "other";

export interface InvoiceLineItem {
  id: string;
  service_category: ServiceCategory;
  description: string;
  quantity: number;
  unit_price: number;
  discount_amount: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  invoice_date: string;
  status: InvoiceStatus;
  subtotal: number;
  discount_amount: number;
  taxable_amount: number;
  cgst_amount: number;
  sgst_amount: number;
  total_tax: number;
  total_amount: number;
  paid_amount: number;
  outstanding_amount: number;
  patient_id: string;
  clinic_id: string;
  encounter_id: string | null;
  notes: string | null;
  line_items: InvoiceLineItem[];
}

export interface InvoiceCreate {
  clinic_id: string;
  patient_id: string;
  encounter_id?: string;
  invoice_date: string;
  discount_percentage?: number;
  notes?: string;
  line_items: Array<{
    service_category: ServiceCategory;
    description: string;
    quantity?: number;
    unit_price: number;
    discount_amount?: number;
    tax_rate?: number;
  }>;
}

export interface Payment {
  id: string;
  invoice_id: string;
  payment_method: PaymentMethod;
  status: string;
  amount: number;
  transaction_reference: string | null;
  receipt_number: string | null;
  paid_at: string | null;
}

export const billingApi = {
  listInvoices: (params?: { page?: number; page_size?: number; patient_id?: string }) =>
    apiClient.get("/billing/invoices", { params }).then((r) => r.data),

  getInvoice: (id: string) =>
    apiClient.get<Invoice>(`/billing/invoices/${id}`).then((r) => r.data),

  createInvoice: (data: InvoiceCreate) =>
    apiClient.post<Invoice>("/billing/invoices", data).then((r) => r.data),

  listPayments: (invoiceId: string) =>
    apiClient.get<Payment[]>(`/billing/payments/invoice/${invoiceId}`).then((r) => r.data),

  recordPayment: (data: {
    invoice_id: string;
    patient_id: string;
    clinic_id: string;
    payment_method: PaymentMethod;
    amount: number;
    transaction_reference?: string;
    notes?: string;
  }) => apiClient.post<Payment>("/billing/payments", data).then((r) => r.data),
};

// ---------- Service Charge Master ----------

export interface ServiceCharge {
  id: string;
  clinic_id: string;
  service_category: ServiceCategory;
  service_code: string;
  description: string;
  standard_price: number;
  tax_rate: number;
  is_taxable: boolean;
  is_active: boolean;
}

export interface ServiceChargeCreate {
  clinic_id: string;
  service_category: ServiceCategory;
  service_code: string;
  description: string;
  standard_price: number;
  tax_rate?: number;
  is_taxable?: boolean;
}

export interface ServiceChargeUpdate {
  description?: string;
  standard_price?: number;
  tax_rate?: number;
  is_taxable?: boolean;
  is_active?: boolean;
}

export const serviceChargesApi = {
  list: (params?: { clinic_id?: string; active_only?: boolean }) =>
    apiClient.get<ServiceCharge[]>("/billing/service-charges", { params }).then((r) => r.data),

  create: (data: ServiceChargeCreate) =>
    apiClient.post<ServiceCharge>("/billing/service-charges", data).then((r) => r.data),

  update: (id: string, data: ServiceChargeUpdate) =>
    apiClient.patch<ServiceCharge>(`/billing/service-charges/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    apiClient.delete(`/billing/service-charges/${id}`),
};
