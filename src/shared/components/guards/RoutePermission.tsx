import React from "react";
import { PermissionGuard } from "./PermissionGuard";

interface RoutePermissionProps {
  permission: string | null;
  children: React.ReactNode;
}

/** Wraps a route element; blocks rendering when the user lacks permission. */
export function RoutePermission({ permission, children }: RoutePermissionProps) {
  if (!permission) {
    return <>{children}</>;
  }
  return <PermissionGuard permission={permission}>{children}</PermissionGuard>;
}
