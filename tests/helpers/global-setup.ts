import { request } from "@playwright/test";

const API_URL = process.env.PLAYWRIGHT_API_URL ?? "http://localhost:8000/api/v1";
const HEALTH_URL = process.env.PLAYWRIGHT_API_HEALTH ?? "http://localhost:8000/health";

async function waitForApi(maxAttempts = 30): Promise<void> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const ctx = await request.newContext();
      const res = await ctx.get(HEALTH_URL);
      await ctx.dispose();
      if (res.ok()) return;
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error(`API not reachable at ${HEALTH_URL}. Start docker-compose or the API server.`);
}

export default async function globalSetup(): Promise<void> {
  await waitForApi();

  const ctx = await request.newContext();
  const login = await ctx.post(`${API_URL}/auth/login`, {
    data: { email: "admin@solidcare.health", password: "Admin@1234" },
  });

  if (!login.ok()) {
    console.warn(
      "Global setup: admin login failed. Ensure seed_dev_admin.sql and migrations are applied.",
    );
    await ctx.dispose();
    return;
  }

  const { access_token } = await login.json();
  process.env.E2E_ADMIN_TOKEN = access_token;
  await ctx.dispose();
}
