import React from "react";
import {
  Box,
  Button,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
  Breadcrumbs,
  Link,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { patientsApi, PatientCreate } from "../api/patientsApi";

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

  const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

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

  const onSubmit = (data: FormData) => {
    const payload: PatientCreate = {
      ...data,
      email: data.email || undefined,
    };
    createMutation.mutate(payload);
  };

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link href="/patients" underline="hover" color="text.secondary">Patients</Link>
        <Typography color="text.primary">Register New Patient</Typography>
      </Breadcrumbs>

      <Typography variant="h5" fontWeight={700} mb={3}>Register New Patient</Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Personal Information */}
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={600} mb={2.5}>Personal Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="First Name *" {...register("first_name")} error={!!errors.first_name} helperText={errors.first_name?.message} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Last Name *" {...register("last_name")} error={!!errors.last_name} helperText={errors.last_name?.message} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Phone *" {...register("phone")} error={!!errors.phone} helperText={errors.phone?.message} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Email" {...register("email")} type="email" />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Date of Birth" type="date" {...register("date_of_birth")} InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item xs={12} sm={4}>
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
                <Grid item xs={12} sm={4}>
                  <Controller
                    name="blood_group"
                    control={control}
                    render={({ field }) => (
                      <TextField fullWidth select label="Blood Group" {...field}>
                        {BLOOD_GROUPS.map((bg) => <MenuItem key={bg} value={bg}>{bg}</MenuItem>)}
                      </TextField>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="ABHA Number" {...register("abha_number")} helperText="Ayushman Bharat Health Account" />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Address */}
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={600} mb={2.5}>Address</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField fullWidth label="Address Line 1" {...register("address_line1")} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="City" {...register("city")} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="State" {...register("state")} />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Emergency Contact */}
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={600} mb={2.5}>Emergency Contact</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Contact Name" {...register("emergency_contact_name")} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Contact Phone" {...register("emergency_contact_phone")} />
                </Grid>
                <Grid item xs={12} sm={4}>
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
            </Paper>
          </Grid>
        </Grid>

        {createMutation.isError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {(createMutation.error as any)?.response?.data?.detail || "Registration failed"}
          </Alert>
        )}

        <Box display="flex" gap={2} mt={3}>
          <Button variant="outlined" onClick={() => navigate("/patients")} disabled={createMutation.isPending}>
            Cancel
          </Button>
          <Button variant="contained" type="submit" disabled={createMutation.isPending} startIcon={createMutation.isPending ? <CircularProgress size={16} color="inherit" /> : undefined}>
            {createMutation.isPending ? "Registering..." : "Register Patient"}
          </Button>
        </Box>
      </form>
    </Box>
  );
}
