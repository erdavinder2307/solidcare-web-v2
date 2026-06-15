import React from "react";
import { Box, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useAuthStore } from "@/app/store/authStore";

interface RoleGuardProps {
  roles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/** Restricts content to users with at least one of the given roles (superadmin always passes). */
export function RoleGuard({ roles, children, fallback }: RoleGuardProps) {
  const hasRole = useAuthStore((s) => s.hasRole);

  if (hasRole("superadmin") || roles.some((role) => hasRole(role))) {
    return <>{children}</>;
  }

  return (
    fallback ?? (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        py={8}
        gap={2}
        color="text.secondary"
      >
        <LockOutlinedIcon sx={{ fontSize: 48, opacity: 0.4 }} />
        <Typography variant="body1">You don't have permission to view this section.</Typography>
      </Box>
    )
  );
}
