import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";

export type DatabaseStatus = "ready" | "starting" | "unknown";

/** The API serves /health/db at its root, next to /api/v1. */
export function databaseHealthUrl(apiBaseUrl: string = API_BASE_URL): string {
  return `${apiBaseUrl.replace(/\/+$/, "").replace(/\/api\/v\d+$/, "")}/health/db`;
}

// Plain axios, not apiClient: no auth headers and no token-refresh handling on the login screen.
export const databaseHealthApi = {
  /** Starts a stopped database while the user types. Fire and forget. */
  wake: (): Promise<void> =>
    axios.post(databaseHealthUrl(), undefined, { timeout: 15_000 }).then(
      () => undefined,
      () => undefined
    ),

  check: (): Promise<DatabaseStatus> =>
    axios
      .get(databaseHealthUrl(), { timeout: 15_000, validateStatus: () => true })
      .then(
        (r) => {
          if (r.status === 200 && r.data?.database === "ready") return "ready" as const;
          if (r.status === 503 && r.data?.error_code === "DB_STARTING") return "starting" as const;
          return "unknown" as const;
        },
        () => "unknown" as const
      ),
};
