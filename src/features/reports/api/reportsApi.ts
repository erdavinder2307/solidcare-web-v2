import apiClient from "@/lib/api/apiClient";

export interface TrendPoint {
  date: string;
  label: string;
  total: number;
  completed: number;
}

export interface RevenueTrendPoint {
  week: string;
  label: string;
  revenue: number;
}

export interface TypeDistributionPoint {
  type: string;
  count: number;
}

export interface TopDiagnosisPoint {
  code: string;
  description: string;
  count: number;
}

export interface AgingBucket {
  key: string;
  label: string;
  count: number;
  amount: number;
}

export interface OutstandingInvoice {
  invoice_id: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string | null;
  patient_name: string;
  patient_phone: string;
  outstanding_amount: number;
  days_overdue: number;
  bucket: string;
}

export interface OutstandingAgingReport {
  as_of: string;
  total_outstanding: number;
  total_invoices: number;
  buckets: AgingBucket[];
  invoices: OutstandingInvoice[];
}

export interface DoctorSummary {
  from_date: string;
  to_date: string;
  appointments_total: number;
  appointments_completed: number;
  consultations: number;
  unique_patients: number;
  revenue_generated: number;
  daily_trend: { date: string; label: string; consultations: number }[];
}

export const reportsApi = {
  dashboardKpis: (params?: { clinic_id?: string; report_date?: string }) =>
    apiClient.get("/reports/dashboard/kpis", { params }).then((r) => r.data),

  dailyOpd: (clinicId: string, reportDate: string) =>
    apiClient
      .get("/reports/appointments/daily-opd", {
        params: { clinic_id: clinicId, report_date: reportDate },
      })
      .then((r) => r.data),

  revenue: (fromDate: string, toDate: string, clinicId?: string) =>
    apiClient
      .get("/reports/billing/revenue", {
        params: { from_date: fromDate, to_date: toDate, clinic_id: clinicId },
      })
      .then((r) => r.data),

  demographics: () => apiClient.get("/reports/patients/demographics").then((r) => r.data),

  appointmentsTrend: (params?: { clinic_id?: string; days?: number }) =>
    apiClient.get<TrendPoint[]>("/reports/appointments/trend", { params }).then((r) => r.data),

  revenueTrend: (params?: { clinic_id?: string; weeks?: number }) =>
    apiClient
      .get<RevenueTrendPoint[]>("/reports/billing/revenue-trend", { params })
      .then((r) => r.data),

  appointmentTypeDistribution: (params?: { clinic_id?: string; days?: number }) =>
    apiClient
      .get<TypeDistributionPoint[]>("/reports/appointments/type-distribution", { params })
      .then((r) => r.data),

  topDiagnoses: (params?: { clinic_id?: string; days?: number; limit?: number }) =>
    apiClient
      .get<TopDiagnosisPoint[]>("/reports/diagnoses/top", { params })
      .then((r) => r.data),

  opdVolumeTrend: (params?: { clinic_id?: string; from_date?: string; to_date?: string }) =>
    apiClient
      .get<TrendPoint[]>("/reports/appointments/opd-volume", { params })
      .then((r) => r.data),

  outstandingAging: (params?: { clinic_id?: string; as_of?: string }) =>
    apiClient
      .get<OutstandingAgingReport>("/reports/billing/outstanding", { params })
      .then((r) => r.data),

  doctorSummary: (doctorId: string, params: { from_date: string; to_date: string }) =>
    apiClient
      .get<DoctorSummary>(`/reports/doctors/${doctorId}/summary`, { params })
      .then((r) => r.data),

  exportCsv: (report: ReportExportKey, params?: Record<string, string | number | undefined>) =>
    apiClient
      .get<Blob>(`/reports/export/${report}`, { params, responseType: "blob" })
      .then((r) => r.data),
};

export type ReportExportKey =
  | "opd-volume"
  | "top-diagnoses"
  | "outstanding"
  | "revenue-trend"
  | "appointment-types";
