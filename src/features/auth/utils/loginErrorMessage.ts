import { isAxiosError } from "axios";

export const LOGIN_ERROR_MESSAGES = {
  unreachable: "Can't reach the SolidCare server. Check your connection and try again.",
  server: "The server had a problem. Please try again in a few minutes.",
  invalidCredentials: "Invalid credentials. Please try again.",
} as const;

/**
 * Text for the login page's error alert. A request that got no response (network down,
 * CORS block, timeout) or a 5xx must not be reported as wrong credentials.
 */
export function getLoginErrorMessage(error: unknown): string {
  if (isAxiosError(error) && !error.response) {
    return LOGIN_ERROR_MESSAGES.unreachable;
  }
  const response = (error as { response?: { status?: number; data?: { detail?: unknown } } } | null)?.response;
  if (response?.status !== undefined && response.status >= 500) {
    return LOGIN_ERROR_MESSAGES.server;
  }
  const detail = response?.data?.detail;
  if (typeof detail === "string" && detail) {
    return detail;
  }
  return LOGIN_ERROR_MESSAGES.invalidCredentials;
}
