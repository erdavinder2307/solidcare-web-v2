import { useState } from "react";
import {
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import EditCalendarOutlinedIcon from "@mui/icons-material/EditCalendarOutlined";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { appointmentsApi, type Appointment } from "../api/appointmentsApi";
import { useAuthStore } from "@/app/store/authStore";
import { usePatientNameMap, resolvePatientName } from "@/shared/hooks/usePatientNameMap";
import { useDoctorNameMap } from "@/shared/hooks/useDoctorNameMap";
import { formatDate } from "@/shared/utils/formatters";
import { PageHeader, PageLayout } from "@/shared/layout";
import { AppointmentStatusBadge, EmptyState, Surface } from "@/shared/ui";
import { RescheduleModal } from "../components/RescheduleModal";

const RESCHEDULABLE_STATUSES = new Set(["scheduled", "confirmed"]);

export default function AppointmentListPage() {
  const navigate = useNavigate();
  const can = useAuthStore((s) => s.can);
  const { patientNames } = usePatientNameMap();
  const { doctorNames } = useDoctorNameMap();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [rescheduleTarget, setRescheduleTarget] = useState<Appointment | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["appointments", { page: page + 1, page_size: rowsPerPage }],
    queryFn: () => appointmentsApi.list({ page: page + 1, page_size: rowsPerPage }),
  });

  const appointments = data?.items ?? [];
  const total = data?.total ?? 0;

  return (
    <PageLayout maxWidth="none">
      <PageHeader
        title="Schedule"
        subtitle={`${total.toLocaleString()} appointments`}
        breadcrumbs={[
          { label: "Appointments" },
          { label: "Schedule" },
        ]}
        actions={
          can("appointment:create") ? (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate("/appointments/new")}>
              Book Appointment
            </Button>
          ) : undefined
        }
      />

      <TableContainer component={Surface} sx={{ overflowX: "auto" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Token</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Complaint</TableCell>
              {can("appointment:update") && <TableCell align="right">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appt) => (
              <TableRow key={appt.id} hover>
                <TableCell>{formatDate(appt.appointment_date)}</TableCell>
                <TableCell>{appt.start_time}</TableCell>
                <TableCell>{appt.token_number ?? "—"}</TableCell>
                <TableCell>{resolvePatientName(patientNames, appt.patient_id)}</TableCell>
                <TableCell>{doctorNames.get(appt.doctor_id) ?? "—"}</TableCell>
                <TableCell sx={{ textTransform: "capitalize" }}>
                  {appt.appointment_type.replace(/_/g, " ")}
                </TableCell>
                <TableCell>
                  <AppointmentStatusBadge status={appt.status} />
                </TableCell>
                <TableCell>{appt.chief_complaint ?? "—"}</TableCell>
                {can("appointment:update") && (
                  <TableCell align="right">
                    {RESCHEDULABLE_STATUSES.has(appt.status) && (
                      <Tooltip title="Reschedule">
                        <IconButton
                          size="small"
                          onClick={() => setRescheduleTarget(appt)}
                          aria-label="Reschedule appointment"
                        >
                          <EditCalendarOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
            {!isLoading && appointments.length === 0 && (
              <TableRow>
                <TableCell colSpan={can("appointment:update") ? 9 : 8} sx={{ p: 0, border: 0 }}>
                  <EmptyState
                    icon={<EventOutlinedIcon sx={{ fontSize: 48 }} />}
                    title="No appointments scheduled"
                    description="Book the first appointment to start managing your clinic schedule."
                    action={
                      can("appointment:create") ? (
                        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate("/appointments/new")}>
                          Book Appointment
                        </Button>
                      ) : undefined
                    }
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10, 20, 50]}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>

      <RescheduleModal
        appointment={rescheduleTarget}
        open={!!rescheduleTarget}
        onClose={() => setRescheduleTarget(null)}
      />
    </PageLayout>
  );
}
