import React, { useEffect } from "react";
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
  { title: "Audit logging", description: "Append-only audit trail capturing sensitive actions and PHI access patterns for accountability and regulatory review." },
  { title: "Transport security", description: "TLS enforced on all production connections between clients, API, and database." },
  { title: "Cloud infrastructure", description: "Hosted on Microsoft Azure — PostgreSQL Flexible Server, Blob Storage, and App Service within Azure India regions." },
  { title: "Data residency — India", description: "All patient data is stored and processed in Azure India regions (Central India / South India). Data does not leave Indian jurisdiction." },
  { title: "DPDP Act 2023 alignment", description: "Infrastructure and data handling practices are being aligned with India's Digital Personal Data Protection Act 2023, including data minimisation, purpose limitation, and patient consent workflows." },
];

const FAQ_LD_JSON = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is patient data stored in India?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. All patient data is stored and processed in Microsoft Azure India regions (Central India / South India). Data does not leave Indian jurisdiction.",
      },
    },
    {
      "@type": "Question",
      name: "Does Solidcare support multi-factor authentication?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Solidcare supports TOTP-based MFA with backup codes for all staff accounts, configurable per organisation.",
      },
    },
    {
      "@type": "Question",
      name: "Is Solidcare compliant with India's DPDP Act 2023?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Solidcare's infrastructure and data handling practices are being aligned with India's Digital Personal Data Protection Act 2023, including data minimisation, purpose limitation, and patient consent workflows.",
      },
    },
    {
      "@type": "Question",
      name: "What access controls does Solidcare provide?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Solidcare provides resource-level role-based access control (RBAC) with distinct roles for superadmin, organisation admin, doctor, receptionist, billing staff, and nurse. Permissions are enforced at the API layer.",
      },
    },
    {
      "@type": "Question",
      name: "Does Solidcare provide audit logging for clinical actions?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Solidcare maintains an append-only audit trail capturing sensitive clinical actions and PHI access patterns, suitable for accountability and regulatory review requirements.",
      },
    },
  ],
};

export default function SecurityPage() {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(FAQ_LD_JSON);
    document.head.appendChild(script);
    return () => script.remove();
  }, []);
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
          interoperability. HIPAA-aligned infrastructure patterns are planned for US market expansion.
          Formal third-party security certifications (ISO 27001, SOC 2) are on the product roadmap. We do not
          claim certification until formally achieved.
        </Typography>
      </SectionContainer>
      <SectionContainer bgcolor="grey.50" py={6}>
        <DemoCta title="Discuss your security requirements" />
      </SectionContainer>
    </>
  );
}
