import type { ContextNavItem } from "@/shared/layout/ContextNav";

export function getPatientContextNav(patientId: string, options?: { showBilling?: boolean }): ContextNavItem[] {
  const base = `/patients/${patientId}`;
  const items: ContextNavItem[] = [
    { label: "Overview", to: `${base}/overview`, end: true },
    { label: "Timeline", to: `${base}/timeline` },
    { label: "Appointments", to: `${base}/appointments` },
    { label: "Encounters", to: `${base}/encounters` },
    { label: "Prescriptions", to: `${base}/prescriptions` },
    { label: "Labs", to: `${base}/labs` },
  ];

  if (options?.showBilling) {
    items.push({ label: "Billing", to: `${base}/billing` });
  }

  items.push({ label: "Documents", to: `${base}/documents` });
  return items;
}
