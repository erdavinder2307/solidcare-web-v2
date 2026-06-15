import { useClinicStore } from "@/app/store/clinicStore";

const FALLBACK_CLINIC_ID =
  import.meta.env.VITE_DEFAULT_CLINIC_ID ?? "00000000-0000-0000-0000-000000000010";

export function useActiveClinicId(): string {
  const activeClinicId = useClinicStore((s) => s.activeClinicId);
  return activeClinicId ?? FALLBACK_CLINIC_ID;
}
