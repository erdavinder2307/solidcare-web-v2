import React from "react";
import { Alert, Box, Chip, Typography } from "@mui/material";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

export interface AllergyBannerProps {
  allergies: string[];
}

/** Prominent clinical safety banner for patient charts. */
export function AllergyBanner({ allergies }: AllergyBannerProps) {
  if (!allergies.length) return null;

  return (
    <Alert
      role="alert"
      severity="error"
      icon={<WarningAmberOutlinedIcon fontSize="inherit" />}
      sx={{
        mb: 2,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "error.light",
        alignItems: "flex-start",
        "& .MuiAlert-message": { width: "100%" },
      }}
    >
      <Typography variant="subtitle2" fontWeight={700} gutterBottom>
        Allergy alert
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={0.75}>
        {allergies.map((allergy) => (
          <Chip
            key={allergy}
            label={allergy}
            size="small"
            color="error"
            variant="outlined"
            sx={{ fontWeight: 600, bgcolor: "background.paper" }}
          />
        ))}
      </Box>
    </Alert>
  );
}
