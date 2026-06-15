import React from "react";
import { Box, Button, Typography } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { Link as RouterLink } from "react-router-dom";
import { PageMeta } from "../components/PageMeta";
import { SectionContainer } from "../components/SectionContainer";

export default function PublicNotFoundPage() {
  return (
    <>
      <PageMeta title="Page Not Found" description="The page you requested could not be found." path="/404" noIndex />
      <SectionContainer py={12}>
        <Box sx={{ textAlign: "center", maxWidth: 480, mx: "auto" }}>
          <Typography variant="h2" fontWeight={700} gutterBottom>
            404
          </Typography>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Page not found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            The page you are looking for does not exist or may have moved.
          </Typography>
          <Button variant="contained" component={RouterLink} to="/" startIcon={<HomeOutlinedIcon />}>
            Back to Home
          </Button>
        </Box>
      </SectionContainer>
    </>
  );
}
