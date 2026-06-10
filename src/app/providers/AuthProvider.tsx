import React, { createContext, useContext, useEffect } from "react";
import { useAuthStore } from "@/app/store/authStore";

interface AuthContextType {
  isAuthenticated: boolean;
  can: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, can, hasRole } = useAuthStore();

  return (
    <AuthContext.Provider value={{ isAuthenticated, can, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
