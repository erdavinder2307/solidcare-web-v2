import React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import { Link as RouterLink } from "react-router-dom";
import { PageMeta } from "./PageMeta";
import { MarketingHero } from "./MarketingHero";
import { SectionContainer } from "./SectionContainer";
import { DemoCta } from "./DemoCta";
import { COMPANY } from "../config/site";

interface ComingSoonPageProps {
  featureName: string;
  description: string;
  availability?: string;
  path: string;
}

export function ComingSoonPage({
  featureName,
  description,
  availability = "In development — expected Q3 2026",
  path,
}: ComingSoonPageProps) {
  return (
    <>
      <PageMeta
        title={`${featureName} — Coming Soon`}
        description={description}
        path={path}
      />
      <MarketingHero
        eyebrow="Coming Soon"
        title={featureName}
        subtitle={description}
        compact
      >
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2 }}>
          <ScheduleOutlinedIcon color="primary" fontSize="small" />
          <Typography variant="body2" color="text.secondary">
            {availability}
          </Typography>
        </Stack>
      </MarketingHero>
      <SectionContainer>
        <Box sx={{ maxWidth: 640, mx: "auto", textAlign: "center" }}>
          <Typography variant="body1" color="text.secondary" paragraph>
            We are actively building this capability as part of the Solidcare platform roadmap.
            Request a demo to see what is available today and discuss your requirements.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
            <Button variant="contained" href={COMPANY.whatsappUrl} target="_blank" rel="noopener noreferrer">
              Request Demo on WhatsApp
            </Button>
            <Button variant="outlined" component={RouterLink} to="/contact">
              Contact Us
            </Button>
            <Button variant="text" component={RouterLink} to="/">
              Back to Home
            </Button>
          </Stack>
        </Box>
      </SectionContainer>
      <SectionContainer bgcolor="grey.50" py={6}>
        <DemoCta />
      </SectionContainer>
    </>
  );
}
