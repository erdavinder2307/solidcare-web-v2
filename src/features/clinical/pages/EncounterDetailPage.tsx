import React from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Link,
  Paper,
  Skeleton,
  Snackbar,
  Typography
} from "@mui/material";
import GppGoodIcon from "@mui/icons-material/GppGood";
import Grid from "@mui/material/Grid2";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { encountersApi } from "../api/encountersApi";
import { patientsApi } from "@/features/patients/api/patientsApi";
import { useAuthStore } from "@/app/store/authStore";

export default function EncounterDetailPage() {
  const { encounterId } = useParams<{ encounterId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const can = useAuthStore((s) => s.can);
  const [snackMsg, setSnackMsg] = React.useState<string | null>(null);

  const { data: encounter, isLoading } = useQuery({
    queryKey: ["encounter", encounterId],
    queryFn: () => encountersApi.get(encounterId!),
    enabled: !!encounterId,
  });

  const { data: patient } = useQuery({
    queryKey: ["patient", encounter?.patient_id],
    queryFn: () => patientsApi.get(encounter!.patient_id),
    enabled: !!encounter?.patient_id,
  });

  const attestMutation = useMutation({
    mutationFn: () => encountersApi.attest(encounterId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["encounter", encounterId] });
      setSnackMsg("Encounter attested and signed successfully.");
    },
    onError: () => setSnackMsg("Failed to attest encounter."),
  });

  if (isLoading) {
    return <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 2 }} />;
  }

  if (!encounter) {
    return <Typography color="error">Encounter not found</Typography>;
  }

  const fields = [
    { label: "Chief complaint", value: encounter.chief_complaint },
    { label: "History of present illness", value: encounter.history_of_present_illness },
    { label: "General examination", value: encounter.general_examination },
    { label: "Clinical impression", value: encounter.clinical_impression },
    { label: "Treatment plan", value: encounter.treatment_plan },
    { label: "Follow-up instructions", value: encounter.follow_up_instructions },
  ];

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link href="/encounters" underline="hover" color="text.secondary">Clinical</Link>
        <Typography color="text.primary">Encounter</Typography>
      </Breadcrumbs>

      <Paper elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider" }}>
        <Box display="flex" alignItems="center" gap={2} mb={3} flexWrap="wrap">
          <Typography variant="h5" fontWeight={700}>
            {patient?.full_name ?? "Patient encounter"}
          </Typography>
          <Chip label={encounter.status.replace("_", " ")} size="small" color={encounter.status === "completed" ? "success" : "info"} />
          <Chip label={encounter.encounter_type.toUpperCase()} size="small" variant="outlined" />
          {encounter.attested_at && (
            <Chip
              icon={<GppGoodIcon />}
              label={`Attested ${new Date(encounter.attested_at).toLocaleDateString()}`}
              size="small"
              color="success"
              variant="outlined"
            />
          )}
          {encounter.status === "completed" && !encounter.attested_at && can("encounter:update") && (
            <Button
              variant="outlined"
              color="success"
              size="small"
              startIcon={<GppGoodIcon />}
              loading={attestMutation.isPending}
              onClick={() => attestMutation.mutate()}
            >
              Attest &amp; Sign
            </Button>
          )}
        </Box>

        <Grid container spacing={2}>
          {fields.map(({ label, value }) => (
            <Grid size={{ xs: 12, md: 6 }} key={label}>
              <Typography variant="caption" color="text.secondary">{label}</Typography>
              <Typography variant="body2" whiteSpace="pre-wrap">{value ?? "—"}</Typography>
            </Grid>
          ))}
        </Grid>

        {encounter.vitals && encounter.vitals.length > 0 && (
          <Grid container spacing={2} mb={3}>
            <Grid size={12}>
              <Typography variant="subtitle2" fontWeight={600} mb={1}>Vitals</Typography>
            </Grid>
            {encounter.vitals.map((v, i) => (
              <React.Fragment key={i}>
                {v.systolic_bp != null && (
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="caption" color="text.secondary">BP</Typography>
                    <Typography>{v.systolic_bp}/{v.diastolic_bp ?? "—"} mmHg</Typography>
                  </Grid>
                )}
                {v.pulse_rate != null && (
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="caption" color="text.secondary">Pulse</Typography>
                    <Typography>{v.pulse_rate} bpm</Typography>
                  </Grid>
                )}
                {v.temperature != null && (
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="caption" color="text.secondary">Temperature</Typography>
                    <Typography>{v.temperature} °C</Typography>
                  </Grid>
                )}
              </React.Fragment>
            ))}
          </Grid>
        )}

        {encounter.diagnoses && encounter.diagnoses.length > 0 && (
          <Box mb={3}>
            <Typography variant="subtitle2" fontWeight={600} mb={1}>Diagnoses</Typography>
            {encounter.diagnoses.map((d, i) => (
              <Typography key={i} variant="body2">
                {d.custom_description ?? d.icd10_code ?? "Diagnosis"} ({d.diagnosis_type})
              </Typography>
            ))}
          </Box>
        )}

        <Box display="flex" gap={2} mt={3}>
          <Button variant="contained" onClick={() => navigate(`/prescriptions/new?encounter=${encounter.id}`)}>
            Create prescription
          </Button>
          <Button variant="outlined" onClick={() => navigate(`/billing/invoices/new?patient=${encounter.patient_id}&encounter=${encounter.id}`)}>
            Create invoice
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={!!snackMsg}
        autoHideDuration={4000}
        onClose={() => setSnackMsg(null)}
        message={snackMsg}
      />
    </Box>
  );
}
