import apiClient from "@/lib/api/apiClient";

export type EncounterStatus = "in_progress" | "completed" | "cancelled";
export type EncounterType = "opd" | "ipd" | "emergency" | "telemedicine";
export type ServiceCategory = "consultation" | "procedure" | "lab" | "pharmacy" | "imaging" | "nursing" | "other";

export interface InvoiceItemSuggestion {
  service_category: ServiceCategory;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
}

export interface VitalCreate {
  systolic_bp?: number;
  diastolic_bp?: number;
  pulse_rate?: number;
  temperature?: number;
  spo2?: number;
  weight_kg?: number;
  height_cm?: number;
}

export interface DiagnosisCreate {
  icd10_code?: string;
  icd10_description?: string;
  custom_description?: string;
  diagnosis_type?: "primary" | "secondary" | "differential" | "provisional";
  is_chronic?: boolean;
  notes?: string;
}

export interface EncounterCreate {
  clinic_id: string;
  patient_id: string;
  doctor_id: string;
  appointment_id?: string;
  encounter_type?: EncounterType;
  chief_complaint?: string;
  history_of_present_illness?: string;
  general_examination?: string;
  systemic_examination?: string;
  clinical_impression?: string;
  treatment_plan?: string;
  follow_up_instructions?: string;
  follow_up_days?: number;
  vitals?: VitalCreate;
  diagnoses?: DiagnosisCreate[];
}

export interface Encounter {
  id: string;
  clinic_id: string;
  patient_id: string;
  doctor_id: string;
  appointment_id: string | null;
  encounter_type: EncounterType;
  status: EncounterStatus;
  encounter_date: string;
  chief_complaint: string | null;
  history_of_present_illness: string | null;
  general_examination: string | null;
  clinical_impression: string | null;
  treatment_plan: string | null;
  follow_up_instructions: string | null;
  completed_at: string | null;
  attested_by_id: string | null;
  attested_at: string | null;
  created_at: string;
  vitals?: Array<{ systolic_bp?: number; diastolic_bp?: number; pulse_rate?: number; temperature?: number; spo2?: number }>;
  diagnoses?: Array<{ icd10_code?: string; custom_description?: string; diagnosis_type: string }>;
}

export type EncounterUpdate = Partial<Omit<EncounterCreate, "clinic_id" | "patient_id" | "doctor_id" | "appointment_id" | "encounter_type" | "vitals" | "diagnoses">>;

export const encountersApi = {
  create: (data: EncounterCreate) =>
    apiClient.post<Encounter>("/encounters", data).then((r) => r.data),

  update: (id: string, data: EncounterUpdate) =>
    apiClient.patch<Encounter>(`/encounters/${id}`, data).then((r) => r.data),

  get: (id: string) =>
    apiClient.get<Encounter>(`/encounters/${id}`).then((r) => r.data),

  listForPatient: (patientId: string, params?: { page?: number; page_size?: number }) =>
    apiClient.get(`/encounters/patient/${patientId}`, { params }).then((r) => r.data),

  complete: (id: string) =>
    apiClient.post<Encounter>(`/encounters/${id}/complete`).then((r) => r.data),

  attest: (id: string) =>
    apiClient.post<Encounter>(`/encounters/${id}/attest`).then((r) => r.data),

  addDiagnosis: (encounterId: string, data: DiagnosisCreate) =>
    apiClient.post(`/encounters/${encounterId}/diagnoses`, data).then((r) => r.data),

  removeDiagnosis: (encounterId: string, diagnosisId: string) =>
    apiClient.delete(`/encounters/${encounterId}/diagnoses/${diagnosisId}`),

  getForAppointment: (appointmentId: string) =>
    apiClient.get<Encounter | null>(`/encounters/for-appointment/${appointmentId}`).then((r) => r.data),

  addVitals: (encounterId: string, data: Partial<VitalCreate>) =>
    apiClient.post(`/encounters/${encounterId}/vitals`, data).then((r) => r.data),

  getInvoiceItems: (encounterId: string) =>
    apiClient.get<InvoiceItemSuggestion[]>(`/encounters/${encounterId}/invoice-items`).then((r) => r.data),
};
