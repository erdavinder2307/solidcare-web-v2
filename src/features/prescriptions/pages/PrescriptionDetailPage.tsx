import React, { useState } from "react";
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Link,
  Paper,
  Skeleton,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { prescriptionsApi } from "../api/prescriptionsApi";
import { patientsApi } from "@/features/patients/api/patientsApi";
import { useAuthStore } from "@/app/store/authStore";
import { formatDateTime } from "@/shared/utils/formatters";

export default function PrescriptionDetailPage() {
  const { prescriptionId } = useParams<{ prescriptionId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const can = useAuthStore((s) => s.can);
  const [toast, setToast] = useState<string | null>(null);

  const { data: rx, isLoading } = useQuery({
    queryKey: ["prescription", prescriptionId],
    queryFn: () => prescriptionsApi.get(prescriptionId!),
    enabled: !!prescriptionId,
  });

  const { data: patient } = useQuery({
    queryKey: ["patient", rx?.patient_id],
    queryFn: () => patientsApi.get(rx!.patient_id),
    enabled: !!rx?.patient_id,
  });

  const finalizeMutation = useMutation({
    mutationFn: () => prescriptionsApi.finalize(prescriptionId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescription", prescriptionId] });
      setToast("Prescription finalized");
    },
  });

  if (isLoading) return <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 2 }} />;
  if (!rx) return <Typography color="error">Prescription not found</Typography>;

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link href="/prescriptions" underline="hover" color="text.secondary">Prescriptions</Link>
        <Typography color="text.primary">Detail</Typography>
      </Breadcrumbs>

      <Paper elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider" }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Typography variant="h5" fontWeight={700}>{patient?.full_name ?? "Prescription"}</Typography>
          <Chip label={rx.status} size="small" color={rx.status === "finalized" ? "success" : "warning"} />
        </Box>

        <Typography variant="body2" color="text.secondary" mb={2}>
          Created {formatDateTime(rx.created_at)}
        </Typography>

        {rx.diagnosis_summary && (
          <Typography variant="body2" mb={1}><strong>Diagnosis:</strong> {rx.diagnosis_summary}</Typography>
        )}
        {rx.notes && (
          <Typography variant="body2" mb={2}><strong>Notes:</strong> {rx.notes}</Typography>
        )}

        {rx.share_token && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Share link token: {rx.share_token.slice(0, 12)}… (public share endpoint available when finalized)
          </Alert>
        )}

        <Table size="small" sx={{ mb: 3 }}>
          <TableHead>
            <TableRow>
              <TableCell>Medicine</TableCell>
              <TableCell>Dosage</TableCell>
              <TableCell>Frequency</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Meal</TableCell>
              <TableCell>Instructions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rx.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.medicine_name}</TableCell>
                <TableCell>{item.dosage ?? "—"}</TableCell>
                <TableCell>{item.frequency}</TableCell>
                <TableCell>{item.duration_days ? `${item.duration_days} days` : "—"}</TableCell>
                <TableCell>{item.meal_relation.replace("_", " ")}</TableCell>
                <TableCell>{item.instructions ?? "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Box display="flex" gap={2}>
          {can("prescription:update") && rx.status === "draft" && (
            <Button variant="contained" color="success" disabled={finalizeMutation.isPending}
              onClick={() => finalizeMutation.mutate()}>
              Finalize
            </Button>
          )}
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={() => window.open(`/prescriptions/${rx.id}/print`, "_blank")}
          >
            Print
          </Button>
          {rx.status === "finalized" && rx.pdf_path && (
            <Button
              variant="outlined"
              href={prescriptionsApi.getPdfUrl(rx.id)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download PDF
            </Button>
          )}
          <Button variant="outlined" onClick={() => navigate("/prescriptions")}>Back</Button>
        </Box>
      </Paper>

      <Snackbar open={!!toast} autoHideDuration={4000} onClose={() => setToast(null)}>
        <Alert severity="success" onClose={() => setToast(null)}>{toast}</Alert>
      </Snackbar>
    </Box>
  );
}
