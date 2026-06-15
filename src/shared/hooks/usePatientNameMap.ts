import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { patientsApi } from "@/features/patients/api/patientsApi";

/** Cached map of patient id → display name for list pages. */
export function usePatientNameMap() {
  const { data, isLoading } = useQuery({
    queryKey: ["patients", "name-lookup"],
    queryFn: () => patientsApi.list({ page: 1, page_size: 100 }),
    staleTime: 5 * 60_000,
  });

  const map = useMemo(() => {
    const names = new Map<string, string>();
    for (const p of data?.items ?? []) {
      names.set(p.id, p.full_name ?? `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim());
    }
    return names;
  }, [data]);

  return { patientNames: map, isLoadingNames: isLoading };
}

export function resolvePatientName(map: Map<string, string>, patientId: string) {
  return map.get(patientId) ?? `${patientId.slice(0, 8)}…`;
}
