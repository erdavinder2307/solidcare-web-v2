import React, { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { AuthGuard } from "@/shared/components/guards/AuthGuard";
import { AppShell } from "@/shared/components/layout/AppShell";

// Lazy-loaded pages — each feature bundle loaded on demand
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const MfaPage = lazy(() => import("@/features/auth/pages/MfaPage"));

const DashboardPage = lazy(() => import("@/features/reports/pages/DashboardPage"));

const PatientListPage = lazy(() => import("@/features/patients/pages/PatientListPage"));
const PatientDetailPage = lazy(() => import("@/features/patients/pages/PatientDetailPage"));
const PatientRegisterPage = lazy(() => import("@/features/patients/pages/PatientRegisterPage"));

const DoctorListPage = lazy(() => import("@/features/doctors/pages/DoctorListPage"));
const DoctorDetailPage = lazy(() => import("@/features/doctors/pages/DoctorDetailPage"));

const AppointmentListPage = lazy(() => import("@/features/appointments/pages/AppointmentListPage"));
const AppointmentBookPage = lazy(() => import("@/features/appointments/pages/AppointmentBookPage"));
const QueueDashboardPage = lazy(() => import("@/features/appointments/pages/QueueDashboardPage"));

const ConsultationPage = lazy(() => import("@/features/clinical/pages/ConsultationPage"));
const EncounterDetailPage = lazy(() => import("@/features/clinical/pages/EncounterDetailPage"));

const PrescriptionListPage = lazy(() => import("@/features/prescriptions/pages/PrescriptionListPage"));

const InvoiceListPage = lazy(() => import("@/features/billing/pages/InvoiceListPage"));
const InvoiceDetailPage = lazy(() => import("@/features/billing/pages/InvoiceDetailPage"));

const ReportsPage = lazy(() => import("@/features/reports/pages/ReportsPage"));

const SettingsPage = lazy(() => import("@/features/settings/pages/SettingsPage"));

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
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/mfa" element={<MfaPage />} />

          {/* Protected routes */}
          <Route element={<AuthGuard />}>
            <Route element={<AppShell />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />

              {/* Patients */}
              <Route path="/patients" element={<PatientListPage />} />
              <Route path="/patients/new" element={<PatientRegisterPage />} />
              <Route path="/patients/:patientId" element={<PatientDetailPage />} />

              {/* Doctors */}
              <Route path="/doctors" element={<DoctorListPage />} />
              <Route path="/doctors/:doctorId" element={<DoctorDetailPage />} />

              {/* Appointments */}
              <Route path="/appointments" element={<AppointmentListPage />} />
              <Route path="/appointments/new" element={<AppointmentBookPage />} />
              <Route path="/appointments/queue" element={<QueueDashboardPage />} />

              {/* Clinical */}
              <Route path="/consultation/:appointmentId" element={<ConsultationPage />} />
              <Route path="/encounters/:encounterId" element={<EncounterDetailPage />} />

              {/* Prescriptions */}
              <Route path="/prescriptions" element={<PrescriptionListPage />} />

              {/* Billing */}
              <Route path="/billing/invoices" element={<InvoiceListPage />} />
              <Route path="/billing/invoices/:invoiceId" element={<InvoiceDetailPage />} />

              {/* Reports */}
              <Route path="/reports" element={<ReportsPage />} />

              {/* Settings */}
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
