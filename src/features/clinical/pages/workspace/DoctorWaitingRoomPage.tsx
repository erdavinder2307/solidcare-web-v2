import { Alert, Box, Button } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { appointmentsApi, type AppointmentStatus } from "@/features/appointments/api/appointmentsApi";
import { useAuthStore } from "@/app/store/authStore";
import { QueueTable } from "@/features/clinical/components/QueueTable";
import { useTodayAppointments } from "@/features/clinical/hooks/useTodayAppointments";

export default function DoctorWaitingRoomPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const can = useAuthStore((s) => s.can);
  const { queue, patientNames, isLoading, isFetching, refetch } = useTodayAppointments();

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
    <Box>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="outlined" size="small" startIcon={<RefreshIcon />} onClick={() => refetch()} disabled={isFetching}>
          Refresh
        </Button>
      </Box>

      {statusMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {(statusMutation.error as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
            "Failed to update appointment"}
        </Alert>
      )}

      <QueueTable
        queue={queue}
        patientNames={patientNames}
        isLoading={isLoading}
        canUpdate={can("appointment:update")}
        canRecordVitals={can("encounter:update")}
        isUpdating={statusMutation.isPending}
        onStatusChange={(appointment, status) => statusMutation.mutate({ id: appointment.id, status })}
      />
    </Box>
  );
}
