import apiClient from "@/lib/api/apiClient";

export interface UserListItem {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  status: string;
  roles: string[];
  created_at: string;
}

export const usersApi = {
  list: () => apiClient.get<UserListItem[]>("/users").then((r) => r.data),
};
