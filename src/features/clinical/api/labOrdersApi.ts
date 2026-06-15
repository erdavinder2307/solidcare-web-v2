import apiClient from "@/lib/api/apiClient";

export type LabOrderStatus = "ordered" | "collected" | "processing" | "resulted" | "cancelled";

export interface LabOrderItem {
  id: string;
  test_name: string;
  test_code: string | null;
  notes: string | null;
}

export interface LabResult {
  id: string;
  test_name: string;
  value: string | null;
  unit: string | null;
  reference_range: string | null;
  is_abnormal: boolean | null;
  notes: string | null;
}

export interface LabOrder {
  id: string;
  encounter_id: string;
  patient_id: string;
  ordered_by_id: string;
  lab_name: string | null;
  notes: string | null;
  status: LabOrderStatus;
  ordered_at: string;
  items: LabOrderItem[];
  results?: LabResult[];
}

export interface LabOrderCreate {
  encounter_id: string;
  patient_id: string;
  ordered_by_id: string;
  lab_name?: string;
  notes?: string;
  items: Array<{ test_name: string; test_code?: string; notes?: string }>;
}

export interface LabResultCreate {
  test_name: string;
  value?: string;
  unit?: string;
  reference_range?: string;
  is_abnormal?: boolean;
  notes?: string;
}

export const labOrdersApi = {
  create: (data: LabOrderCreate) =>
    apiClient.post<LabOrder>("/lab-orders", data).then((r) => r.data),

  listForEncounter: (encounterId: string) =>
    apiClient.get<LabOrder[]>(`/lab-orders/encounter/${encounterId}`).then((r) => r.data),

  listForPatient: (patientId: string) =>
    apiClient.get<LabOrder[]>(`/lab-orders/patient/${patientId}`).then((r) => r.data),

  addResults: (orderId: string, results: LabResultCreate[]) =>
    apiClient.post<LabOrder>(`/lab-orders/${orderId}/results`, results).then((r) => r.data),

  cancel: (orderId: string) =>
    apiClient.delete(`/lab-orders/${orderId}`),
};
