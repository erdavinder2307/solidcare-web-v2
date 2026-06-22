import React from "react";
import { PageMeta } from "../components/PageMeta";
import { MarketingHero } from "../components/MarketingHero";
import { SectionContainer } from "../components/SectionContainer";
import { FeatureGrid } from "../components/FeatureGrid";
import { DemoCta } from "../components/DemoCta";
import PersonSearchOutlinedIcon from "@mui/icons-material/PersonSearchOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import MedicationOutlinedIcon from "@mui/icons-material/MedicationOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ApiOutlinedIcon from "@mui/icons-material/ApiOutlined";

const FEATURES = [
  { icon: PersonSearchOutlinedIcon, title: "Patient management", description: "Registration, demographics, medical history, documents, and a unified patient timeline." },
  { icon: MedicalServicesOutlinedIcon, title: "Doctor management", description: "Provider profiles, specialties, and clinic associations for multi-doctor practices." },
  { icon: CalendarMonthOutlinedIcon, title: "Appointments", description: "Booking, rescheduling, check-in, waiting room, and queue dashboards." },
  { icon: LocalHospitalOutlinedIcon, title: "Clinical encounters", description: "Consultation workspace, SOAP notes, vitals, ICD-10 diagnosis, and lab order tracking." },
  { icon: MedicationOutlinedIcon, title: "Prescriptions", description: "Structured e-prescriptions with drug-allergy alerts, finalize, print, and share-ready workflows." },
  { icon: ReceiptLongOutlinedIcon, title: "Billing", description: "GST-compliant invoicing, service charge master, payments, receipts, and cancellation handling." },
  { icon: BarChartOutlinedIcon, title: "Reports & KPIs", description: "Operational dashboards and report views for clinic leadership." },
  { icon: AdminPanelSettingsOutlinedIcon, title: "RBAC & MFA", description: "Role-based permissions for superadmin, doctor, receptionist, billing, and org admin." },
  { icon: HistoryOutlinedIcon, title: "Audit logging", description: "Append-only audit trail for sensitive actions and PHI access patterns." },
  { icon: AccountTreeOutlinedIcon, title: "Multi-clinic admin", description: "Organization and clinic management for growing provider networks." },
  { icon: NotificationsNoneOutlinedIcon, title: "Notifications", description: "In-app notification feed with infrastructure for SMS and email dispatch." },
  { icon: ApiOutlinedIcon, title: "Future-ready integrations", description: "Architected for ABDM/ABHA, FHIR R4, and telemedicine expansion." },
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
        <DemoCta
          title="See every module in a live walkthrough"
          subtitle="Request a demo to see patient management, clinical workflows, prescriptions, and billing in your clinic's context."
        />
      </SectionContainer>
    </>
  );
}
