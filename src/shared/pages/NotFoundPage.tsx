import React from "react";
import { Box, Button, Typography } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { Link as RouterLink } from "react-router-dom";
import { PageLayout } from "@/shared/layout";

export default function NotFoundPage() {
  return (
    <PageLayout maxWidth={480}>
      <Box
        sx={{
          py: { xs: 6, md: 10 },
          textAlign: "center",
        }}
      >
        <Typography variant="h3" fontWeight={700} color="text.primary" gutterBottom>
          404
        </Typography>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Page not found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          The page you are looking for does not exist or you may not have access to it.
        </Typography>
        <Button
          variant="contained"
          component={RouterLink}
          to="/dashboard"
          startIcon={<HomeOutlinedIcon />}
        >
          Back to dashboard
        </Button>
      </Box>
    </PageLayout>
  );
}
