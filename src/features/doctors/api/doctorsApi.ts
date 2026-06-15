import apiClient from "@/lib/api/apiClient";

export type DoctorStatus = "active" | "inactive" | "on_leave";

export interface Doctor {
  id: string;
  organization_id: string;
  user_id: string;
  registration_number: string | null;
  qualifications: string[] | null;
  specializations: string[] | null;
  years_of_experience: number | null;
  consultation_fee: number | null;
  follow_up_fee: number | null;
  bio: string | null;
  status: DoctorStatus;
  languages: string[] | null;
  created_at: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
}

export interface DoctorRegister {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  clinic_id: string;
  registration_number?: string;
  registration_council?: string;
  specializations?: string[];
  years_of_experience?: number;
  consultation_fee?: number;
  follow_up_fee?: number;
  bio?: string;
}

export const doctorsApi = {
  list: () => apiClient.get<Doctor[]>("/doctors").then((r) => r.data),

  get: (id: string) => apiClient.get<Doctor>(`/doctors/${id}`).then((r) => r.data),

  register: (data: DoctorRegister) =>
    apiClient.post<Doctor>("/doctors/register", data).then((r) => r.data),

  getAvailableSlots: (doctorId: string, clinicId: string, date: string) =>
    apiClient.get<{ slots: string[] }>(`/doctors/${doctorId}/available-slots`, { params: { clinic_id: clinicId, target_date: date } }).then((r) => r.data),

  getSchedules: (doctorId: string) =>
    apiClient.get(`/doctors/${doctorId}/schedules`).then((r) => r.data),
};
