import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { authApi } from "@/features/auth/api/authApi";

interface AuthUser {
  userId: string;
  email: string;
  orgId: string;
  clinicIds: string[];
  permissions: string[];
  roles: string[];
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  orgId: string | null;
  isAuthenticated: boolean;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: AuthUser) => void;
  logout: () => void;
  logoutAsync: () => Promise<void>;
  can: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      orgId: null,
      isAuthenticated: false,

      setTokens: (accessToken, refreshToken) => {
        // Decode JWT to extract user info
        try {
          const payload = JSON.parse(atob(accessToken.split(".")[1]));
          const user: AuthUser = {
            userId: payload.user_id,
            email: payload.sub,
            orgId: payload.org_id,
            clinicIds: payload.clinic_ids || [],
            permissions: payload.permissions || [],
            roles: payload.roles || [],
          };
          set({
            accessToken,
            refreshToken,
            user,
            orgId: payload.org_id,
            isAuthenticated: true,
          });
        } catch {
          set({ accessToken, refreshToken, isAuthenticated: true });
        }
      },

      setUser: (user) => set({ user, orgId: user.orgId }),

  logout: () =>
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      orgId: null,
      isAuthenticated: false,
    }),

  logoutAsync: async () => {
    const { refreshToken, logout } = get();
    if (refreshToken) {
      try {
        await authApi.logout(refreshToken);
      } catch {
        // still clear local session
      }
    }
    logout();
  },

      can: (permission) => {
        const { user } = get();
        if (!user) return false;
        if (user.roles.includes("superadmin")) return true;
        return user.permissions.includes(permission);
      },

      hasRole: (role) => get().user?.roles.includes(role) ?? false,
    }),
    {
      name: "solidcare-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        orgId: state.orgId,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
