import { useMediaQuery } from "@mui/material";
import { useUIStore } from "@/app/store/uiStore";
import { LAYOUT } from "./constants";

export function useLayoutDimensions() {
  const isMobile = useMediaQuery(`(max-width:${LAYOUT.MOBILE_BREAKPOINT - 1}px)`, {
    noSsr: true,
  });
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);

  const drawerWidth = sidebarOpen
    ? LAYOUT.SIDEBAR_WIDTH
    : LAYOUT.SIDEBAR_COLLAPSED_WIDTH;

  /** Horizontal offset for main content and top bar (0 on mobile — overlay drawer). */
  const mainOffset = isMobile ? 0 : drawerWidth;

  return {
    isMobile,
    sidebarOpen,
    drawerWidth,
    mainOffset,
    topbarHeight: LAYOUT.TOPBAR_HEIGHT,
  };
}
