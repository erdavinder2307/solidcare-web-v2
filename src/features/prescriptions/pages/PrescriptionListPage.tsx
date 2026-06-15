import { useState } from "react";
import { Button, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { prescriptionsApi, type Prescription } from "../api/prescriptionsApi";
import { useAuthStore } from "@/app/store/authStore";
import { usePatientNameMap, resolvePatientName } from "@/shared/hooks/usePatientNameMap";
import { PageHeader, PageLayout } from "@/shared/layout";
import { DataTable, DataTablePagination, EmptyState, EntityStatusBadge } from "@/shared/ui";
import { formatDateTime } from "@/shared/utils/formatters";

export default function PrescriptionListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const can = useAuthStore((s) => s.can);
  const { patientNames } = usePatientNameMap();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const { data, isLoading } = useQuery({
    queryKey: ["prescriptions", { page: page + 1, page_size: rowsPerPage }],
    queryFn: () => prescriptionsApi.list({ page: page + 1, page_size: rowsPerPage }),
  });

  const finalizeMutation = useMutation({
    mutationFn: (id: string) => prescriptionsApi.finalize(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
      enqueueSnackbar("Prescription finalized", { variant: "success" });
    },
    onError: () => enqueueSnackbar("Failed to finalize prescription", { variant: "error" }),
  });

  const prescriptions: Prescription[] = data?.items ?? [];
  const total = data?.total ?? 0;

  return (
    <PageLayout maxWidth="none">
      <PageHeader
        title="Prescriptions"
        subtitle={`${total.toLocaleString()} prescriptions`}
        breadcrumbs={[{ label: "Clinical" }, { label: "Prescriptions" }]}
        actions={
          can("prescription:create") ? (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate("/prescriptions/new")}>
              New Prescription
            </Button>
          ) : undefined
        }
      />

      <DataTable<Prescription>
        columns={[
          { id: "created", header: "Created", render: (rx) => formatDateTime(rx.created_at) },
          {
            id: "patient",
            header: "Patient",
            render: (rx) => resolvePatientName(patientNames, rx.patient_id),
          },
          { id: "diagnosis", header: "Diagnosis", render: (rx) => rx.diagnosis_summary ?? "—" },
          { id: "status", header: "Status", render: (rx) => <EntityStatusBadge status={rx.status} /> },
          {
            id: "actions",
            header: "",
            align: "right",
            render: (rx) => (
              <Stack direction="row" spacing={0.75} justifyContent="flex-end">
                <Button
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/prescriptions/${rx.id}`);
                  }}
                >
                  View
                </Button>
                {can("prescription:update") && rx.status === "draft" && (
                  <Button
                    size="small"
                    color="success"
                    disabled={finalizeMutation.isPending}
                    onClick={(e) => {
                      e.stopPropagation();
                      finalizeMutation.mutate(rx.id);
                    }}
                  >
                    Finalize
                  </Button>
                )}
              </Stack>
            ),
          },
        ]}
        rows={prescriptions}
        getRowId={(rx) => rx.id}
        isLoading={isLoading}
        onRowClick={(rx) => navigate(`/prescriptions/${rx.id}`)}
        emptyState={
          <EmptyState
            icon={<DescriptionOutlinedIcon sx={{ fontSize: 48 }} />}
            title="No prescriptions"
            description="Prescriptions are created from completed consultations."
            action={
              can("prescription:create") ? (
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate("/prescriptions/new")}>
                  New Prescription
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
          />
        }
      />
    </PageLayout>
  );
}
