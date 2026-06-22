import { Box, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { NotificationDrawer } from "./NotificationDrawer";
import { CommandPalette } from "./CommandPalette";
import { useUIStore } from "@/app/store/uiStore";
import { useLayoutDimensions } from "@/shared/layout/useLayoutDimensions";
import { densityTokens } from "@/lib/theme/tokens";

export function AppShell() {
  const { topbarHeight } = useLayoutDimensions();
  const toggleCommandPalette = useUIStore((s) => s.toggleCommandPalette);
  const theme = useTheme();
  const pagePadding = densityTokens[theme.solidcare.density].pagePadding;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        toggleCommandPalette();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleCommandPalette]);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Accessibility: skip navigation link */}
      <Box
        component="a"
        href="#main-content"
        sx={{
          position: "absolute",
          top: -9999,
          left: -9999,
          zIndex: 9999,
          bgcolor: "primary.main",
          color: "primary.contrastText",
          px: 2,
          py: 1,
          borderRadius: 1,
          fontSize: "0.875rem",
          fontWeight: 600,
          "&:focus": { top: 8, left: 8 },
        }}
      >
        Skip to main content
      </Box>

      <Sidebar />
      <NotificationDrawer />
      <CommandPalette />

      <Box
        component="main"
        id="main-content"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Topbar />
        <Box
          component="section"
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            mt: `${topbarHeight}px`,
            minHeight: `calc(100vh - ${topbarHeight}px)`,
            overflow: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <Box
            sx={{
              flex: 1,
              px: { xs: 1.5, sm: 2, md: `${pagePadding}px` },
              py: { xs: 1.5, sm: 2, md: `${pagePadding}px` },
              maxWidth: "100%",
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
