import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Box, Button, Stack, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link as RouterLink } from "react-router-dom";
import { useAuthStore } from "@/app/store/authStore";
import { PageMeta } from "../components/PageMeta";
import { SectionContainer } from "../components/SectionContainer";
import { TrustStrip } from "../components/TrustStrip";
import { FeatureGrid } from "../components/FeatureGrid";
import { DemoCta } from "../components/DemoCta";
import { SITE, COMPANY } from "../config/site";

const MODULES = [
  {
    title: "Patient registry",
    description: "Unified patient profiles with demographics, history, documents, and timeline views.",
  },
  {
    title: "Appointments & queue",
    description: "Scheduling, check-in, waiting room, and real-time queue management for busy clinics.",
  },
  {
    title: "Clinical encounters",
    description: "Doctor workspace, consultation notes, vitals capture, and structured encounter documentation.",
  },
  {
    title: "E-prescriptions",
    description: "Create, finalize, and print prescriptions with medication history linked to encounters.",
  },
  {
    title: "Billing & invoicing",
    description: "Service charges, invoices, payments, and receipts integrated with patient visits.",
  },
  {
    title: "Administration & audit",
    description: "Multi-clinic management, RBAC, MFA, and immutable audit trails for accountability.",
  },
];

export default function HomePage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: SITE.name,
      applicationCategory: "HealthApplication",
      operatingSystem: "Web",
      url: SITE.domain,
      description: SITE.description,
      provider: {
        "@type": "Organization",
        name: COMPANY.legalName,
        url: COMPANY.parentWebsite,
        email: COMPANY.email,
        address: COMPANY.address,
      },
    });
    document.head.appendChild(script);
    return () => script.remove();
  }, []);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <PageMeta
        title="Solidcare — Healthcare Operations Platform for India"
        description={SITE.description}
        path="/"
      />
      <Box
        sx={{
          background: "linear-gradient(180deg, #EEF2FF 0%, #F8FAFC 40%, #FFFFFF 100%)",
          py: { xs: 8, md: 14 },
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <SectionContainer py={0}>
          <Box sx={{ maxWidth: 820 }}>
            <Typography
              variant="overline"
              sx={{ color: "primary.main", fontWeight: 700, letterSpacing: 1.5, display: "block", mb: 2 }}
            >
              Healthcare operations platform
            </Typography>
            <Typography
              component="h1"
              variant="h2"
              fontWeight={700}
              sx={{ fontSize: { xs: "2.25rem", md: "3.25rem" }, lineHeight: 1.15, mb: 2 }}
            >
              Run your clinic or hospital on one secure platform
            </Typography>
            <Typography variant="h6" color="text.secondary" fontWeight={400} sx={{ mb: 4, maxWidth: 640 }}>
              Solidcare unifies patients, appointments, clinical workflows, prescriptions, and billing — built for
              Indian healthcare providers and architected for enterprise scale.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                variant="contained"
                size="large"
                href="https://wa.me/919115866828?text=Hi%2C%20I%27d%20like%20to%20request%20a%20Solidcare%20demo."
                target="_blank"
                rel="noopener noreferrer"
              >
                Request Demo on WhatsApp
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={RouterLink}
                to="/platform"
                endIcon={<ArrowForwardIcon />}
              >
                Explore Platform
              </Button>
            </Stack>
          </Box>
        </SectionContainer>
      </Box>

      <SectionContainer py={6}>
        <TrustStrip />
      </SectionContainer>

      <SectionContainer bgcolor="grey.50">
        <FeatureGrid
          title="Everything your care team needs"
          subtitle="From front-desk registration to clinical documentation and billing — designed as one connected workflow."
          items={MODULES}
        />
      </SectionContainer>

      <SectionContainer py={6}>
        <DemoCta />
      </SectionContainer>
    </>
  );
}
