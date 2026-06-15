import React, { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { AuthGuard } from "@/shared/components/guards/AuthGuard";
import { RoutePermission } from "@/shared/components/guards/RoutePermission";
import { RoleGuard } from "@/shared/components/guards/RoleGuard";
import { AppShell } from "@/shared/components/layout/AppShell";
import { PublicLayout } from "@/features/marketing/layout/PublicLayout";

const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const MfaPage = lazy(() => import("@/features/auth/pages/MfaPage"));

const HomePage = lazy(() => import("@/features/marketing/pages/HomePage"));
const PlatformPage = lazy(() => import("@/features/marketing/pages/PlatformPage"));
const FeaturesPage = lazy(() => import("@/features/marketing/pages/FeaturesPage"));
const SolutionsClinicsPage = lazy(() => import("@/features/marketing/pages/SolutionsClinicsPage"));
const SolutionsHospitalsPage = lazy(() => import("@/features/marketing/pages/SolutionsHospitalsPage"));
const SolutionsChainsPage = lazy(() => import("@/features/marketing/pages/SolutionsChainsPage"));
const AboutPage = lazy(() => import("@/features/marketing/pages/AboutPage"));
const ContactPage = lazy(() => import("@/features/marketing/pages/ContactPage"));
const SecurityPage = lazy(() => import("@/features/marketing/pages/SecurityPage"));
const PricingPage = lazy(() => import("@/features/marketing/pages/PricingPage"));
const CareersPage = lazy(() => import("@/features/marketing/pages/CareersPage"));
const PrivacyPolicyPage = lazy(() => import("@/features/marketing/pages/PrivacyPolicyPage"));
const TermsPage = lazy(() => import("@/features/marketing/pages/TermsPage"));
const CookiePolicyPage = lazy(() => import("@/features/marketing/pages/CookiePolicyPage"));
const DisclaimerPage = lazy(() => import("@/features/marketing/pages/DisclaimerPage"));
const PublicNotFoundPage = lazy(() => import("@/features/marketing/pages/PublicNotFoundPage"));

const DashboardPage = lazy(() => import("@/features/reports/pages/DashboardPage"));

const PatientListPage = lazy(() => import("@/features/patients/pages/PatientListPage"));
const PatientRegisterPage = lazy(() => import("@/features/patients/pages/PatientRegisterPage"));
const PatientEditPage = lazy(() => import("@/features/patients/pages/PatientEditPage"));
const PatientWorkspace = lazy(() => import("@/features/patients/pages/workspace/PatientWorkspace"));
const PatientOverviewTab = lazy(() => import("@/features/patients/pages/workspace/PatientOverviewTab"));
const PatientAppointmentsTab = lazy(() => import("@/features/patients/pages/workspace/PatientAppointmentsTab"));
const PatientEncountersTab = lazy(() => import("@/features/patients/pages/workspace/PatientEncountersTab"));
const PatientPrescriptionsTab = lazy(() => import("@/features/patients/pages/workspace/PatientPrescriptionsTab"));
const PatientTimelineTab = lazy(() => import("@/features/patients/pages/workspace/PatientTimelineTab"));
const PatientBillingTab = lazy(() => import("@/features/patients/pages/workspace/PatientBillingTab"));
const PatientLabsTab = lazy(() => import("@/features/patients/pages/workspace/PatientLabsTab"));
const PatientDocumentsTab = lazy(() => import("@/features/patients/pages/workspace/PatientDocumentsTab"));

const DoctorListPage = lazy(() => import("@/features/doctors/pages/DoctorListPage"));
const DoctorRegisterPage = lazy(() => import("@/features/doctors/pages/DoctorRegisterPage"));
const DoctorDetailPage = lazy(() => import("@/features/doctors/pages/DoctorDetailPage"));

const AppointmentListPage = lazy(() => import("@/features/appointments/pages/AppointmentListPage"));
const AppointmentBookPage = lazy(() => import("@/features/appointments/pages/AppointmentBookPage"));
const QueueDashboardPage = lazy(() => import("@/features/appointments/pages/QueueDashboardPage"));

const DoctorWorkspace = lazy(() => import("@/features/clinical/pages/workspace/DoctorWorkspace"));
const DoctorTodayPage = lazy(() => import("@/features/clinical/pages/workspace/DoctorTodayPage"));
const DoctorWaitingRoomPage = lazy(() => import("@/features/clinical/pages/workspace/DoctorWaitingRoomPage"));
const NurseVitalsPage = lazy(() => import("@/features/clinical/pages/workspace/NurseVitalsPage"));

const ConsultationPage = lazy(() => import("@/features/clinical/pages/ConsultationPage"));
const EncounterListPage = lazy(() => import("@/features/clinical/pages/EncounterListPage"));
const EncounterDetailPage = lazy(() => import("@/features/clinical/pages/EncounterDetailPage"));

const PrescriptionListPage = lazy(() => import("@/features/prescriptions/pages/PrescriptionListPage"));
const PrescriptionCreatePage = lazy(() => import("@/features/prescriptions/pages/PrescriptionCreatePage"));
const PrescriptionDetailPage = lazy(() => import("@/features/prescriptions/pages/PrescriptionDetailPage"));
const PrescriptionPrintPage = lazy(() => import("@/features/prescriptions/pages/PrescriptionPrintPage"));

const InvoiceListPage = lazy(() => import("@/features/billing/pages/InvoiceListPage"));
const InvoiceDetailPage = lazy(() => import("@/features/billing/pages/InvoiceDetailPage"));
const InvoiceCreatePage = lazy(() => import("@/features/billing/pages/InvoiceCreatePage"));
const PaymentReceiptPage = lazy(() => import("@/features/billing/pages/PaymentReceiptPage"));
const ServiceChargeMasterPage = lazy(() => import("@/features/billing/pages/ServiceChargeMasterPage"));

const ReportsPage = lazy(() => import("@/features/reports/pages/ReportsPage"));
const AuditLogPage = lazy(() => import("@/features/audit/pages/AuditLogPage"));
const UsersListPage = lazy(() => import("@/features/admin/pages/UsersListPage"));
const ClinicsListPage = lazy(() => import("@/features/admin/pages/ClinicsListPage"));
const ClinicDetailPage = lazy(() => import("@/features/admin/pages/ClinicDetailPage"));
const SettingsPage = lazy(() => import("@/features/settings/pages/SettingsPage"));
const NotFoundPage = lazy(() => import("@/shared/pages/NotFoundPage"));

function PageLoader() {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" height="100vh">
      <CircularProgress size={40} />
    </Box>
  );
}

export function Router() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/platform" element={<PlatformPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/solutions/clinics" element={<SolutionsClinicsPage />} />
            <Route path="/solutions/hospitals" element={<SolutionsHospitalsPage />} />
            <Route path="/solutions/chains" element={<SolutionsChainsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/security" element={<SecurityPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/cookies" element={<CookiePolicyPage />} />
            <Route path="/disclaimer" element={<DisclaimerPage />} />
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/mfa" element={<MfaPage />} />

          <Route element={<AuthGuard />}>
            <Route element={<AppShell />}>
              <Route path="/dashboard" element={<RoutePermission permission={null}><DashboardPage /></RoutePermission>} />

              <Route path="/patients" element={<RoutePermission permission="patient:read"><PatientListPage /></RoutePermission>} />
              <Route path="/patients/new" element={<RoutePermission permission="patient:create"><PatientRegisterPage /></RoutePermission>} />
              <Route path="/patients/:patientId/edit" element={<RoutePermission permission="patient:update"><PatientEditPage /></RoutePermission>} />
              <Route
                path="/patients/:patientId"
                element={<RoutePermission permission="patient:read"><PatientWorkspace /></RoutePermission>}
              >
                <Route index element={<Navigate to="overview" replace />} />
                <Route path="overview" element={<PatientOverviewTab />} />
                <Route path="timeline" element={<PatientTimelineTab />} />
                <Route path="appointments" element={<PatientAppointmentsTab />} />
                <Route path="encounters" element={<PatientEncountersTab />} />
                <Route path="prescriptions" element={<PatientPrescriptionsTab />} />
                <Route path="labs" element={<RoutePermission permission="encounter:read"><PatientLabsTab /></RoutePermission>} />
                <Route path="billing" element={<RoutePermission permission="billing:read"><PatientBillingTab /></RoutePermission>} />
                <Route path="documents" element={<PatientDocumentsTab />} />
              </Route>

              <Route path="/doctors" element={<RoutePermission permission="doctor:read"><DoctorListPage /></RoutePermission>} />
              <Route path="/doctors/new" element={<RoutePermission permission="doctor:create"><DoctorRegisterPage /></RoutePermission>} />
              <Route path="/doctors/:doctorId" element={<RoutePermission permission="doctor:read"><DoctorDetailPage /></RoutePermission>} />

              <Route path="/appointments" element={<RoutePermission permission="appointment:read"><AppointmentListPage /></RoutePermission>} />
              <Route path="/appointments/new" element={<RoutePermission permission="appointment:create"><AppointmentBookPage /></RoutePermission>} />
              <Route path="/appointments/queue" element={<RoutePermission permission="appointment:read"><QueueDashboardPage /></RoutePermission>} />

              <Route path="/encounters" element={<RoutePermission permission="encounter:read"><EncounterListPage /></RoutePermission>} />
              <Route
                path="/clinical/workspace"
                element={<RoutePermission permission="encounter:read"><DoctorWorkspace /></RoutePermission>}
              >
                <Route index element={<DoctorTodayPage />} />
                <Route path="waiting-room" element={<DoctorWaitingRoomPage />} />
              </Route>
              <Route path="/clinical" element={<Navigate to="/clinical/workspace" replace />} />
              <Route path="/consultation/:appointmentId" element={<RoutePermission permission="encounter:create"><ConsultationPage /></RoutePermission>} />
              <Route path="/clinical/vitals/:appointmentId" element={<RoutePermission permission="encounter:update"><NurseVitalsPage /></RoutePermission>} />
              <Route path="/encounters/:encounterId" element={<RoutePermission permission="encounter:read"><EncounterDetailPage /></RoutePermission>} />

              <Route path="/prescriptions" element={<RoutePermission permission="prescription:read"><PrescriptionListPage /></RoutePermission>} />
              <Route path="/prescriptions/new" element={<RoutePermission permission="prescription:create"><PrescriptionCreatePage /></RoutePermission>} />
              <Route path="/prescriptions/:prescriptionId" element={<RoutePermission permission="prescription:read"><PrescriptionDetailPage /></RoutePermission>} />
              <Route path="/prescriptions/:prescriptionId/print" element={<RoutePermission permission="prescription:read"><PrescriptionPrintPage /></RoutePermission>} />

              <Route path="/billing/invoices" element={<RoutePermission permission="billing:read"><InvoiceListPage /></RoutePermission>} />
              <Route path="/billing/invoices/new" element={<RoutePermission permission="billing:create"><InvoiceCreatePage /></RoutePermission>} />
              <Route path="/billing/invoices/:invoiceId" element={<RoutePermission permission="billing:read"><InvoiceDetailPage /></RoutePermission>} />
              <Route path="/billing/invoices/:invoiceId/receipt" element={<RoutePermission permission="billing:read"><PaymentReceiptPage /></RoutePermission>} />
              <Route path="/billing/service-charges" element={<RoutePermission permission="billing:read"><ServiceChargeMasterPage /></RoutePermission>} />

              <Route path="/reports" element={<RoutePermission permission="report:read"><ReportsPage /></RoutePermission>} />
              <Route
                path="/admin/users"
                element={
                  <RoleGuard roles={["admin"]}>
                    <RoutePermission permission="doctor:read">
                      <UsersListPage />
                    </RoutePermission>
                  </RoleGuard>
                }
              />
              <Route
                path="/admin/clinics"
                element={
                  <RoleGuard roles={["admin"]}>
                    <ClinicsListPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/admin/clinics/:clinicId"
                element={
                  <RoleGuard roles={["admin"]}>
                    <ClinicDetailPage />
                  </RoleGuard>
                }
              />
              <Route path="/audit" element={<RoutePermission permission="audit:read"><AuditLogPage /></RoutePermission>} />
              <Route path="/settings" element={<RoutePermission permission={null}><SettingsPage /></RoutePermission>} />

              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Route>

          <Route path="*" element={<PublicNotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
