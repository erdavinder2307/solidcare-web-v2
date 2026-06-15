import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { labOrdersApi, LabOrder, LabResultCreate } from "@/features/clinical/api/labOrdersApi";
import { useAuthStore } from "@/app/store/authStore";

const STATUS_COLOR: Record<string, "default" | "info" | "warning" | "success" | "error"> = {
  ordered: "info",
  collected: "warning",
  processing: "warning",
  resulted: "success",
  cancelled: "error",
};

export default function PatientLabsTab() {
  const { patientId } = useParams<{ patientId: string }>();
  const can = useAuthStore((s) => s.can);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["patient-lab-orders", patientId],
    queryFn: () => labOrdersApi.listForPatient(patientId!),
    enabled: !!patientId,
    staleTime: 30_000,
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (orders.length === 0) {
    return (
      <Box py={4} textAlign="center">
        <Typography color="text.secondary">No lab orders on record.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {orders.map((order) => (
        <LabOrderRow
          key={order.id}
          order={order}
          canEnterResults={can("encounter:update")}
          patientId={patientId!}
        />
      ))}
    </Box>
  );
}

function LabOrderRow({
  order,
  canEnterResults,
  patientId,
}: {
  order: LabOrder;
  canEnterResults: boolean;
  patientId: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [resultDialogOpen, setResultDialogOpen] = useState(false);

  const hasAbnormal = order.results?.some((r) => r.is_abnormal);

  return (
    <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1, mb: 1.5 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={2}
        py={1.25}
        onClick={() => setExpanded((v) => !v)}
        sx={{ cursor: "pointer" }}
      >
        <Box display="flex" alignItems="center" gap={1.5} minWidth={0}>
          {hasAbnormal && (
            <Tooltip title="Abnormal result">
              <WarningAmberIcon fontSize="small" color="error" />
            </Tooltip>
          )}
          <Chip label={order.status} size="small" color={STATUS_COLOR[order.status] ?? "default"} />
          <Typography variant="body2" fontWeight={500} noWrap>
            {order.items.map((i) => i.test_name).join(", ")}
          </Typography>
          {order.lab_name && (
            <Typography variant="caption" color="text.secondary" noWrap>· {order.lab_name}</Typography>
          )}
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="caption" color="text.secondary">
            {new Date(order.ordered_at).toLocaleDateString()}
          </Typography>
          {canEnterResults && order.status !== "resulted" && order.status !== "cancelled" && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={(e) => { e.stopPropagation(); setResultDialogOpen(true); }}
            >
              Enter results
            </Button>
          )}
          {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
        </Box>
      </Box>

      <Collapse in={expanded}>
        <Divider />
        <Box px={2} py={1.5}>
          {(order.results?.length ?? 0) > 0 ? (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Test</TableCell>
                  <TableCell>Result</TableCell>
                  <TableCell>Unit</TableCell>
                  <TableCell>Reference</TableCell>
                  <TableCell>Flag</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.results!.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.test_name}</TableCell>
                    <TableCell sx={{ fontWeight: r.is_abnormal ? 700 : 400, color: r.is_abnormal ? "error.main" : "text.primary" }}>
                      {r.value ?? "—"}
                    </TableCell>
                    <TableCell>{r.unit ?? "—"}</TableCell>
                    <TableCell>{r.reference_range ?? "—"}</TableCell>
                    <TableCell>
                      {r.is_abnormal === true && <Chip label="Abnormal" size="small" color="error" />}
                      {r.is_abnormal === false && <Chip label="Normal" size="small" color="success" />}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {order.items.map((i) => i.test_name).join(" · ")} — awaiting results
            </Typography>
          )}
        </Box>
      </Collapse>

      <LabResultEntryDialog
        open={resultDialogOpen}
        order={order}
        patientId={patientId}
        onClose={() => setResultDialogOpen(false)}
      />
    </Box>
  );
}

interface ResultRow {
  test_name: string;
  value: string;
  unit: string;
  reference_range: string;
  is_abnormal: boolean;
}

function LabResultEntryDialog({
  open,
  order,
  patientId,
  onClose,
}: {
  open: boolean;
  order: LabOrder;
  patientId: string;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [rows, setRows] = useState<ResultRow[]>(() =>
    order.items.map((i) => ({
      test_name: i.test_name,
      value: "",
      unit: "",
      reference_range: "",
      is_abnormal: false,
    }))
  );

  const mutation = useMutation({
    mutationFn: () => {
      const results: LabResultCreate[] = rows
        .filter((r) => r.value.trim())
        .map((r) => ({
          test_name: r.test_name,
          value: r.value,
          unit: r.unit || undefined,
          reference_range: r.reference_range || undefined,
          is_abnormal: r.is_abnormal,
        }));
      return labOrdersApi.addResults(order.id, results);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient-lab-orders", patientId] });
      onClose();
    },
  });

  const update = (i: number, field: keyof ResultRow, value: string | boolean) => {
    setRows((prev) => prev.map((r, j) => j === i ? { ...r, [field]: value } : r));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Enter Results — {order.lab_name ?? "Lab Order"}</DialogTitle>
      <DialogContent dividers>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Test</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Reference range</TableCell>
              <TableCell>Abnormal?</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={i}>
                <TableCell sx={{ fontWeight: 500 }}>{row.test_name}</TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    value={row.value}
                    onChange={(e) => update(i, "value", e.target.value)}
                    sx={{ width: 100 }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    value={row.unit}
                    onChange={(e) => update(i, "unit", e.target.value)}
                    sx={{ width: 80 }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    value={row.reference_range}
                    onChange={(e) => update(i, "reference_range", e.target.value)}
                    sx={{ width: 130 }}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant={row.is_abnormal ? "contained" : "outlined"}
                    color={row.is_abnormal ? "error" : "inherit"}
                    onClick={() => update(i, "is_abnormal", !row.is_abnormal)}
                  >
                    {row.is_abnormal ? "Yes" : "No"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {mutation.isError && (
          <Alert severity="error" sx={{ mt: 2 }}>Failed to save results.</Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          disabled={mutation.isPending || !rows.some((r) => r.value.trim())}
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending ? "Saving…" : "Save results"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
