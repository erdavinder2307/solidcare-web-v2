import React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Link as RouterLink } from "react-router-dom";
import { COMPANY } from "../config/site";

interface DemoCtaProps {
  title?: string;
  subtitle?: string;
  variant?: "section" | "inline";
}

export function DemoCta({
  title = "See Solidcare in action",
  subtitle = "Talk to our team on WhatsApp to schedule a walkthrough for your clinic or hospital.",
  variant = "section",
}: DemoCtaProps) {
  const content = (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      alignItems={variant === "section" ? { xs: "stretch", sm: "center" } : "center"}
      justifyContent="space-between"
    >
      <Box sx={{ flex: 1 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom={!!subtitle}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body1" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ flexShrink: 0 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<WhatsAppIcon />}
          href={COMPANY.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Request Demo
        </Button>
        <Button variant="outlined" size="large" component={RouterLink} to="/contact">
          Contact Us
        </Button>
      </Stack>
    </Stack>
  );

  if (variant === "inline") {
    return content;
  }

  return (
    <Box
      sx={{
        p: { xs: 3, md: 5 },
        borderRadius: 3,
        bgcolor: "primary.main",
        color: "primary.contrastText",
        "& .MuiTypography-root": { color: "inherit" },
        "& .MuiButton-outlined": {
          borderColor: "rgba(255,255,255,0.6)",
          color: "white",
          "&:hover": { borderColor: "white", bgcolor: "rgba(255,255,255,0.08)" },
        },
        "& .MuiButton-contained": {
          bgcolor: "white",
          color: "primary.main",
          "&:hover": { bgcolor: "grey.100" },
        },
      }}
    >
      {content}
    </Box>
  );
}
