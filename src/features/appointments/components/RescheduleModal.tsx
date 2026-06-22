import { useEffect, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    TextField,
    Typography,
} from "@mui/material";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { appointmentsApi, type Appointment, type AppointmentType } from "../api/appointmentsApi";
import { doctorsApi } from "@/features/doctors/api/doctorsApi";

interface RescheduleModalProps {
    appointment: Appointment | null;
    open: boolean;
    onClose: () => void;
}

const APPOINTMENT_TYPES: AppointmentType[] = [
    "walk_in",
    "scheduled",
    "follow_up",
    "emergency",
    "telemedicine",
];

export function RescheduleModal({ appointment, open, onClose }: RescheduleModalProps) {
    const queryClient = useQueryClient();

    const [newDate, setNewDate] = useState("");
    const [newTime, setNewTime] = useState("");
    const [newType, setNewType] = useState<AppointmentType>("scheduled");

    // Pre-fill from current appointment when dialog opens
    useEffect(() => {
        if (appointment && open) {
            setNewDate(appointment.appointment_date);
            setNewTime(appointment.start_time.slice(0, 5)); // HH:MM
            setNewType(appointment.appointment_type);
        }
    }, [appointment, open]);

    const { data: slotsData, isFetching: slotsFetching } = useQuery({
        queryKey: ["available-slots", appointment?.doctor_id, appointment?.clinic_id, newDate],
        queryFn: () =>
            doctorsApi.getAvailableSlots(appointment!.doctor_id, appointment!.clinic_id, newDate),
        enabled: !!appointment && !!newDate && open,
        staleTime: 60_000,
    });

    const availableSlots = slotsData?.slots ?? [];

    const mutation = useMutation({
        mutationFn: () =>
            appointmentsApi.reschedule(appointment!.id, {
                appointment_date: newDate,
                start_time: newTime,
                appointment_type: newType,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
            queryClient.invalidateQueries({ queryKey: ["calendar-appointments"] });
            onClose();
        },
    });

    const isUnchanged =
        appointment?.appointment_date === newDate &&
        appointment?.start_time.slice(0, 5) === newTime;

    const isSlotAvailable =
        newTime === appointment?.start_time.slice(0, 5) || // keeping same slot is always OK
        availableSlots.includes(newTime) ||
        availableSlots.includes(`${newTime}:00`);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Box display="flex" alignItems="center" gap={1}>
                    <EventOutlinedIcon color="primary" />
                    Reschedule Appointment
                </Box>
            </DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
                {appointment && (
                    <Typography variant="body2" color="text.secondary" mb={2}>
                        Current: <strong>{appointment.appointment_date}</strong> at{" "}
                        <strong>{appointment.start_time.slice(0, 5)}</strong>
                    </Typography>
                )}

                {mutation.isError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {(mutation.error as { response?: { data?: { detail?: string } } })
                            ?.response?.data?.detail ?? "Failed to reschedule appointment"}
                    </Alert>
                )}

                <Box display="flex" flexDirection="column" gap={2}>
                    <TextField
                        label="New date"
                        type="date"
                        fullWidth
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: new Date().toISOString().slice(0, 10) }}
                    />

                    <Box>
                        <TextField
                            label="New time"
                            type="time"
                            fullWidth
                            value={newTime}
                            onChange={(e) => setNewTime(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ step: 900 }}
                            helperText={
                                !isSlotAvailable && newDate && newTime
                                    ? "This slot may already be booked — check availability below"
                                    : undefined
                            }
                            error={!isSlotAvailable && !!newDate && !!newTime && availableSlots.length > 0}
                        />

                        {/* Available slot chips */}
                        {newDate && (
                            <Box mt={1} display="flex" flexWrap="wrap" gap={0.75}>
                                {slotsFetching ? (
                                    <CircularProgress size={16} />
                                ) : availableSlots.length === 0 ? (
                                    <Typography variant="caption" color="text.secondary">
                                        No slots available on this date
                                    </Typography>
                                ) : (
                                    availableSlots.slice(0, 20).map((slot) => (
                                        <Chip
                                            key={slot}
                                            label={slot.slice(0, 5)}
                                            size="small"
                                            variant={newTime === slot.slice(0, 5) ? "filled" : "outlined"}
                                            color={newTime === slot.slice(0, 5) ? "primary" : "default"}
                                            clickable
                                            onClick={() => setNewTime(slot.slice(0, 5))}
                                        />
                                    ))
                                )}
                            </Box>
                        )}
                    </Box>

                    <TextField
                        select
                        label="Appointment type"
                        fullWidth
                        value={newType}
                        onChange={(e) => setNewType(e.target.value as AppointmentType)}
                    >
                        {APPOINTMENT_TYPES.map((t) => (
                            <MenuItem key={t} value={t}>
                                {t.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    variant="contained"
                    disabled={mutation.isPending || isUnchanged || !newDate || !newTime}
                    onClick={() => mutation.mutate()}
                >
                    {mutation.isPending ? <CircularProgress size={16} /> : "Confirm reschedule"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
