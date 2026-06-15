import { useParams } from "react-router-dom";
import { Surface } from "@/shared/ui";
import { Timeline } from "@/shared/ui/Timeline";
import { usePatientTimeline } from "./usePatientTimeline";

export default function PatientTimelineTab() {
  const { patientId } = useParams<{ patientId: string }>();
  const { events, isLoading } = usePatientTimeline(patientId);

  return (
    <Surface sx={{ p: { xs: 2, md: 3 } }}>
      <Timeline events={events} isLoading={isLoading} />
    </Surface>
  );
}
