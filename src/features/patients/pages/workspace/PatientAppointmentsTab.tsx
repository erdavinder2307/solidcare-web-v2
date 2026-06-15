import { Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { appointmentsApi, type Appointment } from "@/features/appointments/api/appointmentsApi";
import { useAuthStore } from "@/app/store/authStore";
import { AppointmentStatusBadge, DataTable, EmptyState } from "@/shared/ui";

export default function PatientAppointmentsTab() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const can = useAuthStore((s) => s.can);

  const { data, isLoading } = useQuery({
    queryKey: ["patient-appointments", patientId],
    queryFn: () => appointmentsApi.list({ patient_id: patientId, page_size: 50 }),
    enabled: !!patientId,
  });

  const rows = data?.items ?? [];

  return (
    <DataTable<Appointment>
      columns={[
        { id: "date", header: "Date", render: (r) => r.appointment_date },
        { id: "time", header: "Time", render: (r) => r.start_time },
        { id: "token", header: "Token", render: (r) => r.token_number ?? "—" },
        {
          id: "type",
          header: "Type",
          render: (r) => (
            <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
              {r.appointment_type.replace(/_/g, " ")}
            </Typography>
          ),
        },
        { id: "status", header: "Status", render: (r) => <AppointmentStatusBadge status={r.status} /> },
        { id: "complaint", header: "Complaint", render: (r) => r.chief_complaint ?? "—" },
      ]}
      rows={rows}
      getRowId={(r) => r.id}
      isLoading={isLoading}
      emptyState={
        <EmptyState
          icon={<EventOutlinedIcon sx={{ fontSize: 48 }} />}
          title="No appointments"
          description="Schedule this patient's next visit from the chart header or below."
          action={
            can("appointment:create") ? (
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => navigate(`/appointments/new?patient=${patientId}`)}
              >
                Book appointment
              </Button>
            ) : undefined
          }
        />
      }
    />
  );
}
