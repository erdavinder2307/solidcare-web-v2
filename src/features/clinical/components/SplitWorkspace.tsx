import React from "react";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid2";

export interface SplitWorkspaceProps {
  main: React.ReactNode;
  aside: React.ReactNode;
  /** Width of aside column on desktop (default 360). */
  asideWidth?: number;
}

/** Clinical split view — notes on the left, patient context on the right. */
export function SplitWorkspace({ main, aside, asideWidth = 360 }: SplitWorkspaceProps) {
  return (
    <Grid container spacing={3} alignItems="flex-start">
      <Grid size={{ xs: 12, lg: "grow" }}>
        <Box sx={{ minWidth: 0 }}>{main}</Box>
      </Grid>
      <Grid
        size={{ xs: 12, lg: "auto" }}
        sx={{
          width: { lg: asideWidth },
          maxWidth: "100%",
          position: { lg: "sticky" },
          top: { lg: 16 },
        }}
      >
        {aside}
      </Grid>
    </Grid>
  );
}
