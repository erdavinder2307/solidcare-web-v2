import apiClient from "@/lib/api/apiClient";

export interface Notification {
  id: string;
  channel: string;
  notification_type: string;
  status: string;
  subject: string | null;
  body: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export const notificationsApi = {
  list: (params?: { page?: number; page_size?: number; is_read?: boolean }) =>
    apiClient.get("/notifications", { params }).then((r) => r.data),

  unreadCount: () =>
    apiClient.get<{ count: number }>("/notifications/unread-count").then((r) => r.data),

  markRead: (id: string) =>
    apiClient.patch(`/notifications/${id}/read`).then((r) => r.data),

  markAllRead: () =>
    apiClient.patch("/notifications/read-all").then((r) => r.data),
};
