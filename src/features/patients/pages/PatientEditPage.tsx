import React from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  Link,
  Paper,
  TextField,
  Typography
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { patientsApi, PatientCreate } from "../api/patientsApi";

export default function PatientEditPage() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const { data: patient } = useQuery({
    queryKey: ["patient", patientId],
    queryFn: () => patientsApi.get(patientId!),
    enabled: !!patientId,
  });

  const { register, handleSubmit } = useForm<Partial<PatientCreate>>({
    values: patient ? {
      first_name: patient.first_name,
      last_name: patient.last_name,
      phone: patient.phone,
      email: patient.email ?? "",
      gender: patient.gender ?? "",
      date_of_birth: patient.date_of_birth ?? "",
      blood_group: patient.blood_group ?? "",
      city: patient.city ?? "",
      state: patient.state ?? "",
      address_line1: patient.address_line1 ?? "",
    } : {},
  });

  const mutation = useMutation({
    mutationFn: (data: Partial<PatientCreate>) => patientsApi.update(patientId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient", patientId] });
      enqueueSnackbar("Patient updated", { variant: "success" });
      navigate(`/patients/${patientId}`);
    },
  });

  if (!patient) return null;

  return (
    <Box maxWidth={800}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link href="/patients" underline="hover" color="text.secondary">Patients</Link>
        <Link href={`/patients/${patientId}`} underline="hover" color="text.secondary">{patient.full_name}</Link>
        <Typography color="text.primary">Edit</Typography>
      </Breadcrumbs>

      <Paper component="form" elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider" }}
        onSubmit={handleSubmit((values) => {
          const payload = Object.fromEntries(
            Object.entries(values).filter(([, v]) => v !== "" && v != null),
          ) as Partial<PatientCreate>;
          mutation.mutate(payload);
        })}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="First name" {...register("first_name")} /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Last name" {...register("last_name")} /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Phone" {...register("phone")} /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Email" {...register("email")} /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Date of birth" type="date" InputLabelProps={{ shrink: true }} {...register("date_of_birth")} /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Blood group" {...register("blood_group")} /></Grid>
          <Grid size={12}><TextField fullWidth label="Address" {...register("address_line1")} /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="City" {...register("city")} /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="State" {...register("state")} /></Grid>
        </Grid>
        <Box display="flex" gap={2} mt={3}>
          <Button type="submit" variant="contained" disabled={mutation.isPending}>Save</Button>
          <Button variant="outlined" onClick={() => navigate(`/patients/${patientId}`)}>Cancel</Button>
        </Box>
      </Paper>
    </Box>
  );
}
