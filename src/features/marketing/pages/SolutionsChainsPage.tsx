import React from "react";
import { PageMeta } from "../components/PageMeta";
import { MarketingHero } from "../components/MarketingHero";
import { SectionContainer } from "../components/SectionContainer";
import { FeatureGrid } from "../components/FeatureGrid";
import { DemoCta } from "../components/DemoCta";

const ITEMS = [
  { title: "Multi-clinic administration", description: "Manage organizations, clinics, and users from a central admin console." },
  { title: "Standardized workflows", description: "Consistent patient and billing processes across all locations in your network." },
  { title: "Centralized reporting", description: "Aggregate KPIs and operational metrics across the chain." },
  { title: "Role templates", description: "Deploy consistent RBAC patterns for doctors, reception, and billing staff." },
  { title: "Expansion ready", description: "Add new clinics without rebuilding your operational stack each time." },
];

export default function SolutionsChainsPage() {
  return (
    <>
      <PageMeta
        title="For Healthcare Chains"
        description="Multi-clinic healthcare software for chains and provider networks — centralized admin, standardized workflows, and reporting."
        path="/solutions/chains"
      />
      <MarketingHero
        eyebrow="Solutions"
        title="Scale operations across your healthcare network"
        subtitle="Solidcare is designed for healthcare chains that need consistent processes, centralized governance, and location-level flexibility."
      />
      <SectionContainer>
        <FeatureGrid items={ITEMS} columns={2} />
      </SectionContainer>
      <SectionContainer py={6}>
        <DemoCta
          title="Plan your healthcare chain rollout"
          subtitle="Discuss multi-clinic architecture, centralized governance, and how Solidcare scales across your network."
        />
      </SectionContainer>
    </>
  );
}
