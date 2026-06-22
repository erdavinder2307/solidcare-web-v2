import React from "react";
import { Box, Button, Chip, Divider, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import CheckIcon from "@mui/icons-material/Check";
import { Link as RouterLink } from "react-router-dom";
import { PageMeta } from "../components/PageMeta";
import { MarketingHero } from "../components/MarketingHero";
import { SectionContainer } from "../components/SectionContainer";
import { DemoCta } from "../components/DemoCta";
import { COMPANY } from "../config/site";

interface PlanFeature {
  text: string;
}

interface Plan {
  name: string;
  badge?: string;
  tagline: string;
  price: string;
  priceNote: string;
  features: PlanFeature[];
  ctaLabel: string;
  ctaHref?: string;
  ctaTo?: string;
  highlighted?: boolean;
}

const PLANS: Plan[] = [
  {
    name: "Clinic",
    tagline: "For single-speciality and small multi-doctor clinics.",
    price: "Contact for pricing",
    priceNote: "Tailored to your clinic size and modules required.",
    features: [
      { text: "Single clinic" },
      { text: "Up to 3 doctors" },
      { text: "Patient registry & UHID management" },
      { text: "Appointments, check-in & queue" },
      { text: "Clinical encounters & vitals" },
      { text: "E-prescriptions with PDF generation" },
      { text: "Basic billing & invoicing" },
      { text: "RBAC — reception, doctor, billing roles" },
      { text: "In-app notifications" },
      { text: "Email support" },
    ],
    ctaLabel: "Request pricing",
    ctaHref: COMPANY.whatsappUrl,
  },
  {
    name: "Growth",
    badge: "Most popular",
    tagline: "For multi-doctor and multi-speciality clinics.",
    price: "Contact for pricing",
    priceNote: "Includes all Clinic features plus advanced modules.",
    features: [
      { text: "Single clinic, unlimited doctors" },
      { text: "Everything in Clinic" },
      { text: "GST-compliant billing & service charge master" },
      { text: "Lab orders & results management" },
      { text: "Reports & KPI dashboards" },
      { text: "Audit logging & PHI access trails" },
      { text: "TOTP-based MFA for all staff" },
      { text: "Document storage (Azure Blob)" },
      { text: "Priority support" },
    ],
    ctaLabel: "Request pricing",
    ctaHref: COMPANY.whatsappUrl,
    highlighted: true,
  },
  {
    name: "Enterprise",
    tagline: "For hospitals, healthcare chains, and multi-site operations.",
    price: "Contact Sales",
    priceNote: "Custom deployment, onboarding, and SLA included.",
    features: [
      { text: "Multiple clinics & multi-site management" },
      { text: "Everything in Growth" },
      { text: "Organization-level administration" },
      { text: "Custom RBAC roles and permission sets" },
      { text: "ABDM/ABHA integration roadmap access" },
      { text: "FHIR R4 interoperability preparation" },
      { text: "Dedicated onboarding and training" },
      { text: "SLA commitment and uptime reporting" },
      { text: "Custom deployment options" },
      { text: "Dedicated account manager" },
    ],
    ctaLabel: "Contact Sales",
    ctaTo: "/contact",
  },
];

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <Box
      sx={{
        p: { xs: 3, md: 4 },
        height: "100%",
        borderRadius: 3,
        border: "2px solid",
        borderColor: plan.highlighted ? "primary.main" : "divider",
        bgcolor: plan.highlighted ? "primary.main" : "background.paper",
        color: plan.highlighted ? "primary.contrastText" : "inherit",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {plan.badge && (
        <Chip
          label={plan.badge}
          size="small"
          sx={{
            position: "absolute",
            top: -14,
            left: "50%",
            transform: "translateX(-50%)",
            bgcolor: "white",
            color: "primary.main",
            fontWeight: 700,
            border: "2px solid",
            borderColor: "primary.main",
            fontSize: "0.75rem",
          }}
        />
      )}

      <Typography
        variant="overline"
        sx={{
          fontWeight: 700,
          letterSpacing: 1.2,
          color: plan.highlighted ? "rgba(255,255,255,0.8)" : "primary.main",
          display: "block",
          mb: 0.5,
        }}
      >
        {plan.name}
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: plan.highlighted ? "rgba(255,255,255,0.75)" : "text.secondary", mb: 3, minHeight: 40 }}
      >
        {plan.tagline}
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700} sx={{ lineHeight: 1.2 }}>
          {plan.price}
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: plan.highlighted ? "rgba(255,255,255,0.65)" : "text.secondary" }}
        >
          {plan.priceNote}
        </Typography>
      </Box>

      <Divider sx={{ mb: 3, borderColor: plan.highlighted ? "rgba(255,255,255,0.2)" : "divider" }} />

      <Stack spacing={1.25} sx={{ flex: 1, mb: 4 }}>
        {plan.features.map((f) => (
          <Box key={f.text} sx={{ display: "flex", gap: 1.25, alignItems: "flex-start" }}>
            <CheckIcon
              sx={{
                fontSize: 16,
                mt: 0.25,
                flexShrink: 0,
                color: plan.highlighted ? "rgba(255,255,255,0.9)" : "primary.main",
              }}
            />
            <Typography
              variant="body2"
              sx={{ color: plan.highlighted ? "rgba(255,255,255,0.85)" : "text.primary", lineHeight: 1.5 }}
            >
              {f.text}
            </Typography>
          </Box>
        ))}
      </Stack>

      {plan.ctaHref ? (
        <Button
          variant={plan.highlighted ? "contained" : "outlined"}
          size="large"
          fullWidth
          href={plan.ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          sx={
            plan.highlighted
              ? { bgcolor: "white", color: "primary.main", "&:hover": { bgcolor: "grey.100" } }
              : {}
          }
        >
          {plan.ctaLabel}
        </Button>
      ) : (
        <Button
          variant={plan.highlighted ? "contained" : "outlined"}
          size="large"
          fullWidth
          component={RouterLink}
          to={plan.ctaTo ?? "/contact"}
          sx={
            plan.highlighted
              ? { bgcolor: "white", color: "primary.main", "&:hover": { bgcolor: "grey.100" } }
              : {}
          }
        >
          {plan.ctaLabel}
        </Button>
      )}
    </Box>
  );
}

export default function PricingPage() {
  return (
    <>
      <PageMeta
        title="Pricing"
        description="Solidcare pricing for clinics, hospitals, and healthcare chains in India — flexible plans tailored to your scale and modules."
        path="/pricing"
      />
      <MarketingHero
        eyebrow="Pricing"
        title="Plans for every scale of healthcare operations"
        subtitle="Pricing is tailored to your clinic size, required modules, and deployment. Contact us to discuss what fits your practice."
      />

      <SectionContainer>
        <Grid container spacing={3} alignItems="stretch">
          {PLANS.map((plan) => (
            <Grid key={plan.name} size={{ xs: 12, md: 4 }}>
              <PlanCard plan={plan} />
            </Grid>
          ))}
        </Grid>

        {/* Trust note below plans */}
        <Box
          sx={{
            mt: 6,
            p: 3,
            borderRadius: 2,
            bgcolor: "grey.50",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="subtitle2" fontWeight={700} gutterBottom>
            All plans include
          </Typography>
          <Grid container spacing={1} sx={{ mt: 1 }}>
            {[
              "Azure India data residency",
              "TLS encryption in transit",
              "Regular backups",
              "RBAC for staff roles",
              "Immutable audit logging",
              "ABDM-ready architecture",
            ].map((item) => (
              <Grid key={item} size={{ xs: 12, sm: 6, md: 4 }}>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <CheckIcon sx={{ fontSize: 14, color: "primary.main" }} />
                  <Typography variant="body2" color="text.secondary">
                    {item}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </SectionContainer>

      <SectionContainer bgcolor="grey.50" py={6}>
        <DemoCta
          title="Not sure which plan fits your practice?"
          subtitle="Speak with our team — we will recommend the right configuration for your clinic, hospital, or healthcare chain."
        />
      </SectionContainer>
    </>
  );
}
