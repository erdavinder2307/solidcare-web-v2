import React from "react";
import { Box, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@mui/material/styles";
import { reportsApi } from "../api/reportsApi";
import { useActiveClinicId } from "@/shared/hooks/useActiveClinic";
import { PageHeader, PageLayout } from "@/shared/layout";
import { DataTable, Surface } from "@/shared/ui";
import { formatCurrency } from "@/shared/utils/formatters";

const DIAG_COLORS = ["#2563eb","#7c3aed","#db2777","#d97706","#059669","#dc2626","#0891b2","#65a30d","#9333ea","#ea580c"];

export default function ReportsPage() {
  const clinicId = useActiveClinicId();
  const theme = useTheme();
  const today = new Date().toISOString().slice(0, 10);
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10);

  const [fromDate, setFromDate] = React.useState(monthStart);
  const [toDate, setToDate] = React.useState(today);

  const { data: opd } = useQuery({
    queryKey: ["report-opd", clinicId, today],
    queryFn: () => reportsApi.dailyOpd(clinicId, today),
  });

  const { data: revenue } = useQuery({
    queryKey: ["report-revenue", clinicId, fromDate, toDate],
    queryFn: () => reportsApi.revenue(fromDate, toDate, clinicId),
  });

  const { data: demographics } = useQuery({
    queryKey: ["report-demographics"],
    queryFn: () => reportsApi.demographics(),
  });

  const { data: opdVolume } = useQuery({
    queryKey: ["report-opd-volume", clinicId, fromDate, toDate],
    queryFn: () => reportsApi.opdVolumeTrend({ clinic_id: clinicId, from_date: fromDate, to_date: toDate }),
  });

  const { data: topDiagnoses } = useQuery({
    queryKey: ["report-top-diagnoses", clinicId],
    queryFn: () => reportsApi.topDiagnoses({ clinic_id: clinicId, days: 90 }),
  });

  const opdRows = [
    { id: "total", metric: "Total appointments", value: opd?.total_appointments ?? 0 },
    { id: "completed", metric: "Completed", value: opd?.completed ?? 0 },
    { id: "cancelled", metric: "Cancelled", value: opd?.cancelled ?? 0 },
    { id: "no_show", metric: "No show", value: opd?.no_show ?? 0 },
  ];

  return (
    <PageLayout maxWidth="none">
      <PageHeader
        title="Analytics"
        subtitle={`Operational and financial summary`}
        breadcrumbs={[{ label: "Reports" }]}
      />

      {/* KPI Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Surface sx={{ p: 3, height: "100%" }}>
            <Typography variant="subtitle2" color="text.secondary">Today OPD</Typography>
            <Typography variant="h4" fontWeight={700}>{opd?.total_appointments ?? 0}</Typography>
            <Typography variant="caption" color="text.secondary">
              Completed: {opd?.completed ?? 0} · Cancelled: {opd?.cancelled ?? 0}
            </Typography>
          </Surface>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Surface sx={{ p: 3, height: "100%" }}>
            <Typography variant="subtitle2" color="text.secondary">Period revenue</Typography>
            <Typography variant="h4" fontWeight={700}>{formatCurrency(revenue?.total_revenue ?? 0)}</Typography>
            <Typography variant="caption" color="text.secondary">
              Collected: {formatCurrency(revenue?.total_collected ?? 0)}
            </Typography>
          </Surface>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Surface sx={{ p: 3, height: "100%" }}>
            <Typography variant="subtitle2" color="text.secondary">Total patients</Typography>
            <Typography variant="h4" fontWeight={700}>{demographics?.total_patients ?? 0}</Typography>
          </Surface>
        </Grid>
      </Grid>

      {/* Date range picker */}
      <Box display="flex" gap={2} mb={3} alignItems="center" flexWrap="wrap">
        <Typography variant="subtitle2" fontWeight={600}>Date range</Typography>
        <TextField
          label="From"
          type="date"
          size="small"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          label="To"
          type="date"
          size="small"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          inputProps={{ min: fromDate }}
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Box>

      {/* OPD Volume Chart */}
      <Surface sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle2" fontWeight={600} mb={2}>OPD volume — appointments per day</Typography>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={opdVolume ?? []} margin={{ top: 4, right: 16, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="opdGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3} />
                <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip formatter={(v: number) => [v, "Appointments"]} />
            <Area type="monotone" dataKey="total" stroke={theme.palette.primary.main} fill="url(#opdGrad)" strokeWidth={2} dot={false} name="Total" />
            <Area type="monotone" dataKey="completed" stroke={theme.palette.success.main} fill="none" strokeWidth={1.5} strokeDasharray="4 2" dot={false} name="Completed" />
          </AreaChart>
        </ResponsiveContainer>
      </Surface>

      {/* Top Diagnoses */}
      <Surface sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle2" fontWeight={600} mb={2}>Top diagnoses — last 90 days</Typography>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={topDiagnoses ?? []}
            layout="vertical"
            margin={{ top: 4, right: 40, left: 8, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
            <YAxis
              type="category"
              dataKey="code"
              width={80}
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              formatter={(v: number, _n, props) => [v, props.payload?.description ?? ""]}
            />
            <Bar dataKey="count" name="Cases" radius={[0, 4, 4, 0]}>
              {(topDiagnoses ?? []).map((_entry, index) => (
                <Cell key={index} fill={DIAG_COLORS[index % DIAG_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Surface>

      {/* Daily OPD Table */}
      <Typography variant="subtitle1" fontWeight={600} mb={1.5}>
        Daily OPD summary — {today}
      </Typography>

      <DataTable<{ id: string; metric: string; value: number }>
        columns={[
          { id: "metric", header: "Metric", render: (r) => r.metric },
          { id: "value", header: "Count", align: "right", render: (r) => r.value },
        ]}
        rows={opdRows}
        getRowId={(r) => r.id}
      />
    </PageLayout>
  );
}
