import { Box, Skeleton } from "@mui/material";
import { Outlet } from "react-router-dom";
import { PageHeader, PageLayout } from "@/shared/layout";
import { ContextNav } from "@/shared/layout/ContextNav";
import { getDoctorContextNav } from "./doctorNav";

export default function DoctorWorkspace() {
  return (
    <PageLayout maxWidth="none">
      <PageHeader
        title="Clinical Workspace"
        subtitle={new Date().toLocaleDateString("en-IN", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
        breadcrumbs={[
          { label: "Clinical" },
          { label: "Workspace" },
        ]}
      />
      <ContextNav items={getDoctorContextNav()} ariaLabel="Doctor workspace sections" />
      <Box>
        <Outlet />
      </Box>
    </PageLayout>
  );
}

export function DoctorWorkspaceSkeleton() {
  return (
    <PageLayout maxWidth="none">
      <Skeleton width={240} height={32} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={120} sx={{ mb: 2, borderRadius: 2 }} />
      <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 2 }} />
    </PageLayout>
  );
}
