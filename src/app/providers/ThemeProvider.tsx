import { useMemo } from "react";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import { createAppTheme } from "@/lib/theme/theme";
import { useUIStore } from "@/app/store/uiStore";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const density = useUIStore((s) => s.density);
  const theme = useMemo(() => createAppTheme(density), [density]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
