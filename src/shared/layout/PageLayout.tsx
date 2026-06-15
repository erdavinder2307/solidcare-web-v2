import React from "react";
import { Box } from "@mui/material";

export interface PageLayoutProps {
  children: React.ReactNode;
  /** Max content width; defaults to full workspace width. Use LAYOUT.FORM_MAX_WIDTH for forms. */
  maxWidth?: number | "none";
  /** Skip horizontal padding when nested inside another layout. */
  disablePadding?: boolean;
}

export function PageLayout({
  children,
  maxWidth = "none",
  disablePadding = false,
}: PageLayoutProps) {
  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        maxWidth: maxWidth === "none" ? "none" : maxWidth,
        mx: 0,
        px: disablePadding ? 0 : 0,
      }}
    >
      {children}
    </Box>
  );
}
