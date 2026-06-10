import React from "react";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import theme from "@/lib/theme/theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
