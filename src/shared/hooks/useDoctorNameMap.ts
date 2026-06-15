import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { doctorsApi } from "@/features/doctors/api/doctorsApi";

/** Cached map of doctor id → display name for list pages. */
export function useDoctorNameMap() {
  const { data, isLoading } = useQuery({
    queryKey: ["doctors", "name-lookup"],
    queryFn: () => doctorsApi.list(),
    staleTime: 5 * 60_000,
  });

  const doctorNames = useMemo(() => {
    const names = new Map<string, string>();
    for (const d of data ?? []) {
      const name = `${d.first_name ?? ""} ${d.last_name ?? ""}`.trim();
      names.set(d.id, name || d.email || d.id);
    }
    return names;
  }, [data]);

  return { doctorNames, isLoadingDoctorNames: isLoading };
}
