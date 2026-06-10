import React from "react";
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/apiClient";

export default function DoctorListPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["doctors"],
    queryFn: () => apiClient.get("/doctors").then(r => r.data),
  });
  const doctors = Array.isArray(data) ? data : [];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Doctors</Typography>
          <Typography variant="body2" color="text.secondary">{doctors.length} doctors registered</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />}>Add Doctor</Button>
      </Box>
      <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Doctor</TableCell>
              <TableCell>Specializations</TableCell>
              <TableCell>Registration #</TableCell>
              <TableCell>Consultation Fee</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {doctors.map((d: any) => (
              <TableRow key={d.id} hover>
                <TableCell><Typography variant="body2" fontWeight={500}>Dr. {d.user_id}</Typography></TableCell>
                <TableCell>{(d.specializations || []).map((s: string) => <Chip key={s} label={s} size="small" sx={{ mr: 0.5 }} />)}</TableCell>
                <TableCell>{d.registration_number ?? "—"}</TableCell>
                <TableCell>{d.consultation_fee ? `₹${d.consultation_fee}` : "—"}</TableCell>
                <TableCell><Chip label={d.status} size="small" color={d.status === "active" ? "success" : "default"} /></TableCell>
              </TableRow>
            ))}
            {!isLoading && doctors.length === 0 && (
              <TableRow><TableCell colSpan={5} align="center" sx={{ py: 6 }}><Typography color="text.secondary">No doctors found</Typography></TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
