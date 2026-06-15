import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ScienceIcon from "@mui/icons-material/Science";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { labOrdersApi, LabOrder } from "../api/labOrdersApi";
import type { Encounter } from "../api/encountersApi";

interface LabOrderPanelProps {
  encounter: Encounter;
  readOnly?: boolean;
}

interface TestRow {
  test_name: string;
  test_code: string;
}

const STATUS_COLOR: Record<string, "default" | "info" | "warning" | "success" | "error"> = {
  ordered: "info",
  collected: "warning",
  processing: "warning",
  resulted: "success",
  cancelled: "error",
};

const COMMON_TESTS = [
  "CBC", "RFT", "LFT", "Blood glucose (fasting)", "Blood glucose (random)",
  "HbA1c", "TSH", "T3/T4", "Urine R/E", "Lipid profile",
  "Serum creatinine", "Serum uric acid", "ESR", "CRP",
  "Dengue NS1 Ag", "Widal test", "Malaria MP/QBC",
  "ECG", "Chest X-ray", "USG Abdomen",
];

export function LabOrderPanel({ encounter, readOnly = false }: LabOrderPanelProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [labName, setLabName] = useState("");
  const [tests, setTests] = useState<TestRow[]>([{ test_name: "", test_code: "" }]);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["lab-orders", encounter.id],
    queryFn: () => labOrdersApi.listForEncounter(encounter.id),
    staleTime: 30_000,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      labOrdersApi.create({
        encounter_id: encounter.id,
        patient_id: encounter.patient_id,
        ordered_by_id: encounter.doctor_id,
        lab_name: labName || undefined,
        items: tests.filter((t) => t.test_name.trim()).map((t) => ({
          test_name: t.test_name.trim(),
          test_code: t.test_code.trim() || undefined,
        })),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lab-orders", encounter.id] });
      setOpen(false);
      setLabName("");
      setTests([{ test_name: "", test_code: "" }]);
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (orderId: string) => labOrdersApi.cancel(orderId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lab-orders", encounter.id] }),
  });

  const addQuickTest = (name: string) => {
    setTests((prev) => {
      const last = prev[prev.length - 1];
      if (last.test_name === "") {
        return prev.map((t, i) => i === prev.length - 1 ? { ...t, test_name: name } : t);
      }
      return [...prev, { test_name: name, test_code: "" }];
    });
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Box display="flex" alignItems="center" gap={1}>
          <ScienceIcon fontSize="small" color="action" />
          <Typography variant="subtitle2" fontWeight={600}>Lab Orders</Typography>
          {isLoading && <CircularProgress size={14} />}
          {orders.length > 0 && <Chip label={orders.length} size="small" />}
        </Box>
        {!readOnly && (
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={() => setOpen((v) => !v)}
            variant={open ? "contained" : "outlined"}
          >
            {open ? "Cancel" : "Order test"}
          </Button>
        )}
      </Box>

      <Collapse in={open}>
        <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1, p: 2, mb: 2 }}>
          <TextField
            fullWidth
            label="Lab / laboratory name (optional)"
            size="small"
            value={labName}
            onChange={(e) => setLabName(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Typography variant="caption" color="text.secondary" mb={0.5} display="block">
            Quick add:
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={0.5} mb={2}>
            {COMMON_TESTS.map((t) => (
              <Chip
                key={t}
                label={t}
                size="small"
                variant="outlined"
                onClick={() => addQuickTest(t)}
                clickable
              />
            ))}
          </Box>

          {tests.map((row, i) => (
            <Box key={i} display="flex" gap={1} mb={1} alignItems="center">
              <TextField
                size="small"
                label="Test name"
                value={row.test_name}
                onChange={(e) =>
                  setTests((prev) => prev.map((r, j) => j === i ? { ...r, test_name: e.target.value } : r))
                }
                sx={{ flex: 3 }}
              />
              <TextField
                size="small"
                label="Code (optional)"
                value={row.test_code}
                onChange={(e) =>
                  setTests((prev) => prev.map((r, j) => j === i ? { ...r, test_code: e.target.value } : r))
                }
                sx={{ flex: 1 }}
              />
              <IconButton
                size="small"
                color="error"
                disabled={tests.length === 1}
                onClick={() => setTests((prev) => prev.filter((_, j) => j !== i))}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}

          <Box display="flex" gap={1} mt={1}>
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={() => setTests((prev) => [...prev, { test_name: "", test_code: "" }])}
            >
              Add row
            </Button>
            <Button
              size="small"
              variant="contained"
              disabled={createMutation.isPending || !tests.some((t) => t.test_name.trim())}
              onClick={() => createMutation.mutate()}
            >
              {createMutation.isPending ? "Saving…" : "Save order"}
            </Button>
          </Box>
          {createMutation.isError && (
            <Alert severity="error" sx={{ mt: 1 }}>Failed to save lab order.</Alert>
          )}
        </Box>
      </Collapse>

      {orders.map((order) => (
        <LabOrderCard
          key={order.id}
          order={order}
          onCancel={readOnly ? undefined : () => cancelMutation.mutate(order.id)}
        />
      ))}

      {!isLoading && orders.length === 0 && (
        <Typography variant="body2" color="text.secondary">No lab orders for this encounter.</Typography>
      )}
    </Box>
  );
}

function LabOrderCard({ order, onCancel }: { order: LabOrder; onCancel?: () => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1, mb: 1 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={1.5}
        py={1}
        sx={{ cursor: "pointer" }}
        onClick={() => setExpanded((v) => !v)}
      >
        <Box display="flex" alignItems="center" gap={1} minWidth={0}>
          <Chip
            label={order.status}
            size="small"
            color={STATUS_COLOR[order.status] ?? "default"}
          />
          <Typography variant="body2" noWrap>
            {order.items.map((i) => i.test_name).join(", ")}
          </Typography>
          {order.lab_name && (
            <Typography variant="caption" color="text.secondary" noWrap>
              · {order.lab_name}
            </Typography>
          )}
        </Box>
        <Box display="flex" alignItems="center" gap={0.5}>
          <Typography variant="caption" color="text.secondary">
            {new Date(order.ordered_at).toLocaleDateString()}
          </Typography>
          {onCancel && order.status === "ordered" && (
            <Tooltip title="Cancel order">
              <IconButton
                size="small"
                color="error"
                onClick={(e) => { e.stopPropagation(); onCancel(); }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
        </Box>
      </Box>

      <Collapse in={expanded}>
        <Divider />
        <Box px={1.5} py={1}>
          <List dense disablePadding>
            {order.items.map((item) => {
              const result = order.results?.find((r) => r.test_name === item.test_name);
              return (
                <ListItem key={item.id} disableGutters disablePadding>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body2">{item.test_name}</Typography>
                        {item.test_code && (
                          <Typography variant="caption" color="text.secondary">({item.test_code})</Typography>
                        )}
                        {result && (
                          <Chip
                            size="small"
                            label={`${result.value ?? "—"} ${result.unit ?? ""}`}
                            color={result.is_abnormal ? "error" : "success"}
                          />
                        )}
                        {result?.is_abnormal && (
                          <Chip size="small" label="Abnormal" color="error" variant="outlined" />
                        )}
                      </Box>
                    }
                    secondary={result?.reference_range ? `Ref: ${result.reference_range}` : undefined}
                  />
                </ListItem>
              );
            })}
          </List>
          {order.notes && (
            <Typography variant="caption" color="text.secondary">Note: {order.notes}</Typography>
          )}
        </Box>
      </Collapse>
    </Box>
  );
}
