import React from "react";
import { Box,  Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { clinicsApi } from "@/features/clinics/api/clinicsApi";
import { PageHeader, PageLayout } from "@/shared/layout";
import { EntityStatusBadge, Surface } from "@/shared/ui";

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box sx={{ py: 1.5 }}>
      <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
        {label}
      </Typography>
      <Typography variant="body2">{value ?? "—"}</Typography>
    </Box>
  );
}

export default function ClinicDetailPage() {
  const { clinicId } = useParams<{ clinicId: string }>();

  const { data: clinic, isLoading } = useQuery({
    queryKey: ["clinic", clinicId],
    queryFn: () => clinicsApi.get(clinicId!),
    enabled: !!clinicId,
  });

  return (
    <PageLayout>
      <PageHeader
        title={clinic?.name ?? "Clinic details"}
        subtitle={clinic ? `${clinic.code} · ${clinic.clinic_type.replace(/_/g, " ")}` : undefined}
        breadcrumbs={[
          { label: "Administration" },
          { label: "Clinics", to: "/admin/clinics" },
          { label: clinic?.name ?? "Details" },
        ]}
      />

      {isLoading && (
        <Typography variant="body2" color="text.secondary">
          Loading clinic…
        </Typography>
      )}

      {clinic && (
        <Surface sx={{ p: { xs: 2, md: 3 } }}>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <LocalHospitalOutlinedIcon color="primary" />
            <EntityStatusBadge status={clinic.is_active ? "active" : "inactive"} />
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <DetailRow label="Phone" value={clinic.phone} />
              <DetailRow label="Email" value={clinic.email} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <DetailRow
                label="Location"
                value={[clinic.city, clinic.state].filter(Boolean).join(", ")}
              />
              <DetailRow label="Organization ID" value={clinic.organization_id} />
            </Grid>
          </Grid>
        </Surface>
      )}
    </PageLayout>
  );
}
