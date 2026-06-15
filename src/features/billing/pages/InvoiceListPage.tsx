import { useState } from "react";
import { Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { billingApi, type Invoice } from "../api/billingApi";
import { useAuthStore } from "@/app/store/authStore";
import { usePatientNameMap, resolvePatientName } from "@/shared/hooks/usePatientNameMap";
import { PageHeader, PageLayout } from "@/shared/layout";
import { DataTable, DataTablePagination, EmptyState, EntityStatusBadge } from "@/shared/ui";
import { formatCurrency, formatDate } from "@/shared/utils/formatters";

export default function InvoiceListPage() {
  const navigate = useNavigate();
  const can = useAuthStore((s) => s.can);
  const { patientNames } = usePatientNameMap();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const { data, isLoading } = useQuery({
    queryKey: ["invoices", { page: page + 1, page_size: rowsPerPage }],
    queryFn: () => billingApi.listInvoices({ page: page + 1, page_size: rowsPerPage }),
  });

  const invoices: Invoice[] = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalOutstanding = invoices.reduce((sum, inv) => sum + inv.outstanding_amount, 0);

  return (
    <PageLayout maxWidth="none">
      <PageHeader
        title="Invoices"
        subtitle={`${total.toLocaleString()} invoices · outstanding ${formatCurrency(totalOutstanding)} on this page`}
        breadcrumbs={[{ label: "Billing" }, { label: "Invoices" }]}
        actions={
          can("billing:create") ? (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate("/billing/invoices/new")}>
              New Invoice
            </Button>
          ) : undefined
        }
      />

      <DataTable<Invoice>
        columns={[
          {
            id: "number",
            header: "Invoice #",
            render: (inv) => (
              <Typography variant="body2" fontFamily="monospace" fontWeight={600}>
                {inv.invoice_number}
              </Typography>
            ),
          },
          { id: "date", header: "Date", render: (inv) => formatDate(inv.invoice_date) },
          {
            id: "patient",
            header: "Patient",
            render: (inv) => resolvePatientName(patientNames, inv.patient_id),
          },
          { id: "status", header: "Status", render: (inv) => <EntityStatusBadge status={inv.status} /> },
          { id: "total", header: "Total", align: "right", render: (inv) => formatCurrency(inv.total_amount) },
          {
            id: "outstanding",
            header: "Outstanding",
            align: "right",
            render: (inv) => (
              <Typography
                variant="body2"
                fontWeight={inv.outstanding_amount > 0 ? 600 : 400}
                color={inv.outstanding_amount > 0 ? "warning.main" : "text.primary"}
              >
                {formatCurrency(inv.outstanding_amount)}
              </Typography>
            ),
          },
        ]}
        rows={invoices}
        getRowId={(inv) => inv.id}
        isLoading={isLoading}
        onRowClick={(inv) => navigate(`/billing/invoices/${inv.id}`)}
        emptyState={
          <EmptyState
            icon={<ReceiptOutlinedIcon sx={{ fontSize: 48 }} />}
            title="No invoices yet"
            description="Create an invoice after a consultation or procedure."
            action={
              can("billing:create") ? (
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate("/billing/invoices/new")}>
                  New Invoice
                </Button>
              ) : undefined
            }
          />
        }
        footer={
          <DataTablePagination
            count={total}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[10, 20, 50]}
          />
        }
      />
    </PageLayout>
  );
}
