import React from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  MenuItem,
  Paper,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { appointmentsApi } from "../api/appointmentsApi";
import { patientsApi, type PatientListItem } from "@/features/patients/api/patientsApi";
import { doctorsApi } from "@/features/doctors/api/doctorsApi";
import apiClient from "@/lib/api/apiClient";

const DEFAULT_CLINIC_ID =
  import.meta.env.VITE_DEFAULT_CLINIC_ID ?? "00000000-0000-0000-0000-000000000010";

const schema = z.object({
  patient_id: z.string().uuid("Select a patient"),
  doctor_id: z.string().uuid("Select a doctor"),
  appointment_date: z.string().min(1, "Date is required"),
  start_time: z.string().regex(/^\d{2}:\d{2}$/, "Use HH:MM format"),
  appointment_type: z.enum(["walk_in", "scheduled", "follow_up", "emergency", "telemedicine"]),
  chief_complaint: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function AppointmentBookPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const preselectedPatient = searchParams.get("patient") ?? "";

  const { data: patientsData } = useQuery({
    queryKey: ["patients", "all"],
    queryFn: () => patientsApi.list({ page: 1, page_size: 100 }),
  });

  const { data: doctors = [] } = useQuery({
    queryKey: ["doctors"],
    queryFn: () => apiClient.get("/doctors").then((r) => r.data),
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      patient_id: preselectedPatient,
      appointment_type: "scheduled",
      appointment_date: new Date().toISOString().slice(0, 10),
      start_time: "09:00",
    },
  });

  const watchedDoctorId = watch("doctor_id");
  const watchedDate = watch("appointment_date");
  const watchedStartTime = watch("start_time");

  // Fetch available slots when doctor + date are selected
  const { data: slotsData, isFetching: slotsFetching } = useQuery({
    queryKey: ["available-slots", watchedDoctorId, watchedDate],
    queryFn: () => doctorsApi.getAvailableSlots(watchedDoctorId, DEFAULT_CLINIC_ID, watchedDate),
    enabled: !!watchedDoctorId && !!watchedDate,
    staleTime: 60_000,
  });

  const availableSlots = slotsData?.slots ?? [];

  const mutation = useMutation({
    mutationFn: (values: FormData) =>
      appointmentsApi.create({
        clinic_id: DEFAULT_CLINIC_ID,
        ...values,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      navigate("/appointments");
    },
  });

  const patients: PatientListItem[] = patientsData?.items ?? [];

  return (
    <Box maxWidth={720}>
      <Typography variant="h5" fontWeight={700} mb={0.5}>Book Appointment</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Schedule a patient visit at the demo clinic
      </Typography>

      {mutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {(mutation.error as any)?.response?.data?.detail ?? "Failed to book appointment"}
        </Alert>
      )}

      <Paper elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider" }}>
        <form onSubmit={handleSubmit((values) => mutation.mutate(values))}>
          <TextField
            select
            fullWidth
            label="Patient"
            {...register("patient_id")}
            error={!!errors.patient_id}
            helperText={errors.patient_id?.message}
            sx={{ mb: 2 }}
          >
            {patients.map((p: PatientListItem) => (
              <MenuItem key={p.id} value={p.id}>
                {p.full_name} ({p.uhid})
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            label="Doctor"
            {...register("doctor_id")}
            error={!!errors.doctor_id}
            helperText={errors.doctor_id?.message}
            sx={{ mb: 2 }}
          >
            {(doctors as any[]).map((d) => (
              <MenuItem key={d.id} value={d.id}>
                {d.registration_number ?? d.id.slice(0, 8)} — {(d.specializations ?? []).join(", ") || "General"}
              </MenuItem>
            ))}
          </TextField>

          <Box display="flex" gap={2} mb={2}>
            <TextField
              fullWidth
              type="date"
              label="Date"
              InputLabelProps={{ shrink: true }}
              {...register("appointment_date")}
              error={!!errors.appointment_date}
              helperText={errors.appointment_date?.message}
            />
            <TextField
              fullWidth
              label="Start time"
              placeholder="09:00"
              {...register("start_time")}
              error={!!errors.start_time}
              helperText={errors.start_time?.message}
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          {/* Slot availability grid */}
          {watchedDoctorId && watchedDate && (
            <Box mb={2}>
              <Typography variant="subtitle2" fontWeight={600} mb={1}>
                Available slots
                {slotsFetching && (
                  <Typography component="span" variant="caption" color="text.secondary" ml={1}>loading…</Typography>
                )}
              </Typography>
              {slotsFetching ? (
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <Skeleton key={i} variant="rounded" width={72} height={32} />
                  ))}
                </Box>
              ) : availableSlots.length > 0 ? (
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {availableSlots.map((slot) => (
                    <Chip
                      key={slot}
                      label={slot}
                      size="small"
                      clickable
                      color={watchedStartTime === slot ? "primary" : "default"}
                      variant={watchedStartTime === slot ? "filled" : "outlined"}
                      onClick={() => setValue("start_time", slot, { shouldValidate: true })}
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No available slots for this date. You can still enter a time manually above.
                </Typography>
              )}
            </Box>
          )}

          <TextField
            select
            fullWidth
            label="Appointment type"
            {...register("appointment_type")}
            sx={{ mb: 2 }}
          >
            <MenuItem value="scheduled">Scheduled</MenuItem>
            <MenuItem value="walk_in">Walk-in</MenuItem>
            <MenuItem value="follow_up">Follow-up</MenuItem>
            <MenuItem value="emergency">Emergency</MenuItem>
            <MenuItem value="telemedicine">Telemedicine</MenuItem>
          </TextField>

          <TextField
            fullWidth
            label="Chief complaint"
            multiline
            rows={2}
            {...register("chief_complaint")}
            sx={{ mb: 2 }}
          />

          <TextField fullWidth label="Notes" multiline rows={2} {...register("notes")} sx={{ mb: 3 }} />

          <Box display="flex" gap={2}>
            <Button type="submit" variant="contained" disabled={mutation.isPending}>
              {mutation.isPending ? "Booking…" : "Book Appointment"}
            </Button>
            <Button variant="outlined" onClick={() => navigate("/appointments")}>
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
