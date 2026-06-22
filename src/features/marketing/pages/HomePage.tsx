import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Box, Button, Stack, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PersonSearchOutlinedIcon from "@mui/icons-material/PersonSearchOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import MedicationOutlinedIcon from "@mui/icons-material/MedicationOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import { Link as RouterLink } from "react-router-dom";
import { useAuthStore } from "@/app/store/authStore";
import { PageMeta } from "../components/PageMeta";
import { SectionContainer } from "../components/SectionContainer";
import { TrustStrip } from "../components/TrustStrip";
import { FeatureGrid } from "../components/FeatureGrid";
import { DemoCta } from "../components/DemoCta";
import { StatsBar } from "../components/StatsBar";
import { WorkflowSection } from "../components/WorkflowSection";
import { HeroVisual } from "../components/HeroVisual";
import { SITE, COMPANY } from "../config/site";

const MODULES = [
  { icon: PersonSearchOutlinedIcon, title: "Patient registry", description: "Unified patient profiles with demographics, history, documents, and timeline views." },
  { icon: CalendarMonthOutlinedIcon, title: "Appointments & queue", description: "Scheduling, check-in, waiting room, and real-time queue management for busy clinics." },
  { icon: LocalHospitalOutlinedIcon, title: "Clinical encounters", description: "Doctor workspace, SOAP notes, ICD-10 diagnosis, vitals capture, and lab order tracking." },
  { icon: MedicationOutlinedIcon, title: "E-prescriptions", description: "Create, finalize, and print prescriptions with drug-allergy alerts linked to encounters." },
  { icon: ReceiptLongOutlinedIcon, title: "Billing & invoicing", description: "GST-compliant invoices, service charges, payments, and receipts integrated with patient visits." },
  { icon: AdminPanelSettingsOutlinedIcon, title: "Administration & audit", description: "Multi-clinic management, RBAC, MFA, and immutable audit trails for accountability." },
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

      {/* Hero — two-column on desktop */}
      <Box
        sx={{
          background: "linear-gradient(180deg, #EEF2FF 0%, #F8FAFC 50%, #FFFFFF 100%)",
          py: { xs: 8, md: 10 },
          borderBottom: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        <SectionContainer py={0}>
          <Stack
            direction={{ xs: "column", lg: "row" }}
            alignItems={{ xs: "flex-start", lg: "center" }}
            spacing={{ xs: 6, lg: 8 }}
          >
            {/* Left: headline + CTAs */}
            <Box sx={{ maxWidth: { xs: "100%", lg: 520 }, flexShrink: 0 }}>
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
                sx={{ fontSize: { xs: "2.25rem", md: "3rem" }, lineHeight: 1.15, mb: 2.5 }}
              >
                Run your clinic or hospital on one secure platform
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                fontWeight={400}
                sx={{ mb: 4, maxWidth: 480, fontSize: { xs: "1rem", md: "1.125rem" }, lineHeight: 1.7 }}
              >
                Solidcare unifies patients, appointments, clinical workflows, prescriptions, and billing —
                built for Indian healthcare providers and architected for enterprise scale.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  href={COMPANY.whatsappUrl}
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

            {/* Right: product preview — desktop only */}
            <Box sx={{ display: { xs: "none", lg: "flex" }, flex: 1, justifyContent: "flex-end", minWidth: 0 }}>
              <HeroVisual />
            </Box>
          </Stack>
        </SectionContainer>
      </Box>

      {/* Stats bar */}
      <SectionContainer py={5}>
        <StatsBar />
      </SectionContainer>

      {/* Core modules */}
      <SectionContainer bgcolor="grey.50">
        <FeatureGrid
          title="Everything your care team needs"
          subtitle="From front-desk registration to clinical documentation and billing — designed as one connected workflow."
          items={MODULES}
        />
      </SectionContainer>

      {/* Patient journey workflow */}
      <SectionContainer>
        <WorkflowSection />
      </SectionContainer>

      {/* Security trust signals */}
      <SectionContainer bgcolor="grey.50" py={6}>
        <TrustStrip />
      </SectionContainer>

      {/* Demo CTA */}
      <SectionContainer py={6}>
        <DemoCta
          title="See the full patient journey in action"
          subtitle="Request a walkthrough to see registration, consultation, prescriptions, and billing running as one connected workflow."
        />
      </SectionContainer>
    </>
  );
}
