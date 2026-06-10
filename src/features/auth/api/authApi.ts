import apiClient from "@/lib/api/apiClient";

export interface LoginRequest { email: string; password: string; }
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  requires_mfa: boolean;
  mfa_token: string | null;
}

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<TokenResponse>("/auth/login", data).then((r) => r.data),

  verifyMfa: (mfa_token: string, totp_code: string) =>
    apiClient.post<TokenResponse>("/auth/mfa/verify", { mfa_token, totp_code }).then((r) => r.data),

  refresh: (refresh_token: string) =>
    apiClient.post<TokenResponse>("/auth/refresh", { refresh_token }).then((r) => r.data),

  logout: (refresh_token: string) =>
    apiClient.post("/auth/logout", { refresh_token }),

  setupMfa: () =>
    apiClient.post("/auth/mfa/setup").then((r) => r.data),

  confirmMfa: (totp_code: string) =>
    apiClient.post("/auth/mfa/confirm", { totp_code }),
};
