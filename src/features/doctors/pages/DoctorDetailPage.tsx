import React from "react";
import {
  Box,
  Breadcrumbs,
  Chip,
  Link,
  Paper,
  Skeleton,
  TextField,
  Typography
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useTheme } from "@mui/material/styles";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { doctorsApi } from "../api/doctorsApi";
import { reportsApi } from "@/features/reports/api/reportsApi";
import { Surface } from "@/shared/ui";
import { formatCurrency, formatDateTime } from "@/shared/utils/formatters";

export default function DoctorDetailPage() {
  const { doctorId } = useParams<{ doctorId: string }>();
  const theme = useTheme();

  const today = new Date().toISOString().slice(0, 10);
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10);
  const [fromDate, setFromDate] = React.useState(monthStart);
  const [toDate, setToDate] = React.useState(today);

  const { data: doctor, isLoading } = useQuery({
    queryKey: ["doctor", doctorId],
    queryFn: () => doctorsApi.get(doctorId!),
    enabled: !!doctorId,
  });

  const { data: summary } = useQuery({
    queryKey: ["doctor-summary", doctorId, fromDate, toDate],
    queryFn: () => reportsApi.doctorSummary(doctorId!, { from_date: fromDate, to_date: toDate }),
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

      {/* Performance dashboard */}
      <Box mt={3}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2} flexWrap="wrap" gap={2}>
          <Typography variant="h6" fontWeight={600}>Performance</Typography>
          <Box display="flex" gap={1.5}>
            <TextField
              label="From" type="date" size="small" value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="To" type="date" size="small" value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              inputProps={{ min: fromDate }}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>
        </Box>

        <Grid container spacing={2} mb={3}>
          {[
            { label: "Consultations", value: summary?.consultations ?? 0 },
            { label: "Appointments", value: summary?.appointments_total ?? 0, sub: `${summary?.appointments_completed ?? 0} completed` },
            { label: "Unique patients", value: summary?.unique_patients ?? 0 },
            { label: "Revenue generated", value: formatCurrency(summary?.revenue_generated ?? 0) },
          ].map((kpi) => (
            <Grid size={{ xs: 6, md: 3 }} key={kpi.label}>
              <Surface sx={{ p: 2.5, height: "100%" }}>
                <Typography variant="caption" color="text.secondary">{kpi.label}</Typography>
                <Typography variant="h5" fontWeight={700}>{kpi.value}</Typography>
                {kpi.sub && <Typography variant="caption" color="text.secondary">{kpi.sub}</Typography>}
              </Surface>
            </Grid>
          ))}
        </Grid>

        <Surface sx={{ p: 3 }}>
          <Typography variant="subtitle2" fontWeight={600} mb={2}>Consultations per day</Typography>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={summary?.daily_trend ?? []} margin={{ top: 4, right: 16, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="docConsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip formatter={(v: number) => [v, "Consultations"]} />
              <Area type="monotone" dataKey="consultations" stroke={theme.palette.primary.main} fill="url(#docConsGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Surface>
      </Box>
    </Box>
  );
}
