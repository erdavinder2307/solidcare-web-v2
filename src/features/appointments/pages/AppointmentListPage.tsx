import { useState } from "react";
import { Button, IconButton, InputAdornment, TextField, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
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
import { AppointmentStatusBadge, DataTable, DataTablePagination, EmptyState, Surface } from "@/shared/ui";
import { RescheduleModal } from "../components/RescheduleModal";

const RESCHEDULABLE_STATUSES = new Set(["scheduled", "confirmed"]);

export default function AppointmentListPage() {
  const navigate = useNavigate();
  const can = useAuthStore((s) => s.can);
  const { patientNames } = usePatientNameMap();
  const { doctorNames } = useDoctorNameMap();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [search, setSearch] = useState("");
  const [rescheduleTarget, setRescheduleTarget] = useState<Appointment | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["appointments", { page: page + 1, page_size: rowsPerPage, search }],
    queryFn: () =>
      appointmentsApi.list({ page: page + 1, page_size: rowsPerPage, search: search || undefined }),
  });

  const appointments = data?.items ?? [];
  const total = data?.total ?? 0;

  const canUpdate = can("appointment:update");

  return (
    <PageLayout maxWidth="none">
      <PageHeader
        title="Schedule"
        subtitle={`${total.toLocaleString()} appointments`}
        breadcrumbs={[{ label: "Appointments" }, { label: "Schedule" }]}
        actions={
          can("appointment:create") ? (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate("/appointments/new")}>
              Book Appointment
            </Button>
          ) : undefined
        }
      />

      <Surface sx={{ p: 2, mb: 2 }}>
        <TextField
          placeholder="Search by patient, phone, UHID, token, or complaint…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          size="small"
          fullWidth
          sx={{ maxWidth: { xs: "100%", sm: 400 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Surface>

      <DataTable<Appointment>
        columns={[
          {
            id: "date",
            header: "Date",
            sortValue: (a) => a.appointment_date,
            render: (a) => formatDate(a.appointment_date),
          },
          {
            id: "time",
            header: "Time",
            sortValue: (a) => a.start_time ?? "",
            render: (a) => a.start_time ?? "—",
          },
          {
            id: "token",
            header: "Token",
            sortValue: (a) => a.token_number ?? 0,
            render: (a) => a.token_number ?? "—",
          },
          {
            id: "patient",
            header: "Patient",
            sortValue: (a) => resolvePatientName(patientNames, a.patient_id),
            render: (a) => resolvePatientName(patientNames, a.patient_id),
          },
          {
            id: "doctor",
            header: "Doctor",
            sortValue: (a) => doctorNames.get(a.doctor_id) ?? "",
            render: (a) => doctorNames.get(a.doctor_id) ?? "—",
          },
          {
            id: "type",
            header: "Type",
            sortValue: (a) => a.appointment_type,
            render: (a) => (
              <span style={{ textTransform: "capitalize" }}>
                {a.appointment_type.replace(/_/g, " ")}
              </span>
            ),
          },
          {
            id: "status",
            header: "Status",
            sortValue: (a) => a.status,
            render: (a) => <AppointmentStatusBadge status={a.status} />,
          },
          {
            id: "complaint",
            header: "Complaint",
            sortValue: (a) => a.chief_complaint ?? "",
            render: (a) => a.chief_complaint ?? "—",
          },
          ...(canUpdate
            ? [
                {
                  id: "actions",
                  header: "",
                  align: "right" as const,
                  render: (a: Appointment) =>
                    RESCHEDULABLE_STATUSES.has(a.status) ? (
                      <Tooltip title="Reschedule">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setRescheduleTarget(a);
                          }}
                          aria-label="Reschedule appointment"
                        >
                          <EditCalendarOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    ) : null,
                },
              ]
            : []),
        ]}
        rows={appointments}
        getRowId={(a) => a.id}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            icon={<EventOutlinedIcon sx={{ fontSize: 48 }} />}
            title={search ? "No matching appointments" : "No appointments scheduled"}
            description={
              search
                ? "Try a different search term or clear the filter."
                : "Book the first appointment to start managing your clinic schedule."
            }
            action={
              can("appointment:create") && !search ? (
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate("/appointments/new")}>
                  Book Appointment
                </Button>
              ) : undefined
            }
          />
        }
        footer={
          <DataTablePagination
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
        }
      />

      <RescheduleModal
        appointment={rescheduleTarget}
        open={!!rescheduleTarget}
        onClose={() => setRescheduleTarget(null)}
      />
    </PageLayout>
  );
}
