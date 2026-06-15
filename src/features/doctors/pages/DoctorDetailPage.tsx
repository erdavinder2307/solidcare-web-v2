import React from "react";
import {
  Box,
  Breadcrumbs,
  Chip,
  Link,
  Paper,
  Skeleton,
  Typography
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { doctorsApi } from "../api/doctorsApi";
import { formatCurrency, formatDateTime } from "@/shared/utils/formatters";

export default function DoctorDetailPage() {
  const { doctorId } = useParams<{ doctorId: string }>();

  const { data: doctor, isLoading } = useQuery({
    queryKey: ["doctor", doctorId],
    queryFn: () => doctorsApi.get(doctorId!),
    enabled: !!doctorId,
  });

  if (isLoading) return <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 2 }} />;
  if (!doctor) return <Typography color="error">Doctor not found</Typography>;

  const name = doctor.first_name && doctor.last_name
    ? `Dr. ${doctor.first_name} ${doctor.last_name}`
    : "Doctor";

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link href="/doctors" underline="hover" color="text.secondary">Doctors</Link>
        <Typography color="text.primary">{name}</Typography>
      </Breadcrumbs>

      <Paper elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider" }}>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Typography variant="h5" fontWeight={700}>{name}</Typography>
          <Chip label={doctor.status} size="small" color={doctor.status === "active" ? "success" : "default"} />
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="caption" color="text.secondary">Email</Typography>
            <Typography>{doctor.email ?? "—"}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="caption" color="text.secondary">Registration #</Typography>
            <Typography>{doctor.registration_number ?? "—"}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="caption" color="text.secondary">Consultation fee</Typography>
            <Typography>{doctor.consultation_fee ? formatCurrency(doctor.consultation_fee) : "—"}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="caption" color="text.secondary">Follow-up fee</Typography>
            <Typography>{doctor.follow_up_fee ? formatCurrency(doctor.follow_up_fee) : "—"}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="caption" color="text.secondary">Experience</Typography>
            <Typography>{doctor.years_of_experience != null ? `${doctor.years_of_experience} years` : "—"}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="caption" color="text.secondary">Registered</Typography>
            <Typography>{formatDateTime(doctor.created_at)}</Typography>
          </Grid>
          <Grid size={12}>
            <Typography variant="caption" color="text.secondary">Specializations</Typography>
            <Box mt={0.5}>
              {(doctor.specializations || []).map((s) => (
                <Chip key={s} label={s} size="small" sx={{ mr: 0.5 }} />
              ))}
              {!doctor.specializations?.length && "—"}
            </Box>
          </Grid>
          {doctor.bio && (
            <Grid size={12}>
              <Typography variant="caption" color="text.secondary">Bio</Typography>
              <Typography whiteSpace="pre-wrap">{doctor.bio}</Typography>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Box>
  );
}
