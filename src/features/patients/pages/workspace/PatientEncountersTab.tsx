import { Typography } from "@mui/material";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { encountersApi, type Encounter } from "@/features/clinical/api/encountersApi";
import { DataTable, EmptyState, EntityStatusBadge } from "@/shared/ui";
import { formatDate } from "@/shared/utils/formatters";

export default function PatientEncountersTab() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["patient-encounters", patientId],
    queryFn: () => encountersApi.listForPatient(patientId!),
    enabled: !!patientId,
  });

  const rows: Encounter[] = data?.items ?? [];

  return (
    <DataTable<Encounter>
      columns={[
        { id: "date", header: "Date", render: (r) => formatDate(r.encounter_date) },
        {
          id: "type",
          header: "Type",
          render: (r) => (
            <Typography variant="body2" sx={{ textTransform: "uppercase" }}>
              {r.encounter_type}
            </Typography>
          ),
        },
        { id: "complaint", header: "Chief complaint", render: (r) => r.chief_complaint ?? "—" },
        { id: "impression", header: "Impression", render: (r) => r.clinical_impression ?? "—" },
        { id: "status", header: "Status", render: (r) => <EntityStatusBadge status={r.status} /> },
      ]}
      rows={rows}
      getRowId={(r) => r.id}
      isLoading={isLoading}
      onRowClick={(r) => navigate(`/encounters/${r.id}`)}
      emptyState={
        <EmptyState
          icon={<MedicalServicesOutlinedIcon sx={{ fontSize: 48 }} />}
          title="No encounters"
          description="Clinical visits will appear here after consultations are documented."
        />
      }
    />
  );
}
