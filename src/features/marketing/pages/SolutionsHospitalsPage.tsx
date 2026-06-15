import React from "react";
import { PageMeta } from "../components/PageMeta";
import { MarketingHero } from "../components/MarketingHero";
import { SectionContainer } from "../components/SectionContainer";
import { FeatureGrid } from "../components/FeatureGrid";
import { DemoCta } from "../components/DemoCta";

const ITEMS = [
  { title: "Department coordination", description: "Shared patient records across reception, nursing, clinical, and billing teams." },
  { title: "Governance & access control", description: "Granular RBAC with MFA for staff across departments and shifts." },
  { title: "Operational visibility", description: "Dashboards and reports for leadership to monitor throughput and revenue." },
  { title: "Audit accountability", description: "Immutable audit logs designed for healthcare accountability requirements." },
  { title: "Scalable architecture", description: "Cloud-native platform designed to grow with bed capacity and service lines." },
];

export default function SolutionsHospitalsPage() {
  return (
    <>
      <PageMeta
        title="For Hospitals"
        description="Hospital information system capabilities for Indian hospitals — clinical workflows, governance, audit, and operations."
        path="/solutions/hospitals"
      />
      <MarketingHero
        eyebrow="Solutions"
        title="Enterprise governance for hospital operations"
        subtitle="Solidcare supports hospitals that need secure access control, auditability, and connected workflows across departments."
      />
      <SectionContainer>
        <FeatureGrid items={ITEMS} columns={2} />
      </SectionContainer>
      <SectionContainer py={6}>
        <DemoCta title="Discuss hospital requirements" />
      </SectionContainer>
    </>
  );
}
