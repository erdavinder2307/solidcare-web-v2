import { useAuthStore } from "@/app/store/authStore";

export function usePermissions() {
  const can = useAuthStore((s) => s.can);
  const hasRole = useAuthStore((s) => s.hasRole);
  const user = useAuthStore((s) => s.user);

  return { can, hasRole, user };
}
