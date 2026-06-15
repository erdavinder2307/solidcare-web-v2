import React from "react";
import { PageMeta } from "../components/PageMeta";
import { MarketingHero } from "../components/MarketingHero";
import { SectionContainer } from "../components/SectionContainer";
import { FeatureGrid } from "../components/FeatureGrid";
import { DemoCta } from "../components/DemoCta";

const LAYERS = [
  {
    title: "Experience layer",
    description: "React web application with role-based workspaces for reception, clinical, billing, and administration.",
  },
  {
    title: "Application layer",
    description: "FastAPI modular monolith with REST APIs, RBAC enforcement, and healthcare domain modules.",
  },
  {
    title: "Data layer",
    description: "PostgreSQL with async SQLAlchemy, Alembic migrations, and structured clinical and billing records.",
  },
  {
    title: "Cloud infrastructure",
    description: "Azure App Service, PostgreSQL Flexible Server, and Blob Storage — designed for secure healthcare workloads.",
  },
];

const WORKFLOW = [
  { title: "Register & schedule", description: "Patient intake, appointment booking, and queue management." },
  { title: "Consult & document", description: "Encounters, vitals, diagnoses, and e-prescriptions in the doctor workspace." },
  { title: "Bill & report", description: "Invoices, payments, KPI dashboards, and operational reports." },
  { title: "Govern & audit", description: "User roles, clinic administration, MFA, and immutable audit logging." },
];

export default function PlatformPage() {
  return (
    <>
      <PageMeta
        title="Platform Overview"
        description="Solidcare platform architecture — unified healthcare operations from patient registration to billing on cloud-native infrastructure."
        path="/platform"
      />
      <MarketingHero
        eyebrow="Platform"
        title="One platform for the full patient journey"
        subtitle="Solidcare connects front-office, clinical, and back-office workflows in a single system — reducing fragmentation and improving operational visibility."
      />
      <SectionContainer>
        <FeatureGrid title="Platform layers" items={LAYERS} columns={2} />
      </SectionContainer>
      <SectionContainer bgcolor="grey.50">
        <FeatureGrid
          title="End-to-end workflow"
          subtitle="Each module shares the same patient context — no duplicate data entry across departments."
          items={WORKFLOW}
        />
      </SectionContainer>
      <SectionContainer py={6}>
        <DemoCta title="Walk through the platform" />
      </SectionContainer>
    </>
  );
}
