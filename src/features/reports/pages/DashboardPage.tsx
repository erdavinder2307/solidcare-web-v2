import type { ReactNode } from "react";
import {
  Box,
  Button,
  Chip,
  LinearProgress,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Link as RouterLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { reportsApi } from "../api/reportsApi";
import { useActiveClinicId } from "@/shared/hooks/useActiveClinic";
import { useAuthStore } from "@/app/store/authStore";
import { useClinicStore } from "@/app/store/clinicStore";
import { PageHeader, PageLayout } from "@/shared/layout";
import { MetricBar, StatStrip } from "@/shared/ui/StatStrip";
import { Surface } from "@/shared/ui";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import QueuePlayNextOutlinedIcon from "@mui/icons-material/QueuePlayNextOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";

interface QuickAction {
  label: string;
  to: string;
  icon: ReactNode;
  variant?: "contained" | "outlined";
}

export default function DashboardPage() {
  const clinicId = useActiveClinicId();
  const activeClinic = useClinicStore((s) => s.activeClinic);
  const hasRole = useAuthStore((s) => s.hasRole);
  const can = useAuthStore((s) => s.can);
  const theme = useTheme();

  const { data: kpis, isLoading } = useQuery({
    queryKey: ["dashboard-kpis", clinicId],
    queryFn: () => reportsApi.dashboardKpis({ clinic_id: clinicId }),
    refetchInterval: 60_000,
  });

  const { data: trendData = [] } = useQuery({
    queryKey: ["appointments-trend", clinicId],
    queryFn: () => reportsApi.appointmentsTrend({ clinic_id: clinicId, days: 30 }),
    staleTime: 5 * 60_000,
  });

  const { data: revenueData = [] } = useQuery({
    queryKey: ["revenue-trend", clinicId],
    queryFn: () => reportsApi.revenueTrend({ clinic_id: clinicId, weeks: 8 }),
    staleTime: 5 * 60_000,
  });

  const { data: typeData = [] } = useQuery({
    queryKey: ["appt-type-dist", clinicId],
    queryFn: () => reportsApi.appointmentTypeDistribution({ clinic_id: clinicId, days: 30 }),
    staleTime: 5 * 60_000,
  });

  const TYPE_COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
  ];

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const quickActions: QuickAction[] = [];

  if (hasRole("doctor") || hasRole("superadmin")) {
    quickActions.push({
      label: "My workspace",
      to: "/clinical/workspace",
      icon: <MonitorHeartOutlinedIcon />,
      variant: "contained",
    });
  }

  if (hasRole("receptionist") || hasRole("admin") || hasRole("superadmin")) {
    quickActions.push(
      { label: "Waiting room", to: "/appointments/queue", icon: <QueuePlayNextOutlinedIcon /> },
      { label: "Book appointment", to: "/appointments/new", icon: <CalendarMonthOutlinedIcon /> },
    );
    if (can("patient:create")) {
      quickActions.push({ label: "Register patient", to: "/patients/new", icon: <PersonAddOutlinedIcon /> });
    }
  }

  if (hasRole("billing_clerk") || hasRole("admin") || hasRole("superadmin")) {
    quickActions.push({ label: "Invoices", to: "/billing/invoices", icon: <ReceiptOutlinedIcon /> });
  }

  if (hasRole("admin") || hasRole("superadmin")) {
    quickActions.push(
      { label: "Users", to: "/admin/users", icon: <GroupOutlinedIcon /> },
      { label: "Clinics", to: "/admin/clinics", icon: <LocalHospitalOutlinedIcon /> },
    );
  }

  const subtitle = [activeClinic?.name, today].filter(Boolean).join(" · ");

  return (
    <PageLayout>
      <PageHeader
        title="Dashboard"
        subtitle={subtitle}
        actions={
          quickActions.length > 0 ? (
            <Stack direction="row" flexWrap="wrap" gap={1} useFlexGap>
              {quickActions.map((action) => (
                <Button
                  key={action.to}
                  component={RouterLink}
                  to={action.to}
                  variant={action.variant ?? "outlined"}
                  size="small"
                  startIcon={action.icon}
                >
                  {action.label}
                </Button>
              ))}
            </Stack>
          ) : undefined
        }
      />

      {isLoading && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <StatStrip
          items={[
            {
              id: "appointments",
              label: "Today's appointments",
              value: kpis?.today_appointments ?? 0,
              hint: "Scheduled",
              icon: <CalendarMonthOutlinedIcon />,
              color: "primary",
            },
            {
              id: "completed",
              label: "Completed consultations",
              value: kpis?.completed_consultations ?? 0,
              hint: "Finished today",
              icon: <CheckCircleOutlineIcon />,
              color: "success",
            },
            {
              id: "patients",
              label: "New patients",
              value: kpis?.new_patients_today ?? 0,
              hint: "Registered today",
              icon: <PeopleOutlinedIcon />,
              color: "secondary",
            },
            {
              id: "revenue",
              label: "Today's revenue",
              value: kpis?.today_revenue != null ? `₹${kpis.today_revenue.toLocaleString("en-IN")}` : "₹0",
              hint: "Collected",
              icon: <ReceiptOutlinedIcon />,
              color: "warning",
            },
          ]}
        />

        <Grid container spacing={2} alignItems="stretch">
          <Grid size={{ xs: 12, lg: 8 }}>
            <MetricBar
              title="Appointment queue today"
              items={[
                {
                  id: "checked-in",
                  label: "Checked in",
                  value: kpis?.checked_in_patients ?? 0,
                  color: "warning",
                },
                {
                  id: "completed",
                  label: "Completed",
                  value: kpis?.completed_consultations ?? 0,
                  color: "primary",
                },
                {
                  id: "pending-bills",
                  label: "Pending bills",
                  value: kpis?.pending_bills ?? 0,
                  color: "error",
                },
              ]}
            />
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <Surface sx={{ p: 2, height: "100%" }}>
              <Typography variant="subtitle2" fontWeight={600} mb={1.5}>
                Platform status
              </Typography>
              <Stack spacing={1}>
                {[
                  { label: "API Services", status: "Operational" },
                  { label: "Database", status: "Operational" },
                  { label: "Notifications", status: "Operational" },
                  { label: "Storage", status: "Operational" },
                ].map((item) => (
                  <Box
                    key={item.label}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Typography variant="body2" noWrap>
                      {item.label}
                    </Typography>
                    <Chip label={item.status} size="small" color="success" variant="outlined" />
                  </Box>
                ))}
              </Stack>
            </Surface>
          </Grid>
        </Grid>

        {/* ── Chart row 1: Appointments trend + Revenue trend ── */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Surface sx={{ p: 2 }}>
              <Typography variant="subtitle2" fontWeight={600} mb={2}>
                Appointments — last 30 days
              </Typography>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={trendData} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.success.main} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={theme.palette.success.main} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10 }}
                    interval={4}
                    stroke={theme.palette.text.secondary}
                  />
                  <YAxis tick={{ fontSize: 10 }} stroke={theme.palette.text.secondary} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${theme.palette.divider}` }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Area
                    type="monotone"
                    dataKey="total"
                    name="Total"
                    stroke={theme.palette.primary.main}
                    fill="url(#gradTotal)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    name="Completed"
                    stroke={theme.palette.success.main}
                    fill="url(#gradCompleted)"
                    strokeWidth={2}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Surface>
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <Surface sx={{ p: 2, height: "100%" }}>
              <Typography variant="subtitle2" fontWeight={600} mb={2}>
                Appointment types — last 30 days
              </Typography>
              {typeData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={typeData}
                      dataKey="count"
                      nameKey="type"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ type, percent }) =>
                        `${(type as string).replace("_", " ")} ${((percent as number) * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {typeData.map((_, i) => (
                        <Cell key={i} fill={TYPE_COLORS[i % TYPE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [value, (name as string).replace("_", " ")]}
                      contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${theme.palette.divider}` }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box display="flex" alignItems="center" justifyContent="center" height={220}>
                  <Typography variant="body2" color="text.secondary">No data yet</Typography>
                </Box>
              )}
            </Surface>
          </Grid>
        </Grid>

        {/* ── Chart row 2: Weekly revenue bar chart ── */}
        <Surface sx={{ p: 2 }}>
          <Typography variant="subtitle2" fontWeight={600} mb={2}>
            Revenue collected — last 8 weeks (₹)
          </Typography>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData} margin={{ top: 4, right: 8, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke={theme.palette.text.secondary} />
              <YAxis
                tick={{ fontSize: 10 }}
                stroke={theme.palette.text.secondary}
                tickFormatter={(v) => v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`}
              />
              <Tooltip
                formatter={(v) => [`₹${Number(v).toLocaleString("en-IN")}`, "Revenue"]}
                contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${theme.palette.divider}` }}
              />
              <Bar dataKey="revenue" name="Revenue" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Surface>
      </Box>
    </PageLayout>
  );
}
