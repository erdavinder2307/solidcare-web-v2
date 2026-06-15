import apiClient from "@/lib/api/apiClient";

export interface Clinic {
  id: string;
  organization_id: string;
  name: string;
  code: string;
  clinic_type: string;
  phone: string | null;
  email: string | null;
  city: string | null;
  state: string | null;
  is_active: boolean;
}

export const clinicsApi = {
  list: () => apiClient.get<Clinic[]>("/clinics").then((r) => r.data),
  get: (id: string) => apiClient.get<Clinic>(`/clinics/${id}`).then((r) => r.data),
};
