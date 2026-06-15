import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { LAYOUT } from "@/shared/layout/constants";
import type { DensityMode } from "@/lib/theme/tokens";

interface UIState {
  sidebarOpen: boolean;
  mobileNavOpen: boolean;
  notificationDrawerOpen: boolean;
  commandPaletteOpen: boolean;
  density: DensityMode;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setMobileNavOpen: (open: boolean) => void;
  closeMobileNav: () => void;
  setDensity: (density: DensityMode) => void;
  toggleNotificationDrawer: () => void;
  closeNotificationDrawer: () => void;
  toggleCommandPalette: () => void;
  closeCommandPalette: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      mobileNavOpen: false,
      notificationDrawerOpen: false,
      commandPaletteOpen: false,
      density: "comfortable",
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
      closeMobileNav: () => set({ mobileNavOpen: false }),
      setDensity: (density) => set({ density }),
      toggleNotificationDrawer: () => set((s) => ({ notificationDrawerOpen: !s.notificationDrawerOpen })),
      closeNotificationDrawer: () => set({ notificationDrawerOpen: false }),
      toggleCommandPalette: () => set((s) => ({ commandPaletteOpen: !s.commandPaletteOpen })),
      closeCommandPalette: () => set({ commandPaletteOpen: false }),
    }),
    {
      name: "solidcare-ui",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
        density: state.density,
      }),
    },
  ),
);

/** @deprecated Use LAYOUT from @/shared/layout instead. */
export const sidebarWidth = LAYOUT.SIDEBAR_WIDTH;
