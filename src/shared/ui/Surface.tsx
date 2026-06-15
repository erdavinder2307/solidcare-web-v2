import React from "react";
import { Paper, type PaperProps } from "@mui/material";

export interface SurfaceProps extends PaperProps {
  children: React.ReactNode;
}

/** Standard bordered surface — replaces repeated Paper + border sx across pages. */
export function Surface({ children, sx, ...props }: SurfaceProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        bgcolor: "background.paper",
        ...sx,
      }}
      {...props}
    >
      {children}
    </Paper>
  );
}
