import React from "react";
import { PageMeta } from "../components/PageMeta";
import { MarketingHero } from "../components/MarketingHero";
import { SectionContainer } from "../components/SectionContainer";
import { FeatureGrid } from "../components/FeatureGrid";
import { DemoCta } from "../components/DemoCta";
import { Typography } from "@mui/material";

const SECURITY_FEATURES = [
  { title: "Authentication", description: "JWT access tokens with short expiry, refresh token rotation, and optional TOTP-based MFA with backup codes." },
  { title: "Role-based access control", description: "Resource-level permissions for clinical, billing, admin, and superadmin roles across organizations and clinics." },
  { title: "Password security", description: "Bcrypt password hashing with account lockout after repeated failed login attempts." },
  { title: "Audit logging", description: "Append-only audit trail capturing sensitive actions and access patterns for accountability." },
  { title: "Transport security", description: "TLS enforced on all production connections between clients, API, and database." },
  { title: "Cloud infrastructure", description: "Hosted on Azure with PostgreSQL Flexible Server and Blob Storage for documents." },
];

export default function SecurityPage() {
  return (
    <>
      <PageMeta
        title="Security"
        description="Solidcare security — RBAC, MFA, audit logging, encryption, and cloud infrastructure designed for healthcare workloads."
        path="/security"
      />
      <MarketingHero
        eyebrow="Security"
        title="Security designed into the platform"
        subtitle="Solidcare applies healthcare-appropriate security controls from authentication through audit — without unsupported compliance claims."
      />
      <SectionContainer>
        <FeatureGrid items={SECURITY_FEATURES} columns={2} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 4, maxWidth: 720 }}>
          Solidcare is architected to support future integration with India&apos;s ABDM ecosystem and FHIR-based
          interoperability. HIPAA-aligned infrastructure patterns are planned for US market expansion. We do not
          claim third-party certification until formally achieved.
        </Typography>
      </SectionContainer>
      <SectionContainer bgcolor="grey.50" py={6}>
        <DemoCta title="Discuss your security requirements" />
      </SectionContainer>
    </>
  );
}
