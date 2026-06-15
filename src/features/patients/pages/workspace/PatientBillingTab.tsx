import { Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { billingApi, type Invoice } from "@/features/billing/api/billingApi";
import { useAuthStore } from "@/app/store/authStore";
import { DataTable, EmptyState, EntityStatusBadge } from "@/shared/ui";
import { formatCurrency, formatDate } from "@/shared/utils/formatters";

export default function PatientBillingTab() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const can = useAuthStore((s) => s.can);

  const { data, isLoading } = useQuery({
    queryKey: ["patient-invoices", patientId],
    queryFn: () => billingApi.listInvoices({ patient_id: patientId, page_size: 50 }),
    enabled: !!patientId && can("billing:read"),
  });

  const rows: Invoice[] = data?.items ?? [];
  const totalOutstanding = rows.reduce((sum, inv) => sum + (inv.outstanding_amount ?? 0), 0);

  return (
    <>
      {rows.length > 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Outstanding balance:{" "}
          <Typography component="span" variant="body2" fontWeight={700} color={totalOutstanding > 0 ? "warning.main" : "success.main"}>
            {formatCurrency(totalOutstanding)}
          </Typography>
        </Typography>
      )}

      <DataTable<Invoice>
        columns={[
          {
            id: "number",
            header: "Invoice",
            render: (r) => (
              <Typography variant="body2" fontFamily="monospace" fontWeight={600}>
                {r.invoice_number}
              </Typography>
            ),
          },
          { id: "date", header: "Date", render: (r) => formatDate(r.invoice_date) },
          { id: "total", header: "Total", render: (r) => formatCurrency(r.total_amount) },
          { id: "paid", header: "Paid", render: (r) => formatCurrency(r.paid_amount) },
          {
            id: "outstanding",
            header: "Outstanding",
            render: (r) => (
              <Typography
                variant="body2"
                fontWeight={r.outstanding_amount > 0 ? 600 : 400}
                color={r.outstanding_amount > 0 ? "warning.main" : "text.primary"}
              >
                {formatCurrency(r.outstanding_amount)}
              </Typography>
            ),
          },
          { id: "status", header: "Status", render: (r) => <EntityStatusBadge status={r.status} /> },
        ]}
        rows={rows}
        getRowId={(r) => r.id}
        isLoading={isLoading}
        onRowClick={(r) => navigate(`/billing/invoices/${r.id}`)}
        emptyState={
          <EmptyState
            icon={<ReceiptOutlinedIcon sx={{ fontSize: 48 }} />}
            title="No invoices"
            description="Create an invoice for consultations, procedures, or pharmacy charges."
            action={
              can("billing:create") ? (
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => navigate(`/billing/invoices/new?patient=${patientId}`)}
                >
                  Create invoice
                </Button>
              ) : undefined
            }
          />
        }
      />
    </>
  );
}
