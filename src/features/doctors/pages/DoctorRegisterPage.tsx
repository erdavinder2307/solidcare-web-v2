import {
  Alert,
  Box,
  Button,
  TextField
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { doctorsApi, DoctorRegister } from "../api/doctorsApi";
import { PageHeader, PageLayout } from "@/shared/layout";
import { FormSection } from "@/shared/ui";

const DEFAULT_CLINIC_ID =
  import.meta.env.VITE_DEFAULT_CLINIC_ID ?? "00000000-0000-0000-0000-000000000010";

interface DoctorForm {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  registration_number: string;
  specializations: string;
  consultation_fee: string;
  follow_up_fee: string;
  bio: string;
}

export default function DoctorRegisterPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { register, handleSubmit, formState: { errors } } = useForm<DoctorForm>({
    defaultValues: {
      consultation_fee: "500",
      follow_up_fee: "300",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: DoctorRegister) => doctorsApi.register(data),
    onSuccess: (doctor) => {
      enqueueSnackbar(`Dr. ${doctor.first_name} ${doctor.last_name} registered`, { variant: "success" });
      navigate(`/doctors/${doctor.id}`);
    },
    onError: (err: any) => {
      const detail = err?.response?.data?.detail;
      const message =
        typeof detail === "string"
          ? detail
          : Array.isArray(detail)
            ? detail.map((d: { msg?: string }) => d.msg).join(", ")
            : "Failed to register doctor";
      enqueueSnackbar(message, { variant: "error" });
    },
  });

  const onSubmit = (values: DoctorForm) => {
    const specializations = values.specializations
      ? values.specializations.split(",").map((s) => s.trim()).filter(Boolean)
      : undefined;

    mutation.mutate({
      email: values.email,
      password: values.password,
      first_name: values.first_name,
      last_name: values.last_name,
      phone: values.phone || undefined,
      clinic_id: DEFAULT_CLINIC_ID,
      registration_number: values.registration_number || undefined,
      specializations,
      consultation_fee: values.consultation_fee ? Number(values.consultation_fee) : undefined,
      follow_up_fee: values.follow_up_fee ? Number(values.follow_up_fee) : undefined,
      bio: values.bio || undefined,
    });
  };

  return (
    <PageLayout maxWidth={800}>
      <PageHeader
        title="Register doctor"
        subtitle="Create a doctor account and professional profile"
        breadcrumbs={[
          { label: "Administration" },
          { label: "Doctors", to: "/doctors" },
          { label: "Register" },
        ]}
      />

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <FormSection title="Account" description="Login credentials for the doctor portal">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="First name" required
                {...register("first_name", { required: true })}
                error={!!errors.first_name}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="Last name" required
                {...register("last_name", { required: true })}
                error={!!errors.last_name}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="Email" type="email" required
                {...register("email", { required: true })}
                error={!!errors.email}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="Phone" {...register("phone")} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="Password" type="password" required
                helperText="Minimum 8 characters — doctor will use this to log in"
                {...register("password", { required: true, minLength: 8 })}
                error={!!errors.password}
              />
            </Grid>
          </Grid>
        </FormSection>

        <FormSection title="Professional details">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="Registration number" {...register("registration_number")} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="Specializations" placeholder="General Medicine, Cardiology"
                helperText="Comma-separated"
                {...register("specializations")}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="Consultation fee (₹)" type="number" {...register("consultation_fee")} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="Follow-up fee (₹)" type="number" {...register("follow_up_fee")} />
            </Grid>
            <Grid size={12}>
              <TextField fullWidth label="Bio" multiline rows={2} {...register("bio")} />
            </Grid>
          </Grid>
        </FormSection>

        {mutation.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>Could not register doctor. Check email is unique and password length.</Alert>
        )}

        <Box display="flex" gap={2}>
          <Button type="submit" variant="contained" disabled={mutation.isPending}>
            Register doctor
          </Button>
          <Button variant="outlined" onClick={() => navigate("/doctors")}>Cancel</Button>
        </Box>
      </Box>
    </PageLayout>
  );
}
