import React, { useEffect } from "react";
import {
  Alert,
  Box,
  Button,
  IconButton,
  MenuItem,
  Paper,
  TextField,
  Typography
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import { useFieldArray, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { billingApi, ServiceCategory } from "../api/billingApi";
import { patientsApi } from "@/features/patients/api/patientsApi";
import { encountersApi } from "@/features/clinical/api/encountersApi";

const DEFAULT_CLINIC_ID =
  import.meta.env.VITE_DEFAULT_CLINIC_ID ?? "00000000-0000-0000-0000-000000000010";

const CATEGORIES: ServiceCategory[] = ["consultation", "procedure", "lab", "pharmacy", "imaging", "nursing", "other"];

interface LineItemForm {
  service_category: ServiceCategory;
  description: string;
  quantity: string;
  unit_price: string;
  tax_rate: string;
}

interface InvoiceForm {
  clinic_id: string;
  patient_id: string;
  encounter_id: string;
  invoice_date: string;
  discount_percentage: string;
  notes: string;
  line_items: LineItemForm[];
}

export default function InvoiceCreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get("patient") ?? "";
  const encounterId = searchParams.get("encounter") ?? "";

  const { data: patient } = useQuery({
    queryKey: ["patient", patientId],
    queryFn: () => patientsApi.get(patientId),
    enabled: !!patientId,
  });

  const { data: prefillItems } = useQuery({
    queryKey: ["encounter-invoice-items", encounterId],
    queryFn: () => encountersApi.getInvoiceItems(encounterId),
    enabled: !!encounterId,
  });

  const today = new Date().toISOString().slice(0, 10);

  const { register, control, handleSubmit, formState: { errors }, reset } = useForm<InvoiceForm>({
    values: {
      clinic_id: DEFAULT_CLINIC_ID,
      patient_id: patientId,
      encounter_id: encounterId,
      invoice_date: today,
      discount_percentage: "0",
      notes: "",
      line_items: [{ service_category: "consultation", description: "Consultation fee", quantity: "1", unit_price: "500", tax_rate: "0" }],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({ control, name: "line_items" });

  // Pre-populate line items from encounter when prefill data arrives
  useEffect(() => {
    if (prefillItems && prefillItems.length > 0) {
      replace(prefillItems.map((item) => ({
        service_category: item.service_category as ServiceCategory,
        description: item.description,
        quantity: String(item.quantity),
        unit_price: String(item.unit_price),
        tax_rate: String(item.tax_rate),
      })));
    }
  }, [prefillItems]); // eslint-disable-line react-hooks/exhaustive-deps

  const mutation = useMutation({
    mutationFn: (values: InvoiceForm) =>
      billingApi.createInvoice({
        clinic_id: values.clinic_id,
        patient_id: values.patient_id,
        encounter_id: values.encounter_id || undefined,
        invoice_date: values.invoice_date,
        discount_percentage: Number(values.discount_percentage) || 0,
        notes: values.notes || undefined,
        line_items: values.line_items.map((line) => ({
          service_category: line.service_category,
          description: line.description,
          quantity: Number(line.quantity) || 1,
          unit_price: Number(line.unit_price),
          tax_rate: Number(line.tax_rate) || 0,
        })),
      }),
    onSuccess: (inv) => navigate(`/billing/invoices/${inv.id}`),
  });

  return (
    <Box maxWidth={960}>
      <Typography variant="h5" fontWeight={700} mb={1}>New Invoice</Typography>
      {patient && (
        <Typography variant="body2" color="text.secondary" mb={3}>
          Patient: {patient.full_name}
        </Typography>
      )}

      {!patientId && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Add ?patient=&lt;id&gt; to the URL, or create from an encounter detail page.
        </Alert>
      )}

      {prefillItems && prefillItems.length > 0 && (
        <Alert
          severity="info"
          sx={{ mb: 2 }}
          icon={<AutoFixHighIcon fontSize="inherit" />}
          action={
            <Button size="small" color="inherit" onClick={() => reset()}>Reset</Button>
          }
        >
          {prefillItems.length} line item{prefillItems.length !== 1 ? "s" : ""} pre-populated from encounter. Edit prices as needed.
        </Alert>
      )}

      <Paper component="form" elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider" }}
        onSubmit={handleSubmit((values) => mutation.mutate(values))}>
        <Grid container spacing={2} mb={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField fullWidth label="Invoice date" type="date" InputLabelProps={{ shrink: true }}
              {...register("invoice_date", { required: true })} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField fullWidth label="Discount %" type="number" {...register("discount_percentage")} />
          </Grid>
          <Grid size={12}>
            <TextField fullWidth label="Notes" multiline rows={2} {...register("notes")} />
          </Grid>
        </Grid>

        <Typography variant="subtitle2" fontWeight={600} mb={1}>Line items</Typography>
        {fields.map((field, index) => (
          <Grid container spacing={2} key={field.id} mb={2} alignItems="center">
            <Grid size={{ xs: 12, md: 2 }}>
              <TextField fullWidth select label="Category" {...register(`line_items.${index}.service_category`)}>
                {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="Description" required
                {...register(`line_items.${index}.description`, { required: true })}
                error={!!errors.line_items?.[index]?.description}
              />
            </Grid>
            <Grid size={{ xs: 4, md: 1 }}>
              <TextField fullWidth label="Qty" {...register(`line_items.${index}.quantity`)} />
            </Grid>
            <Grid size={{ xs: 4, md: 2 }}>
              <TextField fullWidth label="Unit price" type="number" required
                {...register(`line_items.${index}.unit_price`, { required: true })} />
            </Grid>
            <Grid size={{ xs: 4, md: 2 }}>
              <TextField fullWidth label="Tax %" {...register(`line_items.${index}.tax_rate`)} />
            </Grid>
            <Grid size={{ xs: 12, md: 1 }}>
              <IconButton onClick={() => remove(index)} disabled={fields.length === 1} color="error">
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}

        <Button startIcon={<AddIcon />} sx={{ mb: 2 }}
          onClick={() => append({ service_category: "other", description: "", quantity: "1", unit_price: "0", tax_rate: "0" })}>
          Add line item
        </Button>

        {mutation.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>Failed to create invoice. Check patient ID and line items.</Alert>
        )}

        <Box display="flex" gap={2}>
          <Button type="submit" variant="contained" disabled={mutation.isPending || !patientId}>
            Create invoice
          </Button>
          <Button variant="outlined" onClick={() => navigate("/billing/invoices")}>Cancel</Button>
        </Box>
      </Paper>
    </Box>
  );
}
