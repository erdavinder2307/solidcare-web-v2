import apiClient from "@/lib/api/apiClient";

export interface Medicine {
  id: string;
  generic_name: string;
  brand_name: string | null;
  manufacturer: string | null;
  dosage_form: string;
  strength: string | null;
  is_active: boolean;
  is_scheduled: boolean;
  schedule_class: string | null;
}

export const medicinesApi = {
  search: (q: string, limit = 20): Promise<Medicine[]> =>
    apiClient.get("/medicines", { params: { q, limit } }).then((r) => r.data),
};
