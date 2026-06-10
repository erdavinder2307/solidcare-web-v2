import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Tab,
  Tabs,
  Breadcrumbs,
  Link,
  Skeleton,
  Button,
  Avatar,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { patientsApi } from "../api/patientsApi";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";

interface TabPanelProps { children?: React.ReactNode; index: number; value: number; }
function TabPanel({ children, value, index }: TabPanelProps) {
  return value === index ? <Box pt={3}>{children}</Box> : null;
}

export default function PatientDetailPage() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = React.useState(0);

  const { data: patient, isLoading } = useQuery({
    queryKey: ["patient", patientId],
    queryFn: () => patientsApi.get(patientId!),
    enabled: !!patientId,
  });

  if (isLoading) return (
    <Box>
      <Skeleton variant="text" width={300} height={40} sx={{ mb: 3 }} />
      <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
    </Box>
  );

  if (!patient) return <Typography color="error">Patient not found</Typography>;

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link href="/patients" underline="hover" color="text.secondary">Patients</Link>
        <Typography color="text.primary">{patient.full_name}</Typography>
      </Breadcrumbs>

      {/* Patient header card */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar sx={{ width: 72, height: 72, bgcolor: "primary.main", fontSize: "1.5rem" }}>
              {patient.full_name?.[0]}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Box display="flex" alignItems="center" gap={2} mb={0.5}>
              <Typography variant="h5" fontWeight={700}>{patient.full_name}</Typography>
              <Chip label={patient.uhid} size="small" color="primary" variant="outlined" sx={{ fontFamily: "monospace", fontWeight: 600 }} />
              <Chip label={patient.is_active ? "Active" : "Inactive"} size="small" color={patient.is_active ? "success" : "default"} />
            </Box>
            <Box display="flex" gap={3} flexWrap="wrap">
              {patient.gender && <Typography variant="body2" color="text.secondary" sx={{ textTransform: "capitalize" }}>Gender: <strong>{patient.gender}</strong></Typography>}
              {patient.date_of_birth && <Typography variant="body2" color="text.secondary">DOB: <strong>{patient.date_of_birth}</strong></Typography>}
              {patient.blood_group && <Chip label={patient.blood_group} size="small" color="error" variant="outlined" />}
              <Typography variant="body2" color="text.secondary">Phone: <strong>{patient.phone}</strong></Typography>
              {patient.abha_number && <Chip label={`ABHA: ${patient.abha_number}`} size="small" color="success" variant="outlined" />}
            </Box>
          </Grid>
          <Grid item>
            <Box display="flex" gap={1.5}>
              <Button variant="outlined" size="small" startIcon={<CalendarMonthOutlinedIcon />} onClick={() => navigate(`/appointments/new?patient=${patientId}`)}>
                Book Appointment
              </Button>
              <Button variant="contained" size="small" startIcon={<MedicalServicesOutlinedIcon />}>
                Start Consultation
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: "divider", mb: 0 }}>
        <Tab label="Overview" />
        <Tab label="Appointments" />
        <Tab label="Encounters" />
        <Tab label="Prescriptions" />
        <Tab label="Documents" />
      </Tabs>

      <TabPanel value={tab} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 2.5, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
              <Typography variant="subtitle2" fontWeight={600} mb={2} color="text.secondary">CONTACT INFORMATION</Typography>
              <Grid container spacing={1.5}>
                <Grid item xs={5}><Typography variant="body2" color="text.secondary">Phone</Typography></Grid>
                <Grid item xs={7}><Typography variant="body2" fontWeight={500}>{patient.phone}</Typography></Grid>
                {patient.email && <>
                  <Grid item xs={5}><Typography variant="body2" color="text.secondary">Email</Typography></Grid>
                  <Grid item xs={7}><Typography variant="body2" fontWeight={500}>{patient.email}</Typography></Grid>
                </>}
                {patient.address_line1 && <>
                  <Grid item xs={5}><Typography variant="body2" color="text.secondary">Address</Typography></Grid>
                  <Grid item xs={7}><Typography variant="body2" fontWeight={500}>{[patient.address_line1, patient.city, patient.state].filter(Boolean).join(", ")}</Typography></Grid>
                </>}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tab} index={1}>
        <Typography color="text.secondary">Appointments will appear here</Typography>
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <Typography color="text.secondary">Clinical encounters will appear here</Typography>
      </TabPanel>
      <TabPanel value={tab} index={3}>
        <Typography color="text.secondary">Prescriptions will appear here</Typography>
      </TabPanel>
      <TabPanel value={tab} index={4}>
        <Typography color="text.secondary">Documents will appear here</Typography>
      </TabPanel>
    </Box>
  );
}
