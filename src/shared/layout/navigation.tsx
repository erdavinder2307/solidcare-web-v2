import React from "react";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import QueuePlayNextOutlinedIcon from "@mui/icons-material/QueuePlayNextOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import TodayOutlinedIcon from "@mui/icons-material/TodayOutlined";
import PersonPinOutlinedIcon from "@mui/icons-material/PersonPinOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PriceCheckOutlinedIcon from "@mui/icons-material/PriceCheckOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";

export interface NavItemConfig {
  label: string;
  icon: React.ReactNode;
  path: string;
  permission: string | null;
  /** If set, user must have at least one of these role slugs (superadmin always passes). */
  roles?: string[];
  excludePrefixes?: string[];
}

export interface NavGroupConfig {
  id: string;
  label: string;
  items: NavItemConfig[];
}

export const NAV_GROUPS: NavGroupConfig[] = [
  {
    id: "overview",
    label: "Overview",
    items: [
      { label: "Dashboard", icon: <DashboardOutlinedIcon />, path: "/dashboard", permission: null },
    ],
  },
  {
    id: "patients",
    label: "Patients",
    items: [
      { label: "Patient Registry", icon: <PeopleOutlinedIcon />, path: "/patients", permission: "patient:read" },
    ],
  },
  {
    id: "appointments",
    label: "Appointments",
    items: [
      {
        label: "Schedule",
        icon: <CalendarMonthOutlinedIcon />,
        path: "/appointments",
        permission: "appointment:read",
        excludePrefixes: ["/appointments/queue", "/appointments/calendar"],
      },
      {
        label: "Calendar",
        icon: <DateRangeOutlinedIcon />,
        path: "/appointments/calendar",
        permission: "appointment:read",
      },
      {
        label: "Waiting Room",
        icon: <QueuePlayNextOutlinedIcon />,
        path: "/appointments/queue",
        permission: "appointment:read",
      },
    ],
  },
  {
    id: "clinical",
    label: "Clinical",
    items: [
      {
        label: "My Today",
        icon: <TodayOutlinedIcon />,
        path: "/clinical/workspace",
        permission: "encounter:read",
        roles: ["doctor", "superadmin"],
      },
      {
        label: "Waiting Room",
        icon: <PersonPinOutlinedIcon />,
        path: "/clinical/workspace/waiting-room",
        permission: "encounter:read",
        roles: ["doctor", "superadmin"],
      },
      {
        label: "Encounters",
        icon: <MedicalServicesOutlinedIcon />,
        path: "/encounters",
        permission: "encounter:read",
      },
      {
        label: "Prescriptions",
        icon: <DescriptionOutlinedIcon />,
        path: "/prescriptions",
        permission: "prescription:read",
      },
    ],
  },
  {
    id: "billing",
    label: "Billing",
    items: [
      {
        label: "Invoices",
        icon: <ReceiptOutlinedIcon />,
        path: "/billing/invoices",
        permission: "billing:read",
      },
      {
        label: "Service Charges",
        icon: <PriceCheckOutlinedIcon />,
        path: "/billing/service-charges",
        permission: "billing:read",
      },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    items: [
      { label: "Analytics", icon: <BarChartOutlinedIcon />, path: "/reports", permission: "report:read" },
    ],
  },
  {
    id: "administration",
    label: "Administration",
    items: [
      {
        label: "Users",
        icon: <GroupOutlinedIcon />,
        path: "/admin/users",
        permission: "user:read",
        roles: ["superadmin", "admin"],
      },
      {
        label: "Clinics",
        icon: <LocalHospitalOutlinedIcon />,
        path: "/admin/clinics",
        permission: null,
        roles: ["superadmin", "admin"],
      },
      {
        label: "Doctors",
        icon: <PersonOutlinedIcon />,
        path: "/doctors",
        permission: "doctor:read",
        roles: ["superadmin", "admin"],
      },
      {
        label: "Audit Log",
        icon: <SecurityOutlinedIcon />,
        path: "/audit",
        permission: "audit:read",
        roles: ["superadmin", "admin"],
      },
    ],
  },
];

export const BOTTOM_NAV_ITEMS: NavItemConfig[] = [
  { label: "Settings", icon: <SettingsOutlinedIcon />, path: "/settings", permission: null },
];

export function isNavItemActive(pathname: string, path: string, excludePrefixes?: string[]) {
  if (pathname === path) return true;
  if (!pathname.startsWith(`${path}/`)) return false;
  if (excludePrefixes?.some((prefix) => pathname.startsWith(prefix))) return false;
  return true;
}

export function canSeeNavItem(
  item: NavItemConfig,
  can: (permission: string) => boolean,
  hasRole: (role: string) => boolean,
) {
  if (hasRole("superadmin")) return true;
  if (item.permission && !can(item.permission)) return false;
  if (item.roles?.length && !item.roles.some((role) => hasRole(role))) return false;
  return true;
}
