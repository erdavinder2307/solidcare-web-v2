import { Avatar, Box, Button,  Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import { useNavigate } from "react-router-dom";
import type { Patient } from "../../api/patientsApi";
import { formatAge, formatPhone } from "@/shared/utils/formatters";
import { EntityStatusBadge, Surface } from "@/shared/ui";

interface PatientHeaderProps {
  patient: Patient;
  canBill?: boolean;
}

export function PatientHeader({ patient, canBill }: PatientHeaderProps) {
  const navigate = useNavigate();

  return (
    <Surface sx={{ p: { xs: 2, md: 3 }, mb: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid>
          <Avatar sx={{ width: 72, height: 72, bgcolor: "primary.main", fontSize: "1.5rem" }}>
            {patient.full_name?.[0]}
          </Avatar>
        </Grid>
        <Grid size="grow">
          <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap" mb={0.5}>
            <Typography component="h2" variant="h5" fontWeight={700}>
              {patient.full_name}
            </Typography>
            <Typography
              variant="body2"
              fontFamily="monospace"
              fontWeight={600}
              color="primary.main"
              sx={{
                px: 1,
                py: 0.25,
                borderRadius: 1,
                border: "1px solid",
                borderColor: "primary.light",
                bgcolor: "action.hover",
              }}
            >
              {patient.uhid}
            </Typography>
            <EntityStatusBadge status={patient.is_active ? "active" : "inactive"} />
          </Box>
          <Box display="flex" gap={2} flexWrap="wrap">
            {patient.gender && (
              <Typography variant="body2" color="text.secondary" sx={{ textTransform: "capitalize" }}>
                {patient.gender}
                {patient.date_of_birth ? ` · ${formatAge(patient.date_of_birth)}` : ""}
              </Typography>
            )}
            {patient.date_of_birth && (
              <Typography variant="body2" color="text.secondary">
                DOB: <strong>{patient.date_of_birth}</strong>
              </Typography>
            )}
            {patient.blood_group && (
              <Typography variant="body2" color="error.main" fontWeight={600}>
                Blood: {patient.blood_group}
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary">
              {formatPhone(patient.phone)}
            </Typography>
            {patient.abha_number && (
              <Typography variant="body2" color="success.main" fontWeight={500}>
                ABHA linked
              </Typography>
            )}
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: "auto" }}>
          <Box display="flex" gap={1} flexWrap="wrap">
            <Button variant="outlined" size="small" onClick={() => navigate(`/patients/${patient.id}/edit`)}>
              Edit
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<CalendarMonthOutlinedIcon />}
              onClick={() => navigate(`/appointments/new?patient=${patient.id}`)}
            >
              Book
            </Button>
            {canBill && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<ReceiptOutlinedIcon />}
                onClick={() => navigate(`/billing/invoices/new?patient=${patient.id}`)}
              >
                Invoice
              </Button>
            )}
            <Button
              variant="contained"
              size="small"
              startIcon={<MedicalServicesOutlinedIcon />}
              onClick={() => navigate("/appointments/queue")}
            >
              Consult
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Surface>
  );
}
