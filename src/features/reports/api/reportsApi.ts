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
};
