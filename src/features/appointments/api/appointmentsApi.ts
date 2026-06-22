import apiClient from "@/lib/api/apiClient";

export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "checked_in"
  | "in_consultation"
  | "completed"
  | "cancelled"
  | "no_show";

export type AppointmentType = "walk_in" | "scheduled" | "follow_up" | "emergency" | "telemedicine";

export interface Appointment {
  id: string;
  clinic_id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string | null;
  appointment_type: AppointmentType;
  status: AppointmentStatus;
  token_number: number | null;
  chief_complaint: string | null;
  notes: string | null;
  created_at: string;
}

export interface AppointmentCreate {
  clinic_id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  start_time: string;
  appointment_type?: AppointmentType;
  chief_complaint?: string;
  notes?: string;
}

export interface PaginatedAppointments {
  items: Appointment[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface AppointmentReschedule {
  appointment_date: string;
  start_time: string;
  appointment_type?: AppointmentType;
}

export const appointmentsApi = {
  list: (params?: {
    page?: number;
    page_size?: number;
    clinic_id?: string;
    doctor_id?: string;
    patient_id?: string;
    appointment_date?: string;
    status?: AppointmentStatus;
  }) => apiClient.get<PaginatedAppointments>("/appointments", { params }).then((r) => r.data),

  get: (id: string) =>
    apiClient.get<Appointment>(`/appointments/${id}`).then((r) => r.data),

  create: (data: AppointmentCreate) =>
    apiClient.post<Appointment>("/appointments", data).then((r) => r.data),

  reschedule: (id: string, data: AppointmentReschedule) =>
    apiClient.patch<Appointment>(`/appointments/${id}`, data).then((r) => r.data),

  updateStatus: (id: string, status: AppointmentStatus) =>
    apiClient.patch<Appointment>(`/appointments/${id}/status`, { status }).then((r) => r.data),
};
