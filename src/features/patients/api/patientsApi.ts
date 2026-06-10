import apiClient from "@/lib/api/apiClient";

export interface Patient {
  id: string;
  uhid: string;
  first_name: string;
  last_name: string;
  full_name: string;
  date_of_birth: string | null;
  gender: string | null;
  blood_group: string | null;
  phone: string;
  email: string | null;
  address_line1: string | null;
  city: string | null;
  state: string | null;
  abha_number: string | null;
  is_active: boolean;
  created_at: string;
}

export interface PatientCreate {
  first_name: string;
  last_name: string;
  phone: string;
  gender?: string;
  date_of_birth?: string;
  email?: string;
  blood_group?: string;
  city?: string;
  state?: string;
  address_line1?: string;
  abha_number?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relation?: string;
  known_allergies?: string[];
}

export const patientsApi = {
  list: (params?: { page?: number; page_size?: number; search?: string }) =>
    apiClient.get("/patients", { params }).then((r) => r.data),

  get: (id: string) =>
    apiClient.get<Patient>(`/patients/${id}`).then((r) => r.data),

  create: (data: PatientCreate) =>
    apiClient.post<Patient>("/patients", data).then((r) => r.data),

  update: (id: string, data: Partial<PatientCreate>) =>
    apiClient.patch<Patient>(`/patients/${id}`, data).then((r) => r.data),

  delete: (id: string) => apiClient.delete(`/patients/${id}`),
};
