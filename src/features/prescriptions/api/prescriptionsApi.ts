import apiClient from "@/lib/api/apiClient";

export type PrescriptionStatus = "draft" | "finalized" | "dispensed" | "cancelled";
export type FrequencyCode = "OD" | "BD" | "TDS" | "QID" | "SOS" | "HS" | "STAT" | "OW" | "CUSTOM";
export type MealRelation = "before_food" | "after_food" | "with_food" | "empty_stomach" | "any_time";

export interface PrescriptionItem {
  id: string;
  medicine_name: string;
  dosage: string | null;
  frequency: FrequencyCode;
  duration_days: number | null;
  quantity: string | null;
  meal_relation: MealRelation;
  instructions: string | null;
}

export interface Prescription {
  id: string;
  encounter_id: string;
  patient_id: string;
  doctor_id: string;
  clinic_id: string;
  status: PrescriptionStatus;
  diagnosis_summary: string | null;
  notes: string | null;
  pdf_path: string | null;
  share_token: string | null;
  created_at: string;
  items: PrescriptionItem[];
}

export interface PrescriptionCreate {
  encounter_id: string;
  patient_id: string;
  doctor_id: string;
  clinic_id: string;
  diagnosis_summary?: string;
  notes?: string;
  items: Array<{
    medicine_name: string;
    dosage?: string;
    frequency: FrequencyCode;
    duration_days?: number;
    quantity?: string;
    meal_relation?: MealRelation;
    instructions?: string;
  }>;
}

export const prescriptionsApi = {
  list: (params?: { page?: number; page_size?: number; patient_id?: string }) =>
    apiClient.get("/prescriptions", { params }).then((r) => r.data),

  get: (id: string) =>
    apiClient.get<Prescription>(`/prescriptions/${id}`).then((r) => r.data),

  create: (data: PrescriptionCreate) =>
    apiClient.post<Prescription>("/prescriptions", data).then((r) => r.data),

  finalize: (id: string) =>
    apiClient.post<Prescription>(`/prescriptions/${id}/finalize`).then((r) => r.data),

  getPdfUrl: (id: string) =>
    `${apiClient.defaults.baseURL ?? ''}/prescriptions/${id}/pdf`,
};
