import React from "react";
import { Alert } from "@mui/material";

export function LegalReviewBanner() {
  return (
    <Alert severity="info" sx={{ mb: 4, borderRadius: 2 }}>
      <strong>Demonstration environment.</strong> This policy is a draft template aligned with the
      Solidcare application. It requires legal review before production use.
    </Alert>
  );
}
