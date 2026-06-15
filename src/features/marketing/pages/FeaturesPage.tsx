import React from "react";
import { PageMeta } from "../components/PageMeta";
import { MarketingHero } from "../components/MarketingHero";
import { SectionContainer } from "../components/SectionContainer";
import { FeatureGrid } from "../components/FeatureGrid";
import { DemoCta } from "../components/DemoCta";

const FEATURES = [
  { title: "Patient management", description: "Registration, demographics, medical history, documents, and a unified patient timeline." },
  { title: "Doctor management", description: "Provider profiles, specialties, and clinic associations for multi-doctor practices." },
  { title: "Appointments", description: "Booking, rescheduling, check-in, waiting room, and queue dashboards." },
  { title: "Clinical encounters", description: "Consultation workspace, vitals, encounter notes, and lab order tracking." },
  { title: "Prescriptions", description: "Structured e-prescriptions with finalize, print, and share-ready workflows." },
  { title: "Billing", description: "Service charge master, invoices, payments, receipts, and cancellation handling." },
  { title: "Reports & KPIs", description: "Operational dashboards and report views for clinic leadership." },
  { title: "RBAC & MFA", description: "Role-based permissions for superadmin, doctor, receptionist, billing, and org admin." },
  { title: "Audit logging", description: "Append-only audit trail for sensitive actions and PHI access patterns." },
  { title: "Multi-clinic admin", description: "Organization and clinic management for growing provider networks." },
  { title: "Notifications", description: "In-app notification feed with infrastructure for SMS and email dispatch." },
  { title: "Future-ready integrations", description: "Architected for ABDM/ABHA, FHIR R4, and telemedicine expansion." },
];

export default function FeaturesPage() {
  return (
    <>
      <PageMeta
        title="Features"
        description="Solidcare features — patient management, clinical workflows, e-prescriptions, billing, RBAC, audit, and multi-clinic administration."
        path="/features"
      />
      <MarketingHero
        eyebrow="Features"
        title="Comprehensive modules for modern healthcare operations"
        subtitle="Built for day-to-day clinic and hospital workflows — not generic CRM features repackaged for healthcare."
      />
      <SectionContainer>
        <FeatureGrid items={FEATURES} />
      </SectionContainer>
      <SectionContainer bgcolor="grey.50" py={6}>
        <DemoCta />
      </SectionContainer>
    </>
  );
}
