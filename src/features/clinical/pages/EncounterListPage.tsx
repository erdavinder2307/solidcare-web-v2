import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/app/store/authStore";
import { useTodayAppointments } from "@/features/clinical/hooks/useTodayAppointments";
import { QueueTable } from "@/features/clinical/components/QueueTable";
import { PageHeader, PageLayout } from "@/shared/layout";

export default function EncounterListPage() {
  const navigate = useNavigate();
  const hasRole = useAuthStore((s) => s.hasRole);
  const { today, queue, patientNames, isLoading } = useTodayAppointments();
  const active = queue.filter((a) => ["checked_in", "in_consultation"].includes(a.status));

  return (
    <PageLayout maxWidth="none">
      <PageHeader
        title="Encounters"
        subtitle={`Active consultations · ${today}`}
        breadcrumbs={[{ label: "Clinical" }, { label: "Encounters" }]}
        actions={
          <>
            {(hasRole("doctor") || hasRole("superadmin")) && (
              <Button variant="contained" onClick={() => navigate("/clinical/workspace")}>
                Open workspace
              </Button>
            )}
            <Button variant="outlined" onClick={() => navigate("/appointments/queue")}>
              Waiting room
            </Button>
          </>
        }
      />

      <QueueTable
        queue={active}
        patientNames={patientNames}
        isLoading={isLoading}
        canUpdate={false}
        emptyTitle="No active consultations"
        emptyDescription="Start a consultation from the waiting room when a patient is checked in."
      />
    </PageLayout>
  );
}
