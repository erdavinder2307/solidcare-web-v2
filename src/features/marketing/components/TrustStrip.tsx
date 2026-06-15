import React from "react";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import CloudOutlinedIcon from "@mui/icons-material/CloudOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import HubOutlinedIcon from "@mui/icons-material/HubOutlined";

const ITEMS = [
  {
    icon: ShieldOutlinedIcon,
    title: "Role-based access control",
    description: "Granular permissions for clinical, admin, and billing staff.",
  },
  {
    icon: VerifiedUserOutlinedIcon,
    title: "MFA & audit trails",
    description: "Multi-factor authentication and immutable activity logging.",
  },
  {
    icon: HubOutlinedIcon,
    title: "Interoperability ready",
    description: "Architected for future ABDM and FHIR R4 integration.",
  },
  {
    icon: CloudOutlinedIcon,
    title: "Cloud-native on Azure",
    description: "Secure, scalable infrastructure designed for healthcare workloads.",
  },
];

export function TrustStrip() {
  return (
    <Grid container spacing={3}>
      {ITEMS.map(({ icon: Icon, title, description }) => (
        <Grid key={title} size={{ xs: 12, sm: 6, md: 3 }}>
          <Box sx={{ p: 2.5, height: "100%", borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
            <Icon sx={{ color: "primary.main", mb: 1.5 }} />
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}
