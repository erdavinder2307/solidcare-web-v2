import React, { useState } from "react";
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Link,
  MenuItem,
  Paper,
  Skeleton,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import Grid from "@mui/material/Grid2";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { billingApi, PaymentMethod } from "../api/billingApi";
import { patientsApi } from "@/features/patients/api/patientsApi";
import { useAuthStore } from "@/app/store/authStore";
import { formatCurrency, formatDate, formatDateTime } from "@/shared/utils/formatters";

const PAYMENT_METHODS: PaymentMethod[] = ["cash", "card", "upi", "net_banking", "cheque", "insurance", "advance", "other"];

export default function InvoiceDetailPage() {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const queryClient = useQueryClient();
  const can = useAuthStore((s) => s.can);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("cash");
  const [reference, setReference] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const { data: invoice, isLoading } = useQuery({
    queryKey: ["invoice", invoiceId],
    queryFn: () => billingApi.getInvoice(invoiceId!),
    enabled: !!invoiceId,
  });

  const { data: payments } = useQuery({
    queryKey: ["invoice-payments", invoiceId],
    queryFn: () => billingApi.listPayments(invoiceId!),
    enabled: !!invoiceId,
  });

  const { data: patient } = useQuery({
    queryKey: ["patient", invoice?.patient_id],
    queryFn: () => patientsApi.get(invoice!.patient_id),
    enabled: !!invoice?.patient_id,
  });

  const paymentMutation = useMutation({
    mutationFn: () =>
      billingApi.recordPayment({
        invoice_id: invoice!.id,
        patient_id: invoice!.patient_id,
        clinic_id: invoice!.clinic_id,
        payment_method: method,
        amount: Number(amount),
        transaction_reference: reference || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoice", invoiceId] });
      queryClient.invalidateQueries({ queryKey: ["invoice-payments", invoiceId] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      setAmount("");
      setReference("");
      setToast("Payment recorded");
    },
  });

  if (isLoading) return <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />;
  if (!invoice) return <Typography color="error">Invoice not found</Typography>;

  const canPay = can("billing:create") && invoice.outstanding_amount > 0 &&
    !["paid", "cancelled", "refunded"].includes(invoice.status);

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link href="/billing/invoices" underline="hover" color="text.secondary">Invoices</Link>
        <Typography color="text.primary">{invoice.invoice_number}</Typography>
      </Breadcrumbs>

      <Paper elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider", mb: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2} flexWrap="wrap" gap={1}>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h5" fontWeight={700}>{invoice.invoice_number}</Typography>
            <Chip label={invoice.status.replace("_", " ")} size="small" />
          </Box>
          <Button
            variant="outlined"
            size="small"
            startIcon={<PrintIcon />}
            onClick={() => window.open(`/billing/invoices/${invoice.id}/receipt`, "_blank")}
          >
            Print receipt
          </Button>
        </Box>
        <Typography variant="body2" color="text.secondary" mb={2}>
          {patient?.full_name ?? "Patient"} · {formatDate(invoice.invoice_date)}
        </Typography>

        <Grid container spacing={2} mb={3}>
          <Grid size={{ xs: 6, md: 3 }}><Typography variant="caption" color="text.secondary">Subtotal</Typography><Typography>{formatCurrency(invoice.subtotal)}</Typography></Grid>
          <Grid size={{ xs: 6, md: 3 }}><Typography variant="caption" color="text.secondary">Tax (CGST+SGST)</Typography><Typography>{formatCurrency(invoice.total_tax)}</Typography></Grid>
          <Grid size={{ xs: 6, md: 3 }}><Typography variant="caption" color="text.secondary">Total</Typography><Typography fontWeight={600}>{formatCurrency(invoice.total_amount)}</Typography></Grid>
          <Grid size={{ xs: 6, md: 3 }}><Typography variant="caption" color="text.secondary">Outstanding</Typography><Typography color="error.main" fontWeight={600}>{formatCurrency(invoice.outstanding_amount)}</Typography></Grid>
        </Grid>

        <Table size="small" sx={{ mb: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Qty</TableCell>
              <TableCell align="right">Unit price</TableCell>
              <TableCell align="right">Tax</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoice.line_items.map((line) => (
              <TableRow key={line.id}>
                <TableCell>{line.description}</TableCell>
                <TableCell>{line.service_category}</TableCell>
                <TableCell align="right">{line.quantity}</TableCell>
                <TableCell align="right">{formatCurrency(line.unit_price)}</TableCell>
                <TableCell align="right">{formatCurrency(line.tax_amount)}</TableCell>
                <TableCell align="right">{formatCurrency(line.total_amount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {canPay && (
        <Paper elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider", mb: 3 }}>
          <Typography variant="subtitle1" fontWeight={600} mb={2}>Record payment</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField fullWidth label="Amount" type="number" value={amount}
                onChange={(e) => setAmount(e.target.value)}
                helperText={`Outstanding: ${formatCurrency(invoice.outstanding_amount)}`}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField fullWidth select label="Method" value={method} onChange={(e) => setMethod(e.target.value as PaymentMethod)}>
                {PAYMENT_METHODS.map((m) => <MenuItem key={m} value={m}>{m.replace("_", " ")}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField fullWidth label="Reference" value={reference} onChange={(e) => setReference(e.target.value)} />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Button variant="contained" fullWidth disabled={!amount || paymentMutation.isPending}
                onClick={() => paymentMutation.mutate()}>
                Record payment
              </Button>
            </Grid>
          </Grid>
          {paymentMutation.isError && <Alert severity="error" sx={{ mt: 2 }}>Payment failed</Alert>}
        </Paper>
      )}

      <Paper elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider" }}>
        <Typography variant="subtitle1" fontWeight={600} mb={2}>Payment history</Typography>
        {(payments ?? []).length === 0 ? (
          <Typography color="text.secondary">No payments recorded</Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Receipt</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Method</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(payments ?? []).map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.receipt_number ?? "—"}</TableCell>
                  <TableCell>{formatDateTime(p.paid_at)}</TableCell>
                  <TableCell>{p.payment_method}</TableCell>
                  <TableCell align="right">{formatCurrency(p.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      <Snackbar open={!!toast} autoHideDuration={4000} onClose={() => setToast(null)}>
        <Alert severity="success" onClose={() => setToast(null)}>{toast}</Alert>
      </Snackbar>
    </Box>
  );
}
