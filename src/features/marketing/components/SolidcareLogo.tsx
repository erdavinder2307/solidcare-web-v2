import React from "react";
import { Box, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

interface SolidcareLogoProps {
  size?: "sm" | "md";
}

export function SolidcareLogo({ size = "md" }: SolidcareLogoProps) {
  const iconSize = size === "sm" ? 32 : 40;
  const titleVariant = size === "sm" ? "subtitle1" : "h6";

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
        sx={{
          width: iconSize,
          height: iconSize,
          borderRadius: 1.5,
          bgcolor: "primary.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Typography variant="body1" fontWeight={700} color="white" lineHeight={1}>
          S
        </Typography>
      </Box>
      <Box>
        <Typography variant={titleVariant} fontWeight={700} color="primary.main" lineHeight={1.2}>
          Solidcare
        </Typography>
        {size === "md" && (
          <Typography variant="caption" color="text.secondary" lineHeight={1.2}>
            Healthcare Platform
          </Typography>
        )}
      </Box>
    </Box>
  );
}
