import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  Divider,
  Chip,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useUIStore } from "@/app/store/uiStore";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import QueuePlayNextOutlinedIcon from "@mui/icons-material/QueuePlayNextOutlined";

const SIDEBAR_WIDTH = 260;
const COLLAPSED_WIDTH = 72;

const navItems = [
  { label: "Dashboard", icon: <DashboardOutlinedIcon />, path: "/dashboard", permission: null },
  { label: "Patients", icon: <PeopleOutlinedIcon />, path: "/patients", permission: "patient:read" },
  { label: "Doctors", icon: <PersonOutlinedIcon />, path: "/doctors", permission: "doctor:read" },
  { label: "Appointments", icon: <CalendarMonthOutlinedIcon />, path: "/appointments", permission: "appointment:read" },
  { label: "Queue", icon: <QueuePlayNextOutlinedIcon />, path: "/appointments/queue", permission: "appointment:read" },
  { label: "Clinical", icon: <MedicalServicesOutlinedIcon />, path: "/encounters", permission: "encounter:read" },
  { label: "Prescriptions", icon: <DescriptionOutlinedIcon />, path: "/prescriptions", permission: "prescription:read" },
  { label: "Billing", icon: <ReceiptOutlinedIcon />, path: "/billing/invoices", permission: "billing:read" },
  { label: "Reports", icon: <BarChartOutlinedIcon />, path: "/reports", permission: "report:read" },
];

const bottomItems = [
  { label: "Settings", icon: <SettingsOutlinedIcon />, path: "/settings", permission: null },
];

export function Sidebar() {
  const { sidebarOpen } = useUIStore();
  const navigate = useNavigate();
  const location = useLocation();
  const drawerWidth = sidebarOpen ? SIDEBAR_WIDTH : COLLAPSED_WIDTH;

  const NavItem = ({ label, icon, path }: { label: string; icon: React.ReactNode; path: string }) => {
    const isActive = location.pathname === path || location.pathname.startsWith(path + "/");
    return (
      <Tooltip title={!sidebarOpen ? label : ""} placement="right" arrow>
        <ListItemButton
          selected={isActive}
          onClick={() => navigate(path)}
          sx={{ px: sidebarOpen ? 2 : 1.5, justifyContent: sidebarOpen ? "flex-start" : "center" }}
        >
          <ListItemIcon sx={{ minWidth: sidebarOpen ? 40 : "auto", color: isActive ? "primary.main" : "text.secondary" }}>
            {icon}
          </ListItemIcon>
          {sidebarOpen && <ListItemText primary={label} primaryTypographyProps={{ fontSize: "0.875rem", fontWeight: isActive ? 600 : 400 }} />}
        </ListItemButton>
      </Tooltip>
    );
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          transition: "width 0.2s ease",
          overflow: "hidden",
        },
      }}
    >
      {/* Logo / Brand */}
      <Box sx={{ px: sidebarOpen ? 2.5 : 1.5, py: 2, display: "flex", alignItems: "center", gap: 1.5, minHeight: 64 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            bgcolor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Typography variant="body2" fontWeight={700} color="white">S</Typography>
        </Box>
        {sidebarOpen && (
          <Box>
            <Typography variant="body1" fontWeight={700} color="primary.main" lineHeight={1.1}>
              Solidcare
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Healthcare Platform
            </Typography>
          </Box>
        )}
      </Box>

      <Divider />

      {/* Main nav */}
      <Box sx={{ flexGrow: 1, px: 1, py: 1.5, overflowY: "auto" }}>
        <List dense disablePadding>
          {navItems.map((item) => (
            <NavItem key={item.path} {...item} />
          ))}
        </List>
      </Box>

      <Divider />

      {/* Bottom nav */}
      <Box sx={{ px: 1, py: 1.5 }}>
        <List dense disablePadding>
          {bottomItems.map((item) => (
            <NavItem key={item.path} {...item} />
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
