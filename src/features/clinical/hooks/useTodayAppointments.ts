import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { appointmentsApi, type AppointmentStatus } from "@/features/appointments/api/appointmentsApi";
import { patientsApi } from "@/features/patients/api/patientsApi";
import { doctorsApi } from "@/features/doctors/api/doctorsApi";
import { useAuthStore } from "@/app/store/authStore";
import { useActiveClinicId } from "@/shared/hooks/useActiveClinic";

export const QUEUE_STATUSES: AppointmentStatus[] = [
  "scheduled",
  "confirmed",
  "checked_in",
  "in_consultation",
];

export function useTodayAppointments(options?: { doctorOnly?: boolean }) {
  const clinicId = useActiveClinicId();
  const userId = useAuthStore((s) => s.user?.userId);
  const today = new Date().toISOString().slice(0, 10);

  const { data: doctors } = useQuery({
    queryKey: ["doctors"],
    queryFn: () => doctorsApi.list(),
    enabled: options?.doctorOnly,
  });

  const myDoctorId = useMemo(() => {
    if (!options?.doctorOnly || !userId) return undefined;
    return doctors?.find((d) => d.user_id === userId)?.id;
  }, [doctors, userId, options?.doctorOnly]);

  const appointmentsQuery = useQuery({
    queryKey: ["appointments", "today", clinicId, today, myDoctorId],
    queryFn: () =>
      appointmentsApi.list({
        page: 1,
        page_size: 100,
        appointment_date: today,
        clinic_id: clinicId,
        doctor_id: myDoctorId,
      }),
    refetchInterval: 30_000,
  });

  const patientsQuery = useQuery({
    queryKey: ["patients", "queue-lookup"],
    queryFn: () => patientsApi.list({ page: 1, page_size: 100 }),
  });

  const patientNames = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of patientsQuery.data?.items ?? []) {
      map.set(p.id, p.full_name ?? `${p.first_name} ${p.last_name}`);
    }
    return map;
  }, [patientsQuery.data]);

  const appointments = appointmentsQuery.data?.items ?? [];

  const queue = appointments
    .filter((a) => QUEUE_STATUSES.includes(a.status))
    .sort((a, b) => (a.token_number ?? 999) - (b.token_number ?? 999));

  const inConsultation = appointments.find((a) => a.status === "in_consultation");
  const checkedInCount = appointments.filter((a) => a.status === "checked_in").length;
  const completedCount = appointments.filter((a) => a.status === "completed").length;
  const waitingCount = queue.filter((a) => ["scheduled", "confirmed", "checked_in"].includes(a.status)).length;

  return {
    today,
    appointments,
    queue,
    patientNames,
    inConsultation,
    checkedInCount,
    completedCount,
    waitingCount,
    myDoctorId,
    isLoading: appointmentsQuery.isLoading,
    isFetching: appointmentsQuery.isFetching,
    refetch: appointmentsQuery.refetch,
  };
}

export type QueueAction = {
  label: string;
  next: AppointmentStatus;
  variant?: "contained" | "outlined";
};

export function getQueueActions(status: AppointmentStatus): QueueAction[] {
  switch (status) {
    case "scheduled":
    case "confirmed":
      return [
        { label: "Check in", next: "checked_in", variant: "contained" },
        { label: "No show", next: "no_show", variant: "outlined" },
        { label: "Cancel", next: "cancelled", variant: "outlined" },
      ];
    case "checked_in":
      return [{ label: "Start consultation", next: "in_consultation", variant: "contained" }];
    default:
      return [];
  }
}
