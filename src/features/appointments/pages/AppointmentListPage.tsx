import { useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { appointmentsApi } from "../api/appointmentsApi";
import { useAuthStore } from "@/app/store/authStore";
import { usePatientNameMap, resolvePatientName } from "@/shared/hooks/usePatientNameMap";
import { useDoctorNameMap } from "@/shared/hooks/useDoctorNameMap";
import { formatDate } from "@/shared/utils/formatters";
import { PageHeader, PageLayout } from "@/shared/layout";
import { AppointmentStatusBadge, EmptyState, Surface } from "@/shared/ui";

export default function AppointmentListPage() {
  const navigate = useNavigate();
  const can = useAuthStore((s) => s.can);
  const { patientNames } = usePatientNameMap();
  const { doctorNames } = useDoctorNameMap();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

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
              </TableRow>
            ))}
            {!isLoading && appointments.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} sx={{ p: 0, border: 0 }}>
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
    </PageLayout>
  );
}
