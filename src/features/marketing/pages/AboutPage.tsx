import React, { useEffect } from "react";
import { Box, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import { PageMeta } from "../components/PageMeta";
import { MarketingHero } from "../components/MarketingHero";
import { SectionContainer } from "../components/SectionContainer";
import { DemoCta } from "../components/DemoCta";
import { COMPANY, SITE } from "../config/site";

const MILESTONES = [
  {
    year: "2018",
    title: "Solidev Electrosoft founded",
    description: "Software consultancy established in Mohali, Punjab — delivering systems for healthcare, finance, and regulated industries.",
  },
  {
    year: "2024",
    title: "Solidcare V2 architecture designed",
    description: "Modular monolith on Azure India — React 19, FastAPI, PostgreSQL — built to support the full OPD patient workflow end-to-end.",
  },
  {
    year: "2025",
    title: "Core clinical workflow released",
    description: "Patient registry, appointments, queue management, clinical encounters, ICD-10 diagnosis, drug-allergy alerts, and e-prescriptions shipped to production.",
  },
  {
    year: "2026",
    title: "Platform reaches operational completeness",
    description: "GST-compliant billing, lab orders, reports & KPIs, multi-clinic management, RBAC, MFA, and immutable audit logging — Solidcare is a full OPD operations platform.",
  },
];

const VALUES = [
  {
    icon: AutoAwesomeOutlinedIcon,
    title: "Clinical accuracy over feature velocity",
    description:
      "We do not ship features that could compromise clinical data integrity. Every module is reviewed against real clinic workflows before release.",
  },
  {
    icon: FlagOutlinedIcon,
    title: "Indian healthcare context, not bolted on",
    description:
      "UHID patient identity, ABDM readiness, GST-compliant billing, and OPD queue management are first-class concerns — not afterthoughts.",
  },
  {
    icon: VerifiedOutlinedIcon,
    title: "Honest transparency",
    description:
      "We do not claim certifications we have not achieved or compliance we have not verified. Platform capabilities are documented accurately.",
  },
  {
    icon: ShieldOutlinedIcon,
    title: "Enterprise discipline from day one",
    description:
      "RBAC, MFA, audit trails, and data residency are baseline features — not premium add-ons — because healthcare data demands it.",
  },
];

export default function AboutPage() {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: COMPANY.legalName,
      url: SITE.domain,
      logo: `${SITE.domain}/og.png`,
      foundingDate: String(COMPANY.founded),
      email: COMPANY.email,
      telephone: COMPANY.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Next57 Coworking, Cabin No. 11, C205 SM Heights, Industrial Area Phase 8B",
        addressLocality: "Mohali",
        addressRegion: "Punjab",
        postalCode: "140308",
        addressCountry: "IN",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: COMPANY.phone,
        contactType: "sales",
        availableLanguage: "English",
      },
    });
    document.head.appendChild(script);
    return () => script.remove();
  }, []);

  return (
    <>
      <PageMeta
        title="About Us"
        description="About Solidcare — a healthcare operations platform by Solidev Electrosoft, built for clinics and hospitals in India since 2018."
        path="/about"
      />
      <MarketingHero
        eyebrow="About"
        title="Healthcare software built by engineers who ship to production"
        subtitle="Solidcare is developed by Solidev Electrosoft — a software team with deep experience delivering systems for healthcare, finance, and regulated industries."
      />

      {/* Mission */}
      <SectionContainer>
        <Box
          sx={{
            p: { xs: 3, md: 4 },
            mb: 6,
            borderRadius: 3,
            bgcolor: "primary.main",
            color: "primary.contrastText",
          }}
        >
          <Typography variant="overline" sx={{ opacity: 0.75, display: "block", mb: 1 }}>
            Our mission
          </Typography>
          <Typography variant="h5" fontWeight={700} sx={{ maxWidth: 720 }}>
            Eliminate the operational fragmentation that costs Indian clinics time, money, and clinical
            accuracy — by replacing disconnected tools with one platform built for the full patient journey.
          </Typography>
        </Box>

        {/* Why we built it */}
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Why we built Solidcare
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 720, fontSize: "1rem", lineHeight: 1.8 }}>
          We saw the same problem across clinic after clinic in India: reception uses one system to register
          patients, the doctor uses a different tool (or paper) for consultation notes, and billing exports
          spreadsheets to calculate what to charge. Every handoff creates delay, data loss, and friction for
          patients and staff.
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 720, fontSize: "1rem", lineHeight: 1.8 }}>
          Solidcare was built to remove that fragmentation. One platform connects the front desk, the clinical
          workspace, and the billing counter — sharing a single patient record from registration through
          discharge. The result is faster consultations, accurate billing, and a complete audit trail for
          every patient visit.
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 720, fontSize: "1rem", lineHeight: 1.8 }}>
          We built it for Indian healthcare — with UHID patient identity, ABDM readiness, GST-compliant
          invoicing, and queue-token workflows that reflect how Indian OPD clinics actually operate. And we
          built it with enterprise discipline: RBAC, MFA, immutable audit logging, and data residency in
          Azure India regions from the first deployment.
        </Typography>
      </SectionContainer>

      {/* Milestones */}
      <SectionContainer bgcolor="grey.50">
        <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 4 }}>
          Platform milestones
        </Typography>
        <Stack spacing={0}>
          {MILESTONES.map((m, i) => (
            <Box
              key={m.year}
              sx={{
                display: "flex",
                gap: { xs: 2, md: 4 },
                pb: 4,
                position: "relative",
                "&::before": i < MILESTONES.length - 1
                  ? {
                    content: '""',
                    position: "absolute",
                    left: { xs: "19px", md: "27px" },
                    top: "36px",
                    bottom: 0,
                    width: "2px",
                    bgcolor: "divider",
                  }
                  : {},
              }}
            >
              {/* Year badge */}
              <Box
                sx={{
                  flexShrink: 0,
                  width: { xs: 40, md: 56 },
                  height: { xs: 40, md: 56 },
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
              >
                <Typography variant="caption" fontWeight={700} sx={{ fontSize: { xs: "0.6rem", md: "0.7rem" }, lineHeight: 1.2, textAlign: "center" }}>
                  {m.year}
                </Typography>
              </Box>
              <Box sx={{ pt: { xs: 0.75, md: 1.25 } }}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  {m.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {m.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      </SectionContainer>

      {/* Values */}
      <SectionContainer>
        <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 4 }}>
          How we work
        </Typography>
        <Grid container spacing={3}>
          {VALUES.map(({ icon: Icon, title, description }) => (
            <Grid key={title} size={{ xs: 12, sm: 6 }}>
              <Box
                sx={{
                  p: 3,
                  height: "100%",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "background.paper",
                }}
              >
                <Icon sx={{ color: "primary.main", mb: 1.5, fontSize: 28 }} />
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  {title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </SectionContainer>

      {/* Company details */}
      <SectionContainer bgcolor="grey.50" py={5}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          {COMPANY.legalName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Founded {COMPANY.founded} · Mohali, Punjab, India
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {COMPANY.address}
        </Typography>
      </SectionContainer>

      <SectionContainer py={6}>
        <DemoCta
          title="Meet the team behind Solidcare"
          subtitle="Request a demo and speak directly with the engineers and product team who built the platform."
        />
      </SectionContainer>
    </>
  );
}
