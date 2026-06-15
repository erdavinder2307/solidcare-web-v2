import React from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import {
  type ServiceCharge,
  type ServiceChargeCreate,
  type ServiceChargeUpdate,
  serviceChargesApi,
} from "../api/billingApi";
import { useActiveClinicId } from "@/shared/hooks/useActiveClinic";
import { useAuthStore } from "@/app/store/authStore";
import { PageHeader, PageLayout } from "@/shared/layout";
import { DataTable, Surface } from "@/shared/ui";
import { formatCurrency } from "@/shared/utils/formatters";

const CATEGORIES = [
  "consultation", "procedure", "lab", "pharmacy", "imaging", "nursing", "other",
] as const;

type Category = (typeof CATEGORIES)[number];

interface FormValues {
  service_code: string;
  service_category: Category;
  description: string;
  standard_price: number;
  tax_rate: number;
  is_taxable: boolean;
}

const defaultValues: FormValues = {
  service_code: "",
  service_category: "consultation",
  description: "",
  standard_price: 0,
  tax_rate: 18,
  is_taxable: false,
};

export default function ServiceChargeMasterPage() {
  const clinicId = useActiveClinicId();
  const queryClient = useQueryClient();
  const can = useAuthStore((s) => s.can);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<ServiceCharge | null>(null);

  const { data: charges = [], isLoading } = useQuery({
    queryKey: ["service-charges", clinicId],
    queryFn: () => serviceChargesApi.list({ clinic_id: clinicId, active_only: false }),
  });

  const { control, handleSubmit, reset } = useForm<FormValues>({ defaultValues });

  const createMutation = useMutation({
    mutationFn: (data: ServiceChargeCreate) => serviceChargesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-charges"] });
      setDialogOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ServiceChargeUpdate }) =>
      serviceChargesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-charges"] });
      setDialogOpen(false);
      setEditTarget(null);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      serviceChargesApi.update(id, { is_active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["service-charges"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => serviceChargesApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["service-charges"] }),
  });

  const openCreate = () => {
    reset(defaultValues);
    setEditTarget(null);
    setDialogOpen(true);
  };

  const openEdit = (charge: ServiceCharge) => {
    reset({
      service_code: charge.service_code,
      service_category: charge.service_category as Category,
      description: charge.description,
      standard_price: charge.standard_price,
      tax_rate: charge.tax_rate,
      is_taxable: charge.is_taxable,
    });
    setEditTarget(charge);
    setDialogOpen(true);
  };

  const onSubmit = (values: FormValues) => {
    if (editTarget) {
      updateMutation.mutate({
        id: editTarget.id,
        data: {
          description: values.description,
          standard_price: values.standard_price,
          tax_rate: values.tax_rate,
          is_taxable: values.is_taxable,
        },
      });
    } else {
      createMutation.mutate({ ...values, clinic_id: clinicId });
    }
  };

  return (
    <PageLayout>
      <PageHeader
        title="Service Charge Master"
        subtitle="Manage clinic service codes, categories, and pricing"
        breadcrumbs={[{ label: "Billing", to: "/billing/invoices" }, { label: "Service Charges" }]}
        actions={
          can("billing:write") ? (
            <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
              Add service
            </Button>
          ) : undefined
        }
      />

      <Surface>
        <DataTable<ServiceCharge>
          isLoading={isLoading}
          columns={[
            { id: "code", header: "Code", render: (r) => r.service_code },
            {
              id: "category",
              header: "Category",
              render: (r) => (
                <Chip label={r.service_category} size="small" variant="outlined" />
              ),
            },
            { id: "description", header: "Description", render: (r) => r.description },
            {
              id: "price",
              header: "Standard price",
              align: "right",
              render: (r) => formatCurrency(r.standard_price),
            },
            {
              id: "tax",
              header: "Tax",
              align: "right",
              render: (r) => (r.is_taxable ? `${r.tax_rate}%` : "—"),
            },
            {
              id: "active",
              header: "Active",
              align: "center",
              render: (r) =>
                can("billing:write") ? (
                  <Switch
                    size="small"
                    checked={r.is_active}
                    onChange={(_, checked) =>
                      toggleMutation.mutate({ id: r.id, is_active: checked })
                    }
                  />
                ) : (
                  <Chip
                    label={r.is_active ? "Active" : "Inactive"}
                    size="small"
                    color={r.is_active ? "success" : "default"}
                  />
                ),
            },
            {
              id: "actions",
              header: "",
              align: "right",
              render: (r) =>
                can("billing:write") ? (
                  <Box display="flex" gap={0.5} justifyContent="flex-end">
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => openEdit(r)}>
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => {
                          if (window.confirm(`Delete "${r.description}"?`)) {
                            deleteMutation.mutate(r.id);
                          }
                        }}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                ) : null,
            },
          ]}
          rows={charges}
          getRowId={(r) => r.id}
        />
      </Surface>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>{editTarget ? "Edit service" : "Add service"}</DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "12px !important" }}>
            <Box display="flex" gap={2}>
              <Controller
                name="service_code"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Service code"
                    size="small"
                    disabled={!!editTarget}
                    sx={{ width: 140 }}
                  />
                )}
              />
              <Controller
                name="service_category"
                control={control}
                render={({ field }) => (
                  <FormControl size="small" sx={{ flex: 1 }}>
                    <InputLabel>Category</InputLabel>
                    <Select {...field} label="Category" disabled={!!editTarget}>
                      {CATEGORIES.map((c) => (
                        <MenuItem key={c} value={c}>
                          {c.charAt(0).toUpperCase() + c.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Box>

            <Controller
              name="description"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField {...field} label="Description" size="small" fullWidth />
              )}
            />

            <Box display="flex" gap={2}>
              <Controller
                name="standard_price"
                control={control}
                rules={{ required: true, min: 0.01 }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Standard price (₹)"
                    type="number"
                    size="small"
                    inputProps={{ min: 0, step: 0.01 }}
                    sx={{ flex: 1 }}
                  />
                )}
              />
              <Controller
                name="tax_rate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Tax rate (%)"
                    type="number"
                    size="small"
                    inputProps={{ min: 0, max: 100, step: 0.5 }}
                    sx={{ width: 110 }}
                  />
                )}
              />
            </Box>

            <Controller
              name="is_taxable"
              control={control}
              render={({ field }) => (
                <Box display="flex" alignItems="center" gap={1}>
                  <Switch {...field} checked={field.value} size="small" />
                  <Typography variant="body2">Taxable</Typography>
                </Box>
              )}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {editTarget ? "Save changes" : "Add service"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </PageLayout>
  );
}
