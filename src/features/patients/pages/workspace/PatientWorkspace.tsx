import { Box } from "@mui/material";
import { Outlet, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { patientsApi } from "../../api/patientsApi";
import { useAuthStore } from "@/app/store/authStore";
import { PageLayout } from "@/shared/layout";
import { PageHeader } from "@/shared/layout/PageHeader";
import { ContextNav } from "@/shared/layout/ContextNav";
import { AllergyBanner } from "@/shared/ui/AllergyBanner";
import { PatientHeader } from "./PatientHeader";
import { getPatientContextNav } from "./patientNav";
import { PatientWorkspaceSkeleton } from "./PatientWorkspaceSkeleton";

export default function PatientWorkspace() {
  const { patientId } = useParams<{ patientId: string }>();
  const can = useAuthStore((s) => s.can);

  const { data: patient, isLoading, isError } = useQuery({
    queryKey: ["patient", patientId],
    queryFn: () => patientsApi.get(patientId!),
    enabled: !!patientId,
  });

  if (isLoading) return <PatientWorkspaceSkeleton />;
  if (isError || !patient) {
    return (
      <PageLayout maxWidth="none">
        <Box component="p" sx={{ color: "error.main", m: 0 }}>Patient not found</Box>
      </PageLayout>
    );
  }

  const allergies = patient.known_allergies ?? [];
  const showBilling = can("billing:read");

  return (
    <PageLayout maxWidth="none">
      <PageHeader
        breadcrumbs={[
          { label: "Patients", to: "/patients" },
          { label: patient.full_name },
        ]}
      />
      <AllergyBanner allergies={allergies} />
      <PatientHeader patient={patient} canBill={can("billing:create")} />
      <ContextNav
        items={getPatientContextNav(patient.id, { showBilling })}
        ariaLabel="Patient chart sections"
      />
      <Box>
        <Outlet context={{ patient }} />
      </Box>
    </PageLayout>
  );
}

export interface PatientWorkspaceContext {
  patient: import("../../api/patientsApi").Patient;
}
