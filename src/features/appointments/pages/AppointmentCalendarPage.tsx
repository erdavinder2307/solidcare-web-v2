import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import { appointmentsApi, type Appointment } from "../api/appointmentsApi";
import { doctorsApi } from "@/features/doctors/api/doctorsApi";
import { patientsApi, type PatientListItem } from "@/features/patients/api/patientsApi";
import { useActiveClinicId } from "@/shared/hooks/useActiveClinic";
import { PageHeader, PageLayout } from "@/shared/layout";

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfWeekMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isoDate(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function displayDate(date: Date): string {
  return date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

function appointmentTone(status: Appointment["status"]): "default" | "primary" | "success" | "warning" | "error" {
  if (status === "completed") return "success";
  if (status === "in_consultation" || status === "checked_in") return "warning";
  if (status === "cancelled" || status === "no_show") return "error";
  if (status === "confirmed") return "primary";
  return "default";
}

export default function AppointmentCalendarPage() {
  const clinicId = useActiveClinicId();
  const navigate = useNavigate();
  const [weekAnchor, setWeekAnchor] = useState<Date>(() => startOfWeekMonday(new Date()));
  const [doctorId, setDoctorId] = useState<string>("");

  const weekDates = useMemo(
    () => Array.from({ length: 7 }, (_, i) => new Date(weekAnchor.getTime() + i * DAY_MS)),
    [weekAnchor],
  );

  const { data: doctors = [] } = useQuery({
    queryKey: ["calendar-doctors"],
    queryFn: () => doctorsApi.list(),
    staleTime: 5 * 60_000,
  });

  const { data: patientPage } = useQuery({
    queryKey: ["calendar-patients"],
    queryFn: () => patientsApi.list({ page: 1, page_size: 100 }),
    staleTime: 5 * 60_000,
  });

  const patientMap = useMemo(() => {
    const map = new Map<string, PatientListItem>();
    const items = (patientPage?.items ?? []) as PatientListItem[];
    for (const p of items) map.set(p.id, p);
    return map;
  }, [patientPage?.items]);

  const calendarQueries = useQueries({
    queries: weekDates.map((date) => ({
      queryKey: ["calendar-appointments", clinicId, doctorId || "all", isoDate(date)],
      queryFn: () =>
        appointmentsApi.list({
          page: 1,
          page_size: 100,
          clinic_id: clinicId,
          appointment_date: isoDate(date),
          doctor_id: doctorId || undefined,
        }),
      staleTime: 30_000,
    })),
  });

  const isLoadingWeek = calendarQueries.some((q) => q.isLoading);
  const isFetchingWeek = calendarQueries.some((q) => q.isFetching);
  const firstError = calendarQueries.find((q) => q.isError)?.error as { message?: string } | undefined;

  const weekLabel = `${weekDates[0].toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  })} - ${weekDates[6].toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`;

  const doctorNameMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const d of doctors) {
      map.set(d.id, `${d.first_name ?? ""} ${d.last_name ?? ""}`.trim() || d.email || d.id.slice(0, 8));
    }
    return map;
  }, [doctors]);

  return (
    <PageLayout maxWidth="none">
      <PageHeader
        title="Appointment Calendar"
        subtitle={`Weekly scheduling view · ${weekLabel}`}
        breadcrumbs={[{ label: "Appointments" }, { label: "Calendar" }]}
        actions={
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackOutlinedIcon />}
              onClick={() => setWeekAnchor((prev) => new Date(prev.getTime() - 7 * DAY_MS))}
            >
              Prev week
            </Button>
            <Button variant="outlined" onClick={() => setWeekAnchor(startOfWeekMonday(new Date()))}>
              This week
            </Button>
            <Button
              variant="outlined"
              startIcon={<ArrowForwardOutlinedIcon />}
              onClick={() => setWeekAnchor((prev) => new Date(prev.getTime() + 7 * DAY_MS))}
            >
              Next week
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshOutlinedIcon />}
              disabled={isFetchingWeek}
              onClick={() => calendarQueries.forEach((q) => q.refetch())}
            >
              Refresh
            </Button>
          </Box>
        }
      />

      <Paper sx={{ p: 2, border: "1px solid", borderColor: "divider", mb: 2 }}>
        <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
          <TextField
            select
            size="small"
            label="Doctor"
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            sx={{ minWidth: 280 }}
          >
            <MenuItem value="">All doctors</MenuItem>
            {doctors.map((d) => (
              <MenuItem key={d.id} value={d.id}>
                {doctorNameMap.get(d.id)}
              </MenuItem>
            ))}
          </TextField>
          <Typography variant="body2" color="text.secondary">
            Showing {doctorId ? "selected doctor" : "all doctors"} at active clinic
          </Typography>
        </Box>
      </Paper>

      {firstError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load weekly appointments: {firstError.message ?? "unknown error"}
        </Alert>
      )}

      {isLoadingWeek ? (
        <Box py={8} display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={1.5}>
          {weekDates.map((date, idx) => {
            const dayAppts = (calendarQueries[idx].data?.items ?? []) as Appointment[];
            const sorted = [...dayAppts].sort((a, b) => `${a.start_time}`.localeCompare(`${b.start_time}`));

            return (
              <Grid key={isoDate(date)} size={{ xs: 12, md: 6, xl: 12 / 7 }}>
                <Paper
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    minHeight: 300,
                    overflow: "hidden",
                  }}
                >
                  <Box px={1.5} py={1.25} bgcolor="action.hover" display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle2" fontWeight={700}>
                      {displayDate(date)}
                    </Typography>
                    <Chip label={`${sorted.length}`} size="small" />
                  </Box>
                  <Divider />

                  <Box p={1} display="flex" flexDirection="column" gap={1}>
                    {sorted.length === 0 ? (
                      <Typography variant="body2" color="text.secondary" sx={{ px: 0.5, py: 2 }}>
                        No appointments
                      </Typography>
                    ) : (
                      sorted.map((appt) => {
                        const patient = patientMap.get(appt.patient_id);
                        return (
                          <Paper
                            key={appt.id}
                            variant="outlined"
                            sx={{
                              p: 1,
                              borderColor: "divider",
                              cursor: "pointer",
                              "&:hover": { borderColor: "primary.main" },
                            }}
                            onClick={() => navigate(`/appointments?selected=${appt.id}`)}
                          >
                            <Box display="flex" justifyContent="space-between" alignItems="center" gap={1}>
                              <Typography variant="body2" fontWeight={700}>
                                {appt.start_time}
                              </Typography>
                              <Chip size="small" color={appointmentTone(appt.status)} label={appt.status.replace("_", " ")} />
                            </Box>
                            <Typography variant="body2" sx={{ mt: 0.5 }} noWrap>
                              {patient?.full_name ?? "Patient"}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" noWrap>
                              Token {appt.token_number ?? "-"} · {doctorNameMap.get(appt.doctor_id) ?? "Doctor"}
                            </Typography>
                            {appt.chief_complaint && (
                              <Typography variant="caption" color="text.secondary" display="block" noWrap>
                                {appt.chief_complaint}
                              </Typography>
                            )}
                            <Box mt={0.75}>
                              <Button
                                size="small"
                                variant="text"
                                endIcon={<OpenInNewOutlinedIcon fontSize="small" />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/consultation/${appt.id}`);
                                }}
                              >
                                Open
                              </Button>
                            </Box>
                          </Paper>
                        );
                      })
                    )}
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}
    </PageLayout>
  );
}
