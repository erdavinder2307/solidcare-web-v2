import React from "react";
import { PageMeta } from "../components/PageMeta";
import { MarketingHero } from "../components/MarketingHero";
import { SectionContainer } from "../components/SectionContainer";
import { FeatureGrid } from "../components/FeatureGrid";
import { DemoCta } from "../components/DemoCta";

const ITEMS = [
  { title: "Fast patient registration", description: "Streamlined intake for walk-ins and scheduled visits with searchable patient registry." },
  { title: "Appointment & queue control", description: "Reception-friendly scheduling and real-time waiting room visibility." },
  { title: "Doctor workspace", description: "Today's appointments, consultation flow, and prescription creation in one view." },
  { title: "Integrated billing", description: "Generate invoices from visits without switching to a separate billing tool." },
  { title: "Right-sized administration", description: "RBAC and clinic settings without enterprise complexity you do not need yet." },
];

export default function SolutionsClinicsPage() {
  return (
    <>
      <PageMeta
        title="For Clinics"
        description="Clinic management software for single and multi-speciality clinics in India — patients, appointments, clinical, and billing."
        path="/solutions/clinics"
      />
      <MarketingHero
        eyebrow="Solutions"
        title="Built for clinics that need clarity, not complexity"
        subtitle="Whether you run a single-speciality practice or a multi-doctor clinic, Solidcare keeps your team aligned from registration to billing."
      />
      <SectionContainer>
        <FeatureGrid items={ITEMS} columns={2} />
      </SectionContainer>
      <SectionContainer py={6}>
        <DemoCta title="See Solidcare for your clinic" />
      </SectionContainer>
    </>
  );
}
