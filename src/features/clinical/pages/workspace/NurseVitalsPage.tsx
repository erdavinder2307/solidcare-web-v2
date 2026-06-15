import React from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { appointmentsApi } from "@/features/appointments/api/appointmentsApi";
import { encountersApi } from "../../api/encountersApi";
import { PageHeader, PageLayout } from "@/shared/layout";
import { Surface } from "@/shared/ui";

interface VitalsForm {
  systolic_bp: string;
  diastolic_bp: string;
  pulse_rate: string;
  temperature: string;
  spo2: string;
  weight_kg: string;
  height_cm: string;
  respiratory_rate: string;
  blood_glucose: string;
  pain_scale: string;
  notes: string;
}

export default function NurseVitalsPage() {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();

  const { data: appointment, isLoading } = useQuery({
    queryKey: ["appointment", appointmentId],
    queryFn: () => appointmentsApi.get(appointmentId!),
    enabled: !!appointmentId,
  });

  // Look up existing encounter for this appointment
  const { data: existingEncounter, isLoading: loadingEncounter } = useQuery({
    queryKey: ["encounter-for-appt", appointmentId],
    queryFn: () => encountersApi.getForAppointment(appointmentId!),
    enabled: !!appointmentId,
  });

  const { register, handleSubmit } = useForm<VitalsForm>({
    defaultValues: {
      systolic_bp: "", diastolic_bp: "", pulse_rate: "", temperature: "",
      spo2: "", weight_kg: "", height_cm: "", respiratory_rate: "",
      blood_glucose: "", pain_scale: "", notes: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: VitalsForm) => {
      if (!appointment) throw new Error("No appointment");

      let encounterId = existingEncounter?.id ?? null;

      // Create a pre-encounter if one doesn't exist yet
      if (!encounterId) {
        const enc = await encountersApi.create({
          clinic_id: appointment.clinic_id,
          patient_id: appointment.patient_id,
          doctor_id: appointment.doctor_id,
          appointment_id: appointment.id,
          encounter_type: "opd",
        });
        encounterId = enc.id;
      }

      const vitals = {
        systolic_bp: values.systolic_bp ? Number(values.systolic_bp) : undefined,
        diastolic_bp: values.diastolic_bp ? Number(values.diastolic_bp) : undefined,
        pulse_rate: values.pulse_rate ? Number(values.pulse_rate) : undefined,
        temperature: values.temperature ? Number(values.temperature) : undefined,
        spo2: values.spo2 ? Number(values.spo2) : undefined,
        weight_kg: values.weight_kg ? Number(values.weight_kg) : undefined,
        height_cm: values.height_cm ? Number(values.height_cm) : undefined,
        respiratory_rate: values.respiratory_rate ? Number(values.respiratory_rate) : undefined,
        blood_glucose: values.blood_glucose ? Number(values.blood_glucose) : undefined,
        pain_scale: values.pain_scale ? Number(values.pain_scale) : undefined,
        notes: values.notes || undefined,
      };

      await encountersApi.addVitals(encounterId, vitals);
      return encounterId;
    },
    onSuccess: () => {
      navigate(-1);
    },
  });

  if (isLoading || loadingEncounter) {
    return (
      <PageLayout>
        <Skeleton height={40} width={300} sx={{ mb: 2 }} />
        <Skeleton height={300} />
      </PageLayout>
    );
  }

  if (!appointment) {
    return (
      <PageLayout>
        <Alert severity="error">Appointment not found.</Alert>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        title="Record Vitals"
        subtitle={`Appointment #${appointment.token_number ?? appointmentId}`}
        breadcrumbs={[
          { label: "Waiting Room", to: "/clinical/workspace/waiting-room" },
          { label: "Record Vitals" },
        ]}
      />

      <Surface sx={{ p: { xs: 2, md: 3 } }}>
        {existingEncounter && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Adding vitals to existing encounter.
          </Alert>
        )}

        <form onSubmit={handleSubmit((v) => mutation.mutate(v))}>
          <Typography variant="subtitle2" fontWeight={600} mb={2}>
            Haemodynamics
          </Typography>
          <Grid container spacing={2} mb={3}>
            <Grid size={{ xs: 6, md: 3 }}>
              <TextField fullWidth label="Systolic BP (mmHg)" type="number" {...register("systolic_bp")} />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <TextField fullWidth label="Diastolic BP (mmHg)" type="number" {...register("diastolic_bp")} />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <TextField fullWidth label="Pulse (bpm)" type="number" {...register("pulse_rate")} />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <TextField fullWidth label="SpO₂ (%)" type="number" inputProps={{ min: 0, max: 100 }} {...register("spo2")} />
            </Grid>
          </Grid>

          <Typography variant="subtitle2" fontWeight={600} mb={2}>
            Body measurements
          </Typography>
          <Grid container spacing={2} mb={3}>
            <Grid size={{ xs: 6, md: 3 }}>
              <TextField fullWidth label="Temperature (°C)" type="number" inputProps={{ step: 0.1 }} {...register("temperature")} />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <TextField fullWidth label="Weight (kg)" type="number" inputProps={{ step: 0.1 }} {...register("weight_kg")} />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <TextField fullWidth label="Height (cm)" type="number" {...register("height_cm")} />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <TextField fullWidth label="Respiratory rate (/min)" type="number" {...register("respiratory_rate")} />
            </Grid>
          </Grid>

          <Typography variant="subtitle2" fontWeight={600} mb={2}>
            Additional
          </Typography>
          <Grid container spacing={2} mb={3}>
            <Grid size={{ xs: 6, md: 3 }}>
              <TextField fullWidth label="Blood glucose (mg/dL)" type="number" {...register("blood_glucose")} />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <TextField fullWidth label="Pain scale (0–10)" type="number" inputProps={{ min: 0, max: 10 }} {...register("pain_scale")} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="Notes" {...register("notes")} />
            </Grid>
          </Grid>

          {mutation.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {(mutation.error as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
                "Failed to save vitals. Please try again."}
            </Alert>
          )}

          <Box display="flex" gap={2} alignItems="center">
            <Button type="submit" variant="contained" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving…" : "Save vitals"}
            </Button>
            <Button variant="outlined" onClick={() => navigate(-1)}>Cancel</Button>
            {mutation.isSuccess && <Chip label="Saved" color="success" size="small" />}
          </Box>
        </form>
      </Surface>
    </PageLayout>
  );
}
