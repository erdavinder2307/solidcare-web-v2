import type { ContextNavItem } from "@/shared/layout/ContextNav";

export function getDoctorContextNav(): ContextNavItem[] {
  return [
    { label: "Today", to: "/clinical/workspace", end: true },
    { label: "Waiting Room", to: "/clinical/workspace/waiting-room" },
  ];
}
