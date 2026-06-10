import React from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Divider,
  Chip,
  LinearProgress,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/apiClient";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}

function KpiCard({ title, value, subtitle, icon, color, trend }: KpiCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
        transition: "box-shadow 0.2s",
        "&:hover": { boxShadow: 3 },
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: 2,
          bgcolor: `${color}.50`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: `${color}.main`,
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box flexGrow={1}>
        <Typography variant="caption" color="text.secondary" fontWeight={500} textTransform="uppercase" letterSpacing={0.5}>
          {title}
        </Typography>
        <Typography variant="h4" fontWeight={700} color="text.primary" lineHeight={1.2}>
          {value}
        </Typography>
        <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
        {trend && <Chip label={trend} size="small" color="success" sx={{ ml: 1, height: 20, fontSize: "0.7rem" }} />}
      </Box>
    </Paper>
  );
}

export default function DashboardPage() {
  const { data: kpis, isLoading } = useQuery({
    queryKey: ["dashboard-kpis"],
    queryFn: () => apiClient.get("/reports/dashboard/kpis").then((r) => r.data),
    refetchInterval: 60_000, // refresh every minute
  });

  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <Box>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h5" fontWeight={700}>Dashboard</Typography>
        <Typography variant="body2" color="text.secondary">{today}</Typography>
      </Box>

      {isLoading && <LinearProgress sx={{ mb: 3, borderRadius: 1 }} />}

      {/* KPI Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} lg={3}>
          <KpiCard
            title="Today's Appointments"
            value={kpis?.today_appointments ?? 0}
            subtitle="Scheduled for today"
            icon={<CalendarMonthOutlinedIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <KpiCard
            title="Completed Consultations"
            value={kpis?.completed_consultations ?? 0}
            subtitle="Consultations finished today"
            icon={<CheckCircleOutlineIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <KpiCard
            title="New Patients Today"
            value={kpis?.new_patients_today ?? 0}
            subtitle="Registered today"
            icon={<PeopleOutlinedIcon />}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <KpiCard
            title="Today's Revenue"
            value={kpis?.today_revenue != null ? `₹${kpis.today_revenue.toLocaleString("en-IN")}` : "₹0"}
            subtitle="Collected today"
            icon={<ReceiptOutlinedIcon />}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Secondary section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Appointment Queue Today</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box display="flex" gap={3}>
              <Box textAlign="center">
                <Typography variant="h4" fontWeight={700} color="warning.main">
                  {kpis?.checked_in_patients ?? 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">Checked In</Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h4" fontWeight={700} color="primary.main">
                  {kpis?.completed_consultations ?? 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">Completed</Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h4" fontWeight={700} color="error.main">
                  {kpis?.pending_bills ?? 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">Pending Bills</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider", borderRadius: 2, height: "100%" }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Platform Status</Typography>
            <Divider sx={{ mb: 2 }} />
            {[
              { label: "API Services", status: "Operational" },
              { label: "Database", status: "Operational" },
              { label: "Notifications", status: "Operational" },
              { label: "Storage", status: "Operational" },
            ].map((item) => (
              <Box key={item.label} display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                <Typography variant="body2">{item.label}</Typography>
                <Chip label={item.status} size="small" color="success" variant="outlined" />
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
