import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { appointmentsApi } from "@/features/appointments/api/appointmentsApi";
import { encountersApi } from "@/features/clinical/api/encountersApi";
import { prescriptionsApi } from "@/features/prescriptions/api/prescriptionsApi";
import { billingApi } from "@/features/billing/api/billingApi";
import type { TimelineEvent } from "@/shared/ui/Timeline";
import type { StatusTone } from "@/shared/ui/StatusBadge";

const appointmentTone: Record<string, StatusTone> = {
  completed: "success",
  cancelled: "neutral",
  no_show: "error",
  in_consultation: "clinical",
  checked_in: "warning",
};

const encounterTone: Record<string, StatusTone> = {
  completed: "success",
  in_progress: "clinical",
  cancelled: "error",
};

const prescriptionTone: Record<string, StatusTone> = {
  finalized: "success",
  draft: "warning",
  cancelled: "error",
};

const invoiceTone: Record<string, StatusTone> = {
  paid: "success",
  partially_paid: "info",
  issued: "warning",
  cancelled: "error",
};

export function usePatientTimeline(patientId: string | undefined) {
  const results = useQueries({
    queries: [
      {
        queryKey: ["patient-timeline-appointments", patientId],
        queryFn: () => appointmentsApi.list({ patient_id: patientId, page_size: 50 }),
        enabled: !!patientId,
      },
      {
        queryKey: ["patient-timeline-encounters", patientId],
        queryFn: () => encountersApi.listForPatient(patientId!),
        enabled: !!patientId,
      },
      {
        queryKey: ["patient-timeline-prescriptions", patientId],
        queryFn: () => prescriptionsApi.list({ patient_id: patientId, page_size: 50 }),
        enabled: !!patientId,
      },
      {
        queryKey: ["patient-timeline-invoices", patientId],
        queryFn: () => billingApi.listInvoices({ patient_id: patientId, page_size: 50 }),
        enabled: !!patientId,
      },
    ],
  });

  const isLoading = results.some((r) => r.isLoading);

  const events = useMemo(() => {
    const [appointments, encounters, prescriptions, invoices] = results;
    const items: TimelineEvent[] = [];

    for (const appt of appointments.data?.items ?? []) {
      items.push({
        id: `appt-${appt.id}`,
        type: "Appointment",
        title: `Appointment · ${appt.appointment_date} ${appt.start_time}`,
        subtitle: appt.chief_complaint ?? undefined,
        timestamp: appt.created_at,
        statusLabel: appt.status.replace(/_/g, " "),
        tone: appointmentTone[appt.status] ?? "info",
      });
    }

    for (const enc of encounters.data?.items ?? []) {
      items.push({
        id: `enc-${enc.id}`,
        type: "Encounter",
        title: enc.chief_complaint ?? "Clinical encounter",
        subtitle: enc.clinical_impression ?? undefined,
        timestamp: enc.encounter_date || enc.created_at,
        link: `/encounters/${enc.id}`,
        statusLabel: enc.status.replace(/_/g, " "),
        tone: encounterTone[enc.status] ?? "clinical",
      });
    }

    for (const rx of prescriptions.data?.items ?? []) {
      items.push({
        id: `rx-${rx.id}`,
        type: "Prescription",
        title: rx.diagnosis_summary ?? "Prescription",
        subtitle: `${rx.items?.length ?? 0} medicine(s)`,
        timestamp: rx.created_at,
        link: `/prescriptions/${rx.id}`,
        statusLabel: rx.status,
        tone: prescriptionTone[rx.status] ?? "neutral",
      });
    }

    for (const inv of invoices.data?.items ?? []) {
      items.push({
        id: `inv-${inv.id}`,
        type: "Invoice",
        title: inv.invoice_number,
        subtitle: `₹${inv.total_amount.toLocaleString("en-IN")} · outstanding ₹${inv.outstanding_amount.toLocaleString("en-IN")}`,
        timestamp: inv.invoice_date,
        link: `/billing/invoices/${inv.id}`,
        statusLabel: inv.status.replace(/_/g, " "),
        tone: invoiceTone[inv.status] ?? "neutral",
      });
    }

    return items.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  }, [results]);

  return { events, isLoading };
}
