import { Typography } from "@mui/material";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { clinicsApi, type Clinic } from "@/features/clinics/api/clinicsApi";
import { PageHeader, PageLayout } from "@/shared/layout";
import { DataTable, EmptyState, EntityStatusBadge } from "@/shared/ui";

export default function ClinicsListPage() {
  const navigate = useNavigate();

  const { data: clinics = [], isLoading } = useQuery({
    queryKey: ["clinics"],
    queryFn: () => clinicsApi.list(),
  });

  return (
    <PageLayout maxWidth="none">
      <PageHeader
        title="Clinics"
        subtitle={`${clinics.length} clinics in your organization`}
        breadcrumbs={[
          { label: "Administration" },
          { label: "Clinics" },
        ]}
      />

      <DataTable<Clinic>
        columns={[
          {
            id: "name",
            header: "Clinic",
            render: (clinic) => (
              <Typography variant="body2" fontWeight={500}>
                {clinic.name}
              </Typography>
            ),
          },
          { id: "code", header: "Code", render: (clinic) => clinic.code },
          {
            id: "type",
            header: "Type",
            render: (clinic) => clinic.clinic_type.replace(/_/g, " "),
          },
          { id: "phone", header: "Phone", render: (clinic) => clinic.phone ?? "—" },
          {
            id: "location",
            header: "Location",
            render: (clinic) =>
              [clinic.city, clinic.state].filter(Boolean).join(", ") || "—",
          },
          {
            id: "status",
            header: "Status",
            render: (clinic) => (
              <EntityStatusBadge status={clinic.is_active ? "active" : "inactive"} />
            ),
          },
        ]}
        rows={clinics}
        getRowId={(clinic) => clinic.id}
        isLoading={isLoading}
        onRowClick={(clinic) => navigate(`/admin/clinics/${clinic.id}`)}
        emptyState={
          <EmptyState
            icon={<LocalHospitalOutlinedIcon sx={{ fontSize: 48 }} />}
            title="No clinics found"
            description="Clinics linked to your organization will appear here."
          />
        }
      />
    </PageLayout>
  );
}
