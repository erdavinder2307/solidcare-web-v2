import apiClient from "@/lib/api/apiClient";

export interface Organization {
  id: string;
  name: string;
  slug: string;
}

export const organizationsApi = {
  current: () => apiClient.get<Organization>("/organizations/current").then((r) => r.data),
};
