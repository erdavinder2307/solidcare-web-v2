import { Box, Chip, Skeleton, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { encountersApi } from "../api/encountersApi";

interface PreviousDiagnosesProps {
  patientId: string;
  /** How many recent encounters to scan for diagnoses */
  limit?: number;
}

export function PreviousDiagnoses({ patientId, limit = 5 }: PreviousDiagnosesProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["patient-encounters-dx", patientId],
    queryFn: () => encountersApi.listForPatient(patientId, { page: 1, page_size: limit }),
    staleTime: 120_000,
  });

  const encounters = (data?.items ?? []) as Array<{
    diagnoses?: Array<{ id: string; icd10_code?: string; icd10_description?: string; custom_description?: string; diagnosis_type: string }>;
    encounter_date: string;
  }>;

  // Collect unique diagnoses (by code or description), most recent first
  const seen = new Set<string>();
  const diagnoses: Array<{ key: string; label: string; type: string; date: string }> = [];
  for (const enc of encounters) {
    for (const dx of enc.diagnoses ?? []) {
      const key = dx.icd10_code ?? dx.custom_description ?? "";
      if (!key || seen.has(key)) continue;
      seen.add(key);
      diagnoses.push({
        key,
        label: dx.icd10_code
          ? `${dx.icd10_code} — ${dx.icd10_description ?? dx.custom_description ?? ""}`
          : (dx.custom_description ?? ""),
        type: dx.diagnosis_type,
        date: enc.encounter_date,
      });
    }
  }

  if (isLoading) {
    return (
      <Box>
        <Skeleton height={16} width="60%" />
        <Skeleton height={24} width="80%" sx={{ mt: 0.5 }} />
      </Box>
    );
  }

  if (diagnoses.length === 0) return null;

  return (
    <Box>
      <Typography variant="caption" color="text.secondary" textTransform="uppercase" letterSpacing={0.5}>
        Previous diagnoses
      </Typography>
      <Box mt={0.75} display="flex" flexWrap="wrap" gap={0.75}>
        {diagnoses.slice(0, 8).map((dx) => (
          <Chip
            key={dx.key}
            label={dx.label.length > 40 ? dx.label.slice(0, 40) + "…" : dx.label}
            size="small"
            variant="outlined"
            color={dx.type === "primary" ? "primary" : "default"}
            title={`${dx.label} · ${new Date(dx.date).toLocaleDateString()}`}
          />
        ))}
      </Box>
    </Box>
  );
}
