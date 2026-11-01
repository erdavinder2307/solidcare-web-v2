import { useState } from "react";
import { Button, Typography } from "@mui/material";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import DownloadIcon from "@mui/icons-material/Download";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { auditApi, type AuditLog } from "../api/auditApi";
import { PageHeader, PageLayout } from "@/shared/layout";
import { DataTable, DataTablePagination, EmptyState, StatusBadge } from "@/shared/ui";
import { formatDateTime } from "@/shared/utils/formatters";
import { csvFilename, downloadBlob } from "@/shared/utils/download";

export default function AuditLogPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const { enqueueSnackbar } = useSnackbar();

  const { data, isLoading } = useQuery({
    queryKey: ["audit-logs", { page: page + 1, page_size: rowsPerPage }],
    queryFn: () => auditApi.list({ page: page + 1, page_size: rowsPerPage }),
  });

  const exportMutation = useMutation({
    mutationFn: () => auditApi.exportCsv(),
    onSuccess: (blob) => downloadBlob(blob, csvFilename("audit-logs")),
    onError: () => enqueueSnackbar("Failed to export audit logs", { variant: "error" }),
  });

  const logs: AuditLog[] = data?.items ?? [];
  const total = data?.total ?? 0;

  return (
    <PageLayout maxWidth="none">
      <PageHeader
        title="Audit log"
        subtitle="Immutable record of PHI access and system actions"
        breadcrumbs={[{ label: "Administration" }, { label: "Audit log" }]}
        actions={
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            disabled={exportMutation.isPending || total === 0}
            onClick={() => exportMutation.mutate()}
          >
            {exportMutation.isPending ? "Exporting…" : "Export CSV"}
          </Button>
        }
      />

      <DataTable<AuditLog>
        columns={[
          { id: "time", header: "Time", render: (log) => formatDateTime(log.created_at) },
          { id: "user", header: "User", render: (log) => log.user_email ?? "—" },
          {
            id: "action",
            header: "Action",
            render: (log) => <StatusBadge label={log.action} tone="neutral" />,
          },
          {
            id: "resource",
            header: "Resource",
            render: (log) =>
              log.resource_id
                ? `${log.resource_type} · ${log.resource_id.slice(0, 8)}…`
                : log.resource_type,
          },
          {
            id: "endpoint",
            header: "Endpoint",
            render: (log) => (
              <Typography variant="body2" fontFamily="monospace" fontSize="0.75rem">
                {log.http_method ?? ""} {log.endpoint ?? "—"}
              </Typography>
            ),
          },
          {
            id: "status",
            header: "Status",
            render: (log) => (
              <StatusBadge
                label={log.success === false ? "Failed" : "OK"}
                tone={log.success === false ? "error" : "success"}
              />
            ),
          },
        ]}
        rows={logs}
        getRowId={(log) => log.id}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            icon={<SecurityOutlinedIcon sx={{ fontSize: 48 }} />}
            title="No audit entries yet"
            description="System and PHI access events will be recorded here automatically."
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
            rowsPerPageOptions={[25, 50, 100]}
          />
        }
      />
    </PageLayout>
  );
}
