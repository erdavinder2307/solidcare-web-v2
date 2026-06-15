import apiClient from "@/lib/api/apiClient";

export interface AuditLog {
  id: string;
  created_at: string;
  user_id: string | null;
  user_email: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  endpoint: string | null;
  http_method: string | null;
  success: boolean | null;
}

export const auditApi = {
  list: (params?: { page?: number; page_size?: number; resource_type?: string; action?: string }) =>
    apiClient.get("/audit", { params }).then((r) => r.data),
};
