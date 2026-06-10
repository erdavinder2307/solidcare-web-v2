import React from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useUIStore } from "@/app/store/uiStore";

const SIDEBAR_WIDTH = 260;
const COLLAPSED_WIDTH = 72;
const TOPBAR_HEIGHT = 64;

export function AppShell() {
  const { sidebarOpen } = useUIStore();
  const drawerWidth = sidebarOpen ? SIDEBAR_WIDTH : COLLAPSED_WIDTH;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: `${drawerWidth}px`,
          transition: "margin 0.2s ease",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Topbar />
        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            mt: `${TOPBAR_HEIGHT}px`,
            maxWidth: "100%",
            overflow: "hidden",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
