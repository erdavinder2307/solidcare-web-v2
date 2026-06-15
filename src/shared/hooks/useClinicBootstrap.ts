import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { clinicsApi } from "@/features/clinics/api/clinicsApi";
import { useClinicStore } from "@/app/store/clinicStore";
import { useAuthStore } from "@/app/store/authStore";

const FALLBACK_CLINIC_ID =
  import.meta.env.VITE_DEFAULT_CLINIC_ID ?? "00000000-0000-0000-0000-000000000010";

/** Loads clinics for the authenticated user and ensures an active clinic is selected. */
export function useClinicBootstrap() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const { activeClinicId, setClinics, setActiveClinic } = useClinicStore();

  const query = useQuery({
    queryKey: ["clinics"],
    queryFn: () => clinicsApi.list(),
    enabled: isAuthenticated,
    staleTime: 5 * 60_000,
  });

  useEffect(() => {
    if (!query.data?.length) return;

    const allowedIds = user?.clinicIds?.length ? new Set(user.clinicIds) : null;
    const visible = allowedIds
      ? query.data.filter((c) => allowedIds.has(c.id))
      : query.data;

    const source = visible.length ? visible : query.data;
    setClinics(source.map((c) => ({ id: c.id, name: c.name, code: c.code, city: c.city })));

    const currentValid = source.some((c) => c.id === activeClinicId);
    if (!activeClinicId || !currentValid) {
      const preferred =
        source.find((c) => c.id === FALLBACK_CLINIC_ID) ?? source[0];
      setActiveClinic({
        id: preferred.id,
        name: preferred.name,
        code: preferred.code,
        city: preferred.city,
      });
    }
  }, [query.data, activeClinicId, setClinics, setActiveClinic, user?.clinicIds]);

  return query;
}
