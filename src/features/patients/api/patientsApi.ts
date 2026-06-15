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
  marital_status: string | null;
  phone: string;
  alternate_phone: string | null;
  email: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  country: string;
  known_allergies: string[] | null;
  known_conditions: string[] | null;
  abha_number: string | null;
  abha_address: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  emergency_contact_relation: string | null;
  insurance_provider: string | null;
  insurance_policy_number: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
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
  known_conditions?: string[];
  insurance_provider?: string;
  insurance_policy_number?: string;
}

export interface PatientListItem {
  id: string;
  uhid: string;
  full_name: string;
  phone: string;
  email: string | null;
  date_of_birth: string | null;
  gender: string | null;
  blood_group: string | null;
  city: string | null;
  abha_number: string | null;
  is_active: boolean;
  created_at: string;
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

  searchDuplicates: (params: {
    phone?: string;
    first_name?: string;
    last_name?: string;
    abha_number?: string;
  }) =>
    apiClient
      .get<PatientListItem[]>("/patients/search-duplicates", { params })
      .then((r) => r.data),
};

export type DocumentType =
  | "aadhaar"
  | "pan"
  | "passport"
  | "driving_license"
  | "voter_id"
  | "other";

export interface PatientDocument {
  id: string;
  patient_id: string;
  document_type: DocumentType;
  file_name: string;
  content_type: string | null;
  file_size_bytes: number | null;
  notes: string | null;
  created_at: string;
  download_url: string | null;
}

export const patientDocumentsApi = {
  list: (patientId: string) =>
    apiClient.get<PatientDocument[]>(`/patients/${patientId}/documents`).then((r) => r.data),

  upload: (patientId: string, file: File, documentType: DocumentType, notes?: string) => {
    const form = new FormData();
    form.append("file", file);
    form.append("document_type", documentType);
    if (notes) form.append("notes", notes);
    return apiClient
      .post<PatientDocument>(`/patients/${patientId}/documents`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },

  delete: (patientId: string, documentId: string) =>
    apiClient.delete(`/patients/${patientId}/documents/${documentId}`),
};
