import React, { useState } from "react";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  MenuItem,
  Paper,
  TextField,
  Typography
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { prescriptionsApi, FrequencyCode, MealRelation } from "../api/prescriptionsApi";
import { medicinesApi, Medicine } from "../api/medicinesApi";
import { encountersApi } from "@/features/clinical/api/encountersApi";
import { patientsApi } from "@/features/patients/api/patientsApi";

/** Returns true if two strings share a significant common substring (case-insensitive). */
function hasAllergyMatch(medicineName: string, allergy: string): boolean {
  if (!medicineName.trim() || !allergy.trim()) return false;
  const med = medicineName.toLowerCase();
  const alg = allergy.toLowerCase();
  return med.includes(alg) || alg.includes(med);
}

const DEFAULT_CLINIC_ID =
  import.meta.env.VITE_DEFAULT_CLINIC_ID ?? "00000000-0000-0000-0000-000000000010";

const FREQUENCIES: FrequencyCode[] = ["OD", "BD", "TDS", "QID", "SOS", "HS", "STAT", "OW", "CUSTOM"];
const MEAL_OPTIONS: MealRelation[] = ["before_food", "after_food", "with_food", "empty_stomach", "any_time"];

interface ItemForm {
  medicine_name: string;
  dosage: string;
  frequency: FrequencyCode;
  duration_days: string;
  quantity: string;
  meal_relation: MealRelation;
  instructions: string;
}

interface PrescriptionForm {
  encounter_id: string;
  patient_id: string;
  doctor_id: string;
  clinic_id: string;
  diagnosis_summary: string;
  notes: string;
  items: ItemForm[];
}

export default function PrescriptionCreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const encounterId = searchParams.get("encounter") ?? "";

  const { data: encounter } = useQuery({
    queryKey: ["encounter", encounterId],
    queryFn: () => encountersApi.get(encounterId),
    enabled: !!encounterId,
  });

  const { data: patient } = useQuery({
    queryKey: ["patient", encounter?.patient_id],
    queryFn: () => patientsApi.get(encounter!.patient_id),
    enabled: !!encounter?.patient_id,
  });

  const { register, control, handleSubmit, formState: { errors } } = useForm<PrescriptionForm>({
    values: {
      encounter_id: encounter?.id ?? encounterId,
      patient_id: encounter?.patient_id ?? "",
      doctor_id: encounter?.doctor_id ?? "",
      clinic_id: encounter?.clinic_id ?? DEFAULT_CLINIC_ID,
      diagnosis_summary: encounter?.clinical_impression ?? "",
      notes: "",
      items: [{ medicine_name: "", dosage: "", frequency: "BD", duration_days: "5", quantity: "", meal_relation: "after_food", instructions: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  // Per-row medicine autocomplete state
  const [medSearchTerms, setMedSearchTerms] = useState<string[]>([""]);
  const [medSuggestions, setMedSuggestions] = useState<Medicine[][]>([[]]);
  const [scheduleWarnings, setScheduleWarnings] = useState<Record<number, string>>({});

  // Watch all medicine names for allergy cross-check
  const watchedItems = useWatch({ control, name: "items" });
  const allergyWarnings: string[] = [];
  const allergies = patient?.known_allergies ?? [];
  if (allergies.length > 0) {
    for (const item of (watchedItems ?? [])) {
      for (const allergy of allergies) {
        if (hasAllergyMatch(item?.medicine_name ?? "", allergy)) {
          allergyWarnings.push(`"${item.medicine_name}" may match known allergy: ${allergy}`);
        }
      }
    }
  }

  const handleMedSearch = async (idx: number, q: string) => {
    setMedSearchTerms((prev) => { const n = [...prev]; n[idx] = q; return n; });
    if (q.trim().length < 2) { setMedSuggestions((prev) => { const n = [...prev]; n[idx] = []; return n; }); return; }
    try {
      const results = await medicinesApi.search(q, 10);
      setMedSuggestions((prev) => { const n = [...prev]; n[idx] = results; return n; });
    } catch { /* ignore */ }
  };

  const handleMedSelect = (idx: number, med: Medicine | null, setValue: (v: string) => void) => {
    if (!med) return;
    setValue(med.generic_name);
    setMedSearchTerms((prev) => { const n = [...prev]; n[idx] = med.generic_name; return n; });
    if (med.is_scheduled && med.schedule_class) {
      setScheduleWarnings((prev) => ({
        ...prev,
        [idx]: `Schedule ${med.schedule_class} — controlled substance. Ensure valid prescription.`,
      }));
    } else {
      setScheduleWarnings((prev) => { const n = { ...prev }; delete n[idx]; return n; });
    }
  };

  const mutation = useMutation({
    mutationFn: (values: PrescriptionForm) =>
      prescriptionsApi.create({
        encounter_id: values.encounter_id,
        patient_id: values.patient_id,
        doctor_id: values.doctor_id,
        clinic_id: values.clinic_id,
        diagnosis_summary: values.diagnosis_summary || undefined,
        notes: values.notes || undefined,
        items: values.items.map((item) => ({
          medicine_name: item.medicine_name,
          dosage: item.dosage || undefined,
          frequency: item.frequency,
          duration_days: item.duration_days ? Number(item.duration_days) : undefined,
          quantity: item.quantity || undefined,
          meal_relation: item.meal_relation,
          instructions: item.instructions || undefined,
        })),
      }),
    onSuccess: (rx) => navigate(`/prescriptions/${rx.id}`),
  });

  return (
    <Box maxWidth={960}>
      <Typography variant="h5" fontWeight={700} mb={1}>New Prescription</Typography>
      {patient && (
        <Typography variant="body2" color="text.secondary" mb={3}>
          Patient: {patient.full_name}
        </Typography>
      )}

      {allergies.length > 0 && allergyWarnings.length === 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Known allergies: {allergies.join(", ")}
        </Alert>
      )}

      {allergyWarnings.length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <strong>⚠ Allergy alert!</strong>
          <ul style={{ margin: "4px 0 0", paddingLeft: 20 }}>
            {allergyWarnings.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </Alert>
      )}

      {!encounterId && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Select an encounter from the clinical record, or add ?encounter=&lt;id&gt; to the URL.
        </Alert>
      )}

      <Paper component="form" elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider" }}
        onSubmit={handleSubmit((values) => mutation.mutate(values))}>
        <Grid container spacing={2} mb={2}>
          <Grid size={12}>
            <TextField fullWidth label="Diagnosis summary" {...register("diagnosis_summary")} />
          </Grid>
          <Grid size={12}>
            <TextField fullWidth label="Notes" multiline rows={2} {...register("notes")} />
          </Grid>
        </Grid>

        <Typography variant="subtitle2" fontWeight={600} mb={1}>Medicines</Typography>
        {fields.map((field, index) => {
          const { onChange, ...medReg } = register(`items.${index}.medicine_name`, { required: true });
          return (
            <Grid container spacing={2} key={field.id} mb={2} alignItems="flex-start">
              <Grid size={{ xs: 12, md: 3 }}>
                <Autocomplete<Medicine, false, false, true>
                  freeSolo
                  options={medSuggestions[index] ?? []}
                  inputValue={medSearchTerms[index] ?? (watchedItems?.[index]?.medicine_name ?? "")}
                  onInputChange={(_, v) => {
                    handleMedSearch(index, v);
                    onChange({ target: { value: v, name: `items.${index}.medicine_name` } });
                  }}
                  onChange={(_, med) => {
                    if (med && typeof med !== "string") {
                      handleMedSelect(index, med, (v) => {
                        onChange({ target: { value: v, name: `items.${index}.medicine_name` } });
                      });
                    }
                  }}
                  getOptionLabel={(o) => typeof o === "string" ? o : `${o.generic_name}${o.brand_name ? ` (${o.brand_name})` : ""}`}
                  renderOption={(props, o) => (
                    <li {...props} key={o.id}>
                      <Box>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <Typography variant="body2">{o.generic_name}</Typography>
                          {o.is_scheduled && (
                            <Chip label={`Sch. ${o.schedule_class ?? "H"}`} size="small" color="warning" />
                          )}
                        </Box>
                        {o.brand_name && (
                          <Typography variant="caption" color="text.secondary">{o.brand_name} · {o.strength}</Typography>
                        )}
                      </Box>
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      {...medReg}
                      label="Medicine"
                      required
                      error={!!errors.items?.[index]?.medicine_name}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
                {scheduleWarnings[index] && (
                  <Alert severity="warning" sx={{ mt: 0.5, py: 0.25, fontSize: 12 }}>
                    {scheduleWarnings[index]}
                  </Alert>
                )}
              </Grid>
              <Grid size={{ xs: 6, md: 2 }}>
                <TextField fullWidth label="Dosage" {...register(`items.${index}.dosage`)} />
              </Grid>
              <Grid size={{ xs: 6, md: 2 }}>
                <TextField fullWidth select label="Frequency" {...register(`items.${index}.frequency`)}>
                  {FREQUENCIES.map((f) => <MenuItem key={f} value={f}>{f}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid size={{ xs: 4, md: 1 }}>
                <TextField fullWidth label="Days" {...register(`items.${index}.duration_days`)} />
              </Grid>
              <Grid size={{ xs: 8, md: 2 }}>
                <TextField fullWidth select label="Meal" {...register(`items.${index}.meal_relation`)}>
                  {MEAL_OPTIONS.map((m) => <MenuItem key={m} value={m}>{m.replace("_", " ")}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid size={{ xs: 11, md: 1 }}>
                <IconButton onClick={() => remove(index)} disabled={fields.length === 1} color="error">
                  <DeleteIcon />
                </IconButton>
              </Grid>
              <Grid size={12}>
                <TextField fullWidth label="Instructions" {...register(`items.${index}.instructions`)} />
              </Grid>
            </Grid>
          );
        })}

        <Button startIcon={<AddIcon />} onClick={() => {
          append({ medicine_name: "", dosage: "", frequency: "BD", duration_days: "5", quantity: "", meal_relation: "after_food", instructions: "" });
          setMedSearchTerms((prev) => [...prev, ""]);
          setMedSuggestions((prev) => [...prev, []]);
        }} sx={{ mb: 2 }}>
          Add medicine
        </Button>

        {mutation.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>Failed to create prescription. Check encounter and required fields.</Alert>
        )}

        <Box display="flex" gap={2}>
          <Button type="submit" variant="contained" disabled={mutation.isPending || !encounterId}>
            Save draft
          </Button>
          <Button variant="outlined" onClick={() => navigate("/prescriptions")}>Cancel</Button>
        </Box>
      </Paper>
    </Box>
  );
}
