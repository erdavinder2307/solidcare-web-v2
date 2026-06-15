import { Typography } from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { prescriptionsApi, type Prescription } from "@/features/prescriptions/api/prescriptionsApi";
import { DataTable, EmptyState, EntityStatusBadge } from "@/shared/ui";
import { formatDate } from "@/shared/utils/formatters";

export default function PatientPrescriptionsTab() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["patient-prescriptions", patientId],
    queryFn: () => prescriptionsApi.list({ patient_id: patientId, page_size: 50 }),
    enabled: !!patientId,
  });

  const rows: Prescription[] = data?.items ?? [];

  return (
    <DataTable<Prescription>
      columns={[
        { id: "date", header: "Date", render: (r) => formatDate(r.created_at) },
        { id: "summary", header: "Diagnosis summary", render: (r) => r.diagnosis_summary ?? "—" },
        { id: "items", header: "Items", render: (r) => r.items?.length ?? 0 },
        { id: "status", header: "Status", render: (r) => <EntityStatusBadge status={r.status} /> },
        {
          id: "notes",
          header: "Notes",
          render: (r) => (
            <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
              {r.notes ?? "—"}
            </Typography>
          ),
        },
      ]}
      rows={rows}
      getRowId={(r) => r.id}
      isLoading={isLoading}
      onRowClick={(r) => navigate(`/prescriptions/${r.id}`)}
      emptyState={
        <EmptyState
          icon={<DescriptionOutlinedIcon sx={{ fontSize: 48 }} />}
          title="No prescriptions"
          description="Prescriptions created during encounters will appear in this list."
        />
      }
    />
  );
}
