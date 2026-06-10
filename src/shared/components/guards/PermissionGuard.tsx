import React from "react";
import { Box, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useAuthStore } from "@/app/store/authStore";

interface PermissionGuardProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGuard({ permission, children, fallback }: PermissionGuardProps) {
  const can = useAuthStore((s) => s.can);

  if (!can(permission)) {
    return fallback ?? (
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
    );
  }

  return <>{children}</>;
}
