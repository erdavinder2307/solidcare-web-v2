import {
  Alert,
  Box,
  Button,
  Chip,
  Skeleton,
  Snackbar,
  TextField,
  Typography
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { appointmentsApi } from "@/features/appointments/api/appointmentsApi";
import { encountersApi, EncounterUpdate } from "../api/encountersApi";
import { patientsApi } from "@/features/patients/api/patientsApi";
import { SplitWorkspace } from "../components/SplitWorkspace";
import { PatientChartPanel } from "../components/PatientChartPanel";
import { PageHeader, PageLayout } from "@/shared/layout";
import { FormSection, Surface } from "@/shared/ui";
import { DiagnosisSearch, SelectedDiagnosis } from "../components/DiagnosisSearch";
import { LabOrderPanel } from "../components/LabOrderPanel";

interface ConsultationForm {
  chief_complaint: string;
  history_of_present_illness: string;
  general_examination: string;
  systemic_examination: string;
  clinical_impression: string;
  treatment_plan: string;
  follow_up_instructions: string;
  follow_up_days: string;
  systolic_bp: string;
  diastolic_bp: string;
  pulse_rate: string;
  temperature: string;
}

export default function ConsultationPage() {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Auto-save state
  const DRAFT_KEY = `consultation-draft-${appointmentId}`;
  const draftEncounterIdRef = useRef<string | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [autoSaveError, setAutoSaveError] = useState(false);
  const [diagnoses, setDiagnoses] = useState<SelectedDiagnosis[]>([]);
  const [activeEncounterId, setActiveEncounterId] = useState<string | null>(null);
  const [followUpToast, setFollowUpToast] = useState<string | null>(null);

  const { data: appointment, isLoading } = useQuery({
    queryKey: ["appointment", appointmentId],
    queryFn: () => appointmentsApi.get(appointmentId!),
    enabled: !!appointmentId,
  });

  const { data: patient } = useQuery({
    queryKey: ["patient", appointment?.patient_id],
    queryFn: () => patientsApi.get(appointment!.patient_id),
    enabled: !!appointment?.patient_id,
  });

  // Load existing encounter (e.g. created by nurse for vitals pre-entry)
  const { data: existingEncounter } = useQuery({
    queryKey: ["encounter-for-appt", appointmentId],
    queryFn: () => encountersApi.getForAppointment(appointmentId!),
    enabled: !!appointmentId,
  });

  // If there's an existing encounter, set the draftEncounterIdRef on first render
  useEffect(() => {
    if (existingEncounter?.id && !draftEncounterIdRef.current) {
      draftEncounterIdRef.current = existingEncounter.id;
      setActiveEncounterId(existingEncounter.id);
    }
  }, [existingEncounter]);

  // Restore from localStorage on mount
  const savedDraft = (() => {
    try { return JSON.parse(localStorage.getItem(DRAFT_KEY) ?? "null"); } catch { return null; }
  })();

  const { register, handleSubmit, getValues } = useForm<ConsultationForm>({
    values: savedDraft ?? {
      chief_complaint: appointment?.chief_complaint ?? "",
      history_of_present_illness: "",
      general_examination: "",
      systemic_examination: "",
      clinical_impression: "",
      treatment_plan: "",
      follow_up_instructions: "",
      follow_up_days: "",
      systolic_bp: "",
      diastolic_bp: "",
      pulse_rate: "",
      temperature: "",
    },
  });

  // Save current form values to localStorage (always) and PATCH to server (if encounter created)
  const persistDraft = useCallback(async () => {
    const values = getValues();
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(values)); } catch { /* ignore quota */ }

    if (!draftEncounterIdRef.current) return;
    try {
      const update: EncounterUpdate = {
        chief_complaint: values.chief_complaint || undefined,
        history_of_present_illness: values.history_of_present_illness || undefined,
        general_examination: values.general_examination || undefined,
        systemic_examination: values.systemic_examination || undefined,
        clinical_impression: values.clinical_impression || undefined,
        treatment_plan: values.treatment_plan || undefined,
        follow_up_instructions: values.follow_up_instructions || undefined,
        follow_up_days: values.follow_up_days ? Number(values.follow_up_days) : undefined,
      };
      await encountersApi.update(draftEncounterIdRef.current, update);
      setSavedAt(new Date());
      setAutoSaveError(false);
    } catch {
      setAutoSaveError(true);
    }
  }, [DRAFT_KEY, getValues]);

  // 30-second auto-save interval
  useEffect(() => {
    const interval = setInterval(persistDraft, 30_000);
    return () => clearInterval(interval);
  }, [persistDraft]);

  // Clear draft on unmount if consultation was completed
  const clearDraft = () => {
    try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
  };

  const mutation = useMutation({
    mutationFn: async (values: ConsultationForm) => {
      if (!appointment) throw new Error("No appointment");

      const vitals =
        values.systolic_bp || values.pulse_rate
          ? {
              systolic_bp: values.systolic_bp ? Number(values.systolic_bp) : undefined,
              diastolic_bp: values.diastolic_bp ? Number(values.diastolic_bp) : undefined,
              pulse_rate: values.pulse_rate ? Number(values.pulse_rate) : undefined,
              temperature: values.temperature ? Number(values.temperature) : undefined,
            }
          : undefined;

      let encounter;
      const followUpDays = values.follow_up_days ? Number(values.follow_up_days) : 0;

      if (draftEncounterIdRef.current) {
        // Update the already-created draft encounter
        await encountersApi.update(draftEncounterIdRef.current, {
          chief_complaint: values.chief_complaint || undefined,
          history_of_present_illness: values.history_of_present_illness || undefined,
          general_examination: values.general_examination || undefined,
          systemic_examination: values.systemic_examination || undefined,
          clinical_impression: values.clinical_impression || undefined,
          treatment_plan: values.treatment_plan || undefined,
          follow_up_instructions: values.follow_up_instructions || undefined,
          follow_up_days: followUpDays > 0 ? followUpDays : undefined,
        });
        encounter = await encountersApi.get(draftEncounterIdRef.current);
      } else {
        encounter = await encountersApi.create({
          clinic_id: appointment.clinic_id,
          patient_id: appointment.patient_id,
          doctor_id: appointment.doctor_id,
          appointment_id: appointment.id,
          encounter_type: "opd",
          chief_complaint: values.chief_complaint || undefined,
          history_of_present_illness: values.history_of_present_illness || undefined,
          general_examination: values.general_examination || undefined,
          systemic_examination: values.systemic_examination || undefined,
          clinical_impression: values.clinical_impression || undefined,
          treatment_plan: values.treatment_plan || undefined,
          follow_up_instructions: values.follow_up_instructions || undefined,
          follow_up_days: followUpDays > 0 ? followUpDays : undefined,
          vitals,
          diagnoses: diagnoses.length > 0 ? diagnoses : undefined,
        });
        draftEncounterIdRef.current = encounter.id;
        setActiveEncounterId(encounter.id);
      }

      await encountersApi.complete(encounter.id);
      await appointmentsApi.updateStatus(appointment.id, "completed");

      // Auto-create follow-up appointment
      if (followUpDays > 0) {
        const followUpDate = new Date();
        followUpDate.setDate(followUpDate.getDate() + followUpDays);
        try {
          await appointmentsApi.create({
            clinic_id: appointment.clinic_id,
            patient_id: appointment.patient_id,
            doctor_id: appointment.doctor_id,
            appointment_date: followUpDate.toISOString().slice(0, 10),
            start_time: appointment.start_time,
            appointment_type: "follow_up",
            chief_complaint: values.follow_up_instructions || "Follow-up visit",
          });
        } catch { /* follow-up creation is best-effort — don't block navigation */ }
      }

      return { encounter, followUpDays };
    },
    onSuccess: ({ encounter, followUpDays }) => {
      clearDraft();
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      if (followUpDays > 0) {
        setFollowUpToast(`Follow-up appointment created in ${followUpDays} days`);
        setTimeout(() => navigate(`/encounters/${encounter.id}`), 2000);
      } else {
        navigate(`/encounters/${encounter.id}`);
      }
    },
  });

  if (isLoading) {
    return (
      <PageLayout maxWidth="none">
        <Skeleton height={40} width={300} sx={{ mb: 2 }} />
        <Skeleton height={400} />
      </PageLayout>
    );
  }

  if (!appointment) {
    return (
      <PageLayout maxWidth="none">
        <Alert severity="error">Appointment not found</Alert>
      </PageLayout>
    );
  }

  if (appointment.status !== "in_consultation") {
    return (
      <PageLayout maxWidth="none">
        <Alert severity="warning">
          Appointment must be in consultation status. Current status: {appointment.status.replace(/_/g, " ")}.
          <Button size="small" sx={{ ml: 2 }} onClick={() => navigate("/clinical/workspace/waiting-room")}>
            Back to waiting room
          </Button>
        </Alert>
      </PageLayout>
    );
  }

  const notesForm = (
    <Surface sx={{ p: { xs: 2, md: 3 } }}>
      <form onSubmit={handleSubmit((values) => mutation.mutate(values))}>
        <FormSection title="Clinical notes" bare>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField fullWidth label="Chief complaint" multiline rows={2} {...register("chief_complaint")} />
            </Grid>
            <Grid size={12}>
              <TextField fullWidth label="History of present illness" multiline rows={3} {...register("history_of_present_illness")} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="General examination" multiline rows={3} {...register("general_examination")} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="Systemic examination" multiline rows={3} {...register("systemic_examination")} />
            </Grid>
            <Grid size={12}>
              <TextField fullWidth label="Clinical impression" multiline rows={2} {...register("clinical_impression")} />
            </Grid>
            <Grid size={12}>
              <DiagnosisSearch
                value={diagnoses}
                onChange={setDiagnoses}
                disabled={mutation.isPending}
              />
            </Grid>
            <Grid size={12}>
              <TextField fullWidth label="Treatment plan" multiline rows={2} {...register("treatment_plan")} />
            </Grid>
            <Grid size={12}>
              <TextField fullWidth label="Follow-up instructions" multiline rows={2} {...register("follow_up_instructions")} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Follow-up in (days)"
                type="number"
                inputProps={{ min: 0, step: 1 }}
                helperText="Leave 0 for no follow-up appointment"
                {...register("follow_up_days")}
              />
            </Grid>
          </Grid>
        </FormSection>

        {/* Lab orders — only available once an encounter has been created */}
        {activeEncounterId && appointment && (
          <Box mb={3}>
            <LabOrderPanel
              encounter={{
                id: activeEncounterId,
                patient_id: appointment.patient_id,
                doctor_id: appointment.doctor_id,
                clinic_id: appointment.clinic_id,
                appointment_id: appointment.id,
                encounter_type: "opd",
                status: "in_progress",
                encounter_date: new Date().toISOString(),
                created_at: new Date().toISOString(),
                chief_complaint: null,
                history_of_present_illness: null,
                general_examination: null,
                clinical_impression: null,
                treatment_plan: null,
                follow_up_instructions: null,
                completed_at: null,
                attested_by_id: null,
                attested_at: null,
              }}
            />
          </Box>
        )}

        <Typography variant="subtitle2" fontWeight={600} mb={2}>Vitals</Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, md: 3 }}>
            <TextField fullWidth label="Systolic BP" type="number" {...register("systolic_bp")} />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <TextField fullWidth label="Diastolic BP" type="number" {...register("diastolic_bp")} />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <TextField fullWidth label="Pulse" type="number" {...register("pulse_rate")} />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <TextField fullWidth label="Temp (°C)" type="number" {...register("temperature")} />
          </Grid>
        </Grid>

        {mutation.isError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {(mutation.error as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
              "Failed to save consultation"}
          </Alert>
        )}

        <Box display="flex" gap={2} mt={3} alignItems="center">
          <Button type="submit" variant="contained" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving…" : "Complete consultation"}
          </Button>
          <Button variant="outlined" onClick={() => navigate("/clinical/workspace/waiting-room")}>
            Cancel
          </Button>
          {savedAt && !autoSaveError && (
            <Chip
              size="small"
              label={`Draft saved ${savedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
              color="success"
              variant="outlined"
            />
          )}
          {autoSaveError && (
            <Chip size="small" label="Auto-save failed" color="warning" variant="outlined" />
          )}
        </Box>
      </form>
    </Surface>
  );

  return (
    <PageLayout maxWidth="none">
      <PageHeader
        title="Consultation"
        subtitle={
          patient
            ? `${patient.full_name} · Token ${appointment.token_number ?? "—"} · ${appointment.start_time}`
            : undefined
        }
        breadcrumbs={[
          { label: "Clinical", to: "/clinical/workspace" },
          { label: "Consultation" },
        ]}
      />

      {patient ? (
        <SplitWorkspace main={notesForm} aside={<PatientChartPanel patient={patient} appointment={appointment} />} />
      ) : (
        notesForm
      )}

      <Snackbar open={!!followUpToast} autoHideDuration={3000} onClose={() => setFollowUpToast(null)}>
        <Alert severity="success" onClose={() => setFollowUpToast(null)}>{followUpToast}</Alert>
      </Snackbar>
    </PageLayout>
  );
}
