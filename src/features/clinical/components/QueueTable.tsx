import {
  Button,
  Stack,
  Typography,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useNavigate } from "react-router-dom";
import type { Appointment, AppointmentStatus } from "@/features/appointments/api/appointmentsApi";
import { AppointmentStatusBadge, DataTable, EmptyState } from "@/shared/ui";
import { getQueueActions } from "../hooks/useTodayAppointments";

export interface QueueTableProps {
  queue: Appointment[];
  patientNames: Map<string, string>;
  isLoading?: boolean;
  canUpdate: boolean;
  canRecordVitals?: boolean;
  isUpdating?: boolean;
  onStatusChange?: (appointment: Appointment, status: AppointmentStatus) => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function QueueTable({
  queue,
  patientNames,
  isLoading,
  canUpdate,
  canRecordVitals = false,
  isUpdating,
  onStatusChange,
  emptyTitle = "No patients in queue",
  emptyDescription = "Checked-in and scheduled patients for today will appear here.",
}: QueueTableProps) {
  const navigate = useNavigate();

  return (
    <DataTable<Appointment>
      columns={[
        {
          id: "token",
          header: "Token",
          width: 72,
          render: (r) => (
            <Typography fontWeight={700} fontFamily="monospace">
              {r.token_number ?? "—"}
            </Typography>
          ),
        },
        {
          id: "patient",
          header: "Patient",
          render: (r) => patientNames.get(r.patient_id) ?? `${r.patient_id.slice(0, 8)}…`,
        },
        { id: "time", header: "Time", render: (r) => r.start_time },
        { id: "complaint", header: "Complaint", render: (r) => r.chief_complaint ?? "—" },
        { id: "status", header: "Status", render: (r) => <AppointmentStatusBadge status={r.status} /> },
        {
          id: "actions",
          header: "",
          align: "right",
          render: (r) => (
            <Stack direction="row" spacing={0.75} justifyContent="flex-end" flexWrap="wrap">
              {getQueueActions(r.status).map((action) => (
                <Button
                  key={action.next}
                  size="small"
                  variant={action.variant ?? "outlined"}
                  disabled={!canUpdate || isUpdating}
                  startIcon={
                    action.next === "checked_in" ? (
                      <LoginIcon fontSize="small" />
                    ) : action.next === "in_consultation" ? (
                      <PlayArrowIcon fontSize="small" />
                    ) : undefined
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange?.(r, action.next);
                  }}
                >
                  {action.label}
                </Button>
              ))}
              {r.status === "in_consultation" && (
                <Button size="small" variant="contained" onClick={() => navigate(`/consultation/${r.id}`)}>
                  Continue
                </Button>
              )}
              {canRecordVitals && r.status === "checked_in" && (
                <Button
                  size="small"
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate(`/clinical/vitals/${r.id}`)}
                >
                  Vitals
                </Button>
              )}
            </Stack>
          ),
        },
      ]}
      rows={queue}
      getRowId={(r) => r.id}
      isLoading={isLoading}
      emptyState={<EmptyState title={emptyTitle} description={emptyDescription} />}
    />
  );
}
