import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useRef, useState } from "react";
import { patientsApi, PatientCreate } from "../api/patientsApi";
import { PageHeader, PageLayout } from "@/shared/layout";
import { FormSection } from "@/shared/ui";

const schema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  gender: z.string().optional(),
  date_of_birth: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  blood_group: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  address_line1: z.string().optional(),
  abha_number: z.string().optional(),
  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
  emergency_contact_relation: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const GENDERS = ["male", "female", "other", "prefer_not_to_say"];
const RELATIONS = ["Spouse", "Parent", "Child", "Sibling", "Friend", "Other"];

export default function PatientRegisterPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  // Duplicate check state
  const [dupCheckParams, setDupCheckParams] = useState<{
    phone?: string; first_name?: string; last_name?: string;
  } | null>(null);
  const [showDupDialog, setShowDupDialog] = useState(false);
  const pendingPayloadRef = useRef<PatientCreate | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: duplicates = [] } = useQuery({
    queryKey: ["patient-duplicates", dupCheckParams],
    queryFn: () => patientsApi.searchDuplicates(dupCheckParams!),
    enabled: !!dupCheckParams && (!!dupCheckParams.phone || !!(dupCheckParams.first_name && dupCheckParams.last_name)),
    staleTime: 10_000,
  });

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Trigger duplicate check 600ms after phone/name changes
  const triggerDupCheck = (values: Partial<FormData>) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const { phone, first_name, last_name } = values;
      if (phone && phone.length >= 10) {
        setDupCheckParams({ phone, first_name, last_name });
      } else if (first_name && last_name) {
        setDupCheckParams({ first_name, last_name });
      }
    }, 600);
  };

  const createMutation = useMutation({
    mutationFn: (data: PatientCreate) => patientsApi.create(data),
    onSuccess: (patient) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      enqueueSnackbar(`Patient ${patient.full_name} registered (UHID: ${patient.uhid})`, { variant: "success" });
      navigate(`/patients/${patient.id}`);
    },
    onError: (err: any) => {
      enqueueSnackbar(err?.response?.data?.detail || "Failed to register patient", { variant: "error" });
    },
  });

  const buildPayload = (data: FormData): PatientCreate => ({
    first_name: data.first_name,
    last_name: data.last_name,
    phone: data.phone,
    ...(data.email ? { email: data.email } : {}),
    ...(data.date_of_birth ? { date_of_birth: data.date_of_birth } : {}),
    ...(data.gender ? { gender: data.gender } : {}),
    ...(data.blood_group ? { blood_group: data.blood_group } : {}),
    ...(data.city ? { city: data.city } : {}),
    ...(data.state ? { state: data.state } : {}),
    ...(data.address_line1 ? { address_line1: data.address_line1 } : {}),
    ...(data.abha_number ? { abha_number: data.abha_number } : {}),
    ...(data.emergency_contact_name ? { emergency_contact_name: data.emergency_contact_name } : {}),
    ...(data.emergency_contact_phone ? { emergency_contact_phone: data.emergency_contact_phone } : {}),
    ...(data.emergency_contact_relation ? { emergency_contact_relation: data.emergency_contact_relation } : {}),
  });

  const onSubmit = (data: FormData) => {
    const payload = buildPayload(data);
    if (duplicates.length > 0) {
      pendingPayloadRef.current = payload;
      setShowDupDialog(true);
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <PageLayout maxWidth={960}>
      <PageHeader
        title="Register new patient"
        subtitle="Create a patient record with demographics and emergency contact"
        breadcrumbs={[
          { label: "Patients", to: "/patients" },
          { label: "Register" },
        ]}
      />

      {/* Duplicate warning dialog */}
      <Dialog open={showDupDialog} onClose={() => setShowDupDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Similar patients found</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            {duplicates.length} patient{duplicates.length > 1 ? "s" : ""} with matching details already exist.
            Please verify this is a new patient before proceeding.
          </Alert>
          {duplicates.map((p) => (
            <Box
              key={p.id}
              sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 1, borderBottom: "1px solid", borderColor: "divider" }}
            >
              <Box>
                <Typography variant="body2" fontWeight={600}>{p.full_name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {p.uhid} · {p.phone}{p.city ? ` · ${p.city}` : ""}
                </Typography>
              </Box>
              <Button size="small" onClick={() => navigate(`/patients/${p.id}`)}>
                View
              </Button>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDupDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              setShowDupDialog(false);
              if (pendingPayloadRef.current) createMutation.mutate(pendingPayloadRef.current);
            }}
          >
            Register as new patient anyway
          </Button>
        </DialogActions>
      </Dialog>

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <FormSection title="Personal information">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth label="First name *" {...register("first_name")}
                error={!!errors.first_name} helperText={errors.first_name?.message}
                onChange={(e) => { register("first_name").onChange(e); triggerDupCheck({ ...watch(), first_name: e.target.value }); }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth label="Last name *" {...register("last_name")}
                error={!!errors.last_name} helperText={errors.last_name?.message}
                onChange={(e) => { register("last_name").onChange(e); triggerDupCheck({ ...watch(), last_name: e.target.value }); }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth label="Phone *" {...register("phone")}
                error={!!errors.phone} helperText={errors.phone?.message}
                onChange={(e) => { register("phone").onChange(e); triggerDupCheck({ ...watch(), phone: e.target.value }); }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Email" {...register("email")} type="email" />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField fullWidth label="Date of birth" type="date" {...register("date_of_birth")} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <TextField fullWidth select label="Gender" {...field}>
                    {GENDERS.map((g) => <MenuItem key={g} value={g} sx={{ textTransform: "capitalize" }}>{g.replace("_", " ")}</MenuItem>)}
                  </TextField>
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name="blood_group"
                control={control}
                render={({ field }) => (
                  <TextField fullWidth select label="Blood group" {...field}>
                    {BLOOD_GROUPS.map((bg) => <MenuItem key={bg} value={bg}>{bg}</MenuItem>)}
                  </TextField>
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="ABHA number" {...register("abha_number")} helperText="Ayushman Bharat Health Account" />
            </Grid>
          </Grid>
        </FormSection>

        <FormSection title="Address">
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField fullWidth label="Address line 1" {...register("address_line1")} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="City" {...register("city")} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="State" {...register("state")} />
            </Grid>
          </Grid>
        </FormSection>

        <FormSection title="Emergency contact">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField fullWidth label="Contact name" {...register("emergency_contact_name")} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField fullWidth label="Contact phone" {...register("emergency_contact_phone")} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name="emergency_contact_relation"
                control={control}
                render={({ field }) => (
                  <TextField fullWidth select label="Relation" {...field}>
                    {RELATIONS.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                  </TextField>
                )}
              />
            </Grid>
          </Grid>
        </FormSection>

        {createMutation.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {(createMutation.error as any)?.response?.data?.detail || "Registration failed"}
          </Alert>
        )}

        <Box display="flex" gap={2}>
          <Button variant="outlined" onClick={() => navigate("/patients")} disabled={createMutation.isPending}>
            Cancel
          </Button>
          <Button variant="contained" type="submit" disabled={createMutation.isPending} startIcon={createMutation.isPending ? <CircularProgress size={16} color="inherit" /> : undefined}>
            {createMutation.isPending ? "Registering…" : "Register patient"}
          </Button>
        </Box>
      </Box>
    </PageLayout>
  );
}
