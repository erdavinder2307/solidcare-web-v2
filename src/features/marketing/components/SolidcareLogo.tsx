import React from "react";
import { Box, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

interface SolidcareLogoProps {
  size?: "sm" | "md";
}

export function SolidcareLogo({ size = "md" }: SolidcareLogoProps) {
  const iconSize = size === "sm" ? 28 : 36;

  return (
    <Box
      component={RouterLink}
      to="/"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1.25,
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <Box
        component="img"
        src="/appIcon.png"
        alt="Solidcare"
        sx={{
          width: iconSize,
          height: iconSize,
          objectFit: "contain",
          flexShrink: 0,
          display: "block",
        }}
      />
      <Typography
        variant={size === "sm" ? "subtitle1" : "h6"}
        fontWeight={700}
        color="primary.main"
        lineHeight={1}
        sx={{ whiteSpace: "nowrap" }}
      >
        Solidcare
      </Typography>
    </Box>
  );
}
