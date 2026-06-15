import type { ReactNode } from "react";
import { Typography, Chip, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useOutletContext } from "react-router-dom";
import type { PatientWorkspaceContext } from "./PatientWorkspace";
import { formatPhone } from "@/shared/utils/formatters";
import { Surface } from "@/shared/ui";

function InfoSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Surface sx={{ p: 2.5, height: "100%" }}>
      <Typography variant="subtitle2" fontWeight={600} mb={2} color="text.secondary" letterSpacing={0.5}>
        {title}
      </Typography>
      {children}
    </Surface>
  );
}

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <>
      <Grid size={5}>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
      </Grid>
      <Grid size={7}>
        <Typography variant="body2" fontWeight={500}>{value}</Typography>
      </Grid>
    </>
  );
}

export default function PatientOverviewTab() {
  const { patient } = useOutletContext<PatientWorkspaceContext>();
  const conditions = patient.known_conditions ?? [];
  const allergies = patient.known_allergies ?? [];

  return (
    <Grid container spacing={3}>
      {(conditions.length > 0 || allergies.length > 0) && (
        <Grid size={12}>
          <InfoSection title="CLINICAL ALERTS">
            {conditions.length > 0 && (
              <Box mb={allergies.length ? 2 : 0}>
                <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                  Active conditions
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={0.75}>
                  {conditions.map((c) => (
                    <Chip key={c} label={c} size="small" color="warning" variant="outlined" />
                  ))}
                </Box>
              </Box>
            )}
            {allergies.length > 0 && (
              <Box>
                <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                  Known allergies
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={0.75}>
                  {allergies.map((a) => (
                    <Chip key={a} label={a} size="small" color="error" variant="outlined" />
                  ))}
                </Box>
              </Box>
            )}
          </InfoSection>
        </Grid>
      )}

      <Grid size={{ xs: 12, md: 6 }}>
        <InfoSection title="CONTACT">
          <Grid container spacing={1.5}>
            <InfoRow label="Phone" value={formatPhone(patient.phone)} />
            {patient.alternate_phone && <InfoRow label="Alt. phone" value={formatPhone(patient.alternate_phone)} />}
            {patient.email && <InfoRow label="Email" value={patient.email} />}
            {patient.address_line1 && (
              <InfoRow
                label="Address"
                value={[patient.address_line1, patient.address_line2, patient.city, patient.state, patient.pincode]
                  .filter(Boolean)
                  .join(", ")}
              />
            )}
          </Grid>
        </InfoSection>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <InfoSection title="EMERGENCY CONTACT">
          {patient.emergency_contact_name ? (
            <Grid container spacing={1.5}>
              <InfoRow label="Name" value={patient.emergency_contact_name} />
              <InfoRow label="Phone" value={formatPhone(patient.emergency_contact_phone)} />
              {patient.emergency_contact_relation && (
                <InfoRow label="Relation" value={patient.emergency_contact_relation} />
              )}
            </Grid>
          ) : (
            <Typography variant="body2" color="text.secondary">No emergency contact on file</Typography>
          )}
        </InfoSection>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <InfoSection title="INSURANCE">
          {patient.insurance_provider ? (
            <Grid container spacing={1.5}>
              <InfoRow label="Provider" value={patient.insurance_provider} />
              {patient.insurance_policy_number && (
                <InfoRow label="Policy #" value={patient.insurance_policy_number} />
              )}
            </Grid>
          ) : (
            <Typography variant="body2" color="text.secondary">No insurance information recorded</Typography>
          )}
        </InfoSection>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <InfoSection title="IDENTIFIERS">
          <Grid container spacing={1.5}>
            <InfoRow label="UHID" value={<Box component="span" sx={{ fontFamily: "monospace" }}>{patient.uhid}</Box>} />
            {patient.abha_number && <InfoRow label="ABHA" value={patient.abha_number} />}
            {patient.abha_address && <InfoRow label="ABHA address" value={patient.abha_address} />}
            <InfoRow label="Registered" value={new Date(patient.created_at).toLocaleDateString("en-IN")} />
          </Grid>
        </InfoSection>
      </Grid>
    </Grid>
  );
}
