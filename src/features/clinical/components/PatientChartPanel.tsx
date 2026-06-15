import { Avatar, Box, Button, Divider, Typography } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import { useNavigate } from "react-router-dom";
import type { Patient } from "@/features/patients/api/patientsApi";
import type { Appointment } from "@/features/appointments/api/appointmentsApi";
import { AllergyBanner, EntityStatusBadge, Surface } from "@/shared/ui";
import { formatAge, formatPhone } from "@/shared/utils/formatters";
import { PreviousDiagnoses } from "./PreviousDiagnoses";

export interface PatientChartPanelProps {
  patient: Patient;
  appointment?: Appointment;
}

export function PatientChartPanel({ patient, appointment }: PatientChartPanelProps) {
  const navigate = useNavigate();
  const allergies = patient.known_allergies ?? [];

  return (
    <Surface sx={{ p: 2, overflow: "hidden" }}>
      {allergies.length > 0 && (
        <Box sx={{ mb: 2, "& .MuiAlert-root": { py: 0.75 } }}>
          <AllergyBanner allergies={allergies} />
        </Box>
      )}

      <Box display="flex" gap={1.5} alignItems="center" mb={2}>
        <Avatar sx={{ width: 48, height: 48, bgcolor: "primary.main" }}>
          {patient.full_name?.[0]}
        </Avatar>
        <Box minWidth={0}>
          <Typography variant="subtitle1" fontWeight={700} noWrap>
            {patient.full_name}
          </Typography>
          <Typography variant="caption" color="text.secondary" fontFamily="monospace">
            {patient.uhid}
          </Typography>
        </Box>
      </Box>

      <EntityStatusBadge status={patient.is_active ? "active" : "inactive"} />

      <Box mt={2} display="flex" flexDirection="column" gap={1}>
        {patient.gender && (
          <Typography variant="body2" color="text.secondary">
            {patient.gender}
            {patient.date_of_birth ? ` · ${formatAge(patient.date_of_birth)}` : ""}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary">{formatPhone(patient.phone)}</Typography>
        {patient.blood_group && (
          <Typography variant="body2" color="error.main" fontWeight={600}>
            Blood group: {patient.blood_group}
          </Typography>
        )}
        {(patient.known_conditions ?? []).length > 0 && (
          <Typography variant="body2" color="warning.main">
            Conditions: {(patient.known_conditions ?? []).join(", ")}
          </Typography>
        )}
      </Box>

      {appointment && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="caption" color="text.secondary" textTransform="uppercase" letterSpacing={0.5}>
            Today&apos;s visit
          </Typography>
          <Typography variant="body2" fontWeight={500} sx={{ mt: 0.5 }}>
            Token {appointment.token_number ?? "—"} · {appointment.start_time}
          </Typography>
          {appointment.chief_complaint && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {appointment.chief_complaint}
            </Typography>
          )}
        </>
      )}

      <Divider sx={{ my: 2 }} />

      <PreviousDiagnoses patientId={patient.id} />

      <Divider sx={{ my: 2 }} />

      <Box display="flex" flexDirection="column" gap={1}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<OpenInNewIcon />}
          onClick={() => navigate(`/patients/${patient.id}/overview`)}
        >
          Open chart
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<DescriptionOutlinedIcon />}
          onClick={() => navigate(`/prescriptions/new?patient=${patient.id}`)}
        >
          New prescription
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ReceiptOutlinedIcon />}
          onClick={() => navigate(`/billing/invoices/new?patient=${patient.id}`)}
        >
          Create invoice
        </Button>
      </Box>
    </Surface>
  );
}
