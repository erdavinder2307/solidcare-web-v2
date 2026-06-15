import apiClient from "@/lib/api/apiClient";

export interface ICD10Result {
  code: string;
  description: string;
  category: string | null;
  chapter: string | null;
  is_billable: boolean;
}

export const icd10Api = {
  search: (q: string, limit = 20): Promise<ICD10Result[]> =>
    apiClient.get("/icd10", { params: { q, limit } }).then((r) => r.data),
};
