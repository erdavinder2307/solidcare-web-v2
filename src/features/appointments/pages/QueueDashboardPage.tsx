import { Alert, Box, Button } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { appointmentsApi, type AppointmentStatus } from "../api/appointmentsApi";
import { useAuthStore } from "@/app/store/authStore";
import { QueueTable } from "@/features/clinical/components/QueueTable";
import { useTodayAppointments } from "@/features/clinical/hooks/useTodayAppointments";
import { PageHeader, PageLayout } from "@/shared/layout";

export default function QueueDashboardPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const can = useAuthStore((s) => s.can);
  const { today, queue, patientNames, isLoading, isFetching, refetch } = useTodayAppointments();

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: AppointmentStatus }) =>
      appointmentsApi.updateStatus(id, status),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      if (variables.status === "in_consultation") {
        navigate(`/consultation/${variables.id}`);
      }
    },
  });

  return (
    <PageLayout maxWidth="none">
      <PageHeader
        title="Waiting Room"
        subtitle={`Today's queue · ${today} · ${queue.length} active`}
        breadcrumbs={[
          { label: "Appointments" },
          { label: "Waiting Room" },
        ]}
        actions={
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => refetch()} disabled={isFetching}>
            Refresh
          </Button>
        }
      />

      {statusMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {(statusMutation.error as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
            "Failed to update appointment"}
        </Alert>
      )}

      <Box>
        <QueueTable
          queue={queue}
          patientNames={patientNames}
          isLoading={isLoading}
          canUpdate={can("appointment:update")}
          isUpdating={statusMutation.isPending}
          onStatusChange={(appointment, status) => statusMutation.mutate({ id: appointment.id, status })}
        />
      </Box>
    </PageLayout>
  );
}
