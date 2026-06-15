import React from "react";
import { PageMeta } from "../components/PageMeta";
import { MarketingHero } from "../components/MarketingHero";
import { SectionContainer } from "../components/SectionContainer";
import { DemoCta } from "../components/DemoCta";
import { Typography } from "@mui/material";
import { COMPANY } from "../config/site";

export default function AboutPage() {
  return (
    <>
      <PageMeta
        title="About Us"
        description="About Solidcare — a healthcare operations platform by Solidev Electrosoft, built for clinics and hospitals in India."
        path="/about"
      />
      <MarketingHero
        eyebrow="About"
        title="Healthcare software built by engineers who ship to production"
        subtitle="Solidcare is developed by Solidev Electrosoft — a software team with deep experience delivering systems for healthcare, finance, and regulated industries."
      />
      <SectionContainer>
        <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 720 }}>
          Solidcare was created to address a gap we saw repeatedly in Indian healthcare: fragmented tools for
          patients, clinical documentation, and billing. Reception uses one system, doctors another, and finance
          exports spreadsheets. Solidcare brings these workflows together in one platform designed for real clinic
          and hospital operations.
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 720 }}>
          Our team combines modern cloud architecture (React, FastAPI, PostgreSQL, Azure) with healthcare domain
          understanding — RBAC for clinical staff, audit trails for accountability, and a roadmap toward ABDM and
          FHIR interoperability for India's digital health ecosystem and future US expansion.
        </Typography>
        <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mt: 4 }}>
          {COMPANY.legalName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Founded {COMPANY.founded} · Mohali, Punjab, India
        </Typography>
      </SectionContainer>
      <SectionContainer bgcolor="grey.50" py={6}>
        <DemoCta />
      </SectionContainer>
    </>
  );
}
