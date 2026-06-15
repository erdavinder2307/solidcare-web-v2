import { Page, expect } from "@playwright/test";
import { request } from "@playwright/test";
import fs from "fs";
import path from "path";

const API_URL = process.env.PLAYWRIGHT_API_URL ?? "http://localhost:8000/api/v1";

export interface SecurityFinding {
  id: string;
  title: string;
  severity: "Critical" | "High" | "Medium" | "Low" | "Info";
  description: string;
  recommendation: string;
}

export async function testProtectedRouteWithoutAuth(page: Page, route: string): Promise<SecurityFinding | null> {
  await page.goto("/login");
  await page.evaluate(() => localStorage.clear());
  await page.context().clearCookies();
  await page.goto(route);
  await page.waitForURL(/\/login/, { timeout: 15_000 }).catch(() => null);
  const onLogin = page.url().includes("/login");
  if (!onLogin) {
    return {
      id: "SEC-001",
      title: `Unauthenticated access to ${route}`,
      severity: "Critical",
      description: `Route ${route} accessible without authentication`,
      recommendation: "Ensure AuthGuard redirects unauthenticated users to /login",
    };
  }
  return null;
}

export async function testApiWithoutToken(endpoint: string, method: "get" | "post" = "get"): Promise<SecurityFinding | null> {
  const ctx = await request.newContext();
  const res = await ctx[method](`${API_URL}${endpoint}`);
  await ctx.dispose();
  if (res.status() !== 401 && res.status() !== 403) {
    return {
      id: "SEC-002",
      title: `API ${method.toUpperCase()} ${endpoint} without token`,
      severity: "Critical",
      description: `Expected 401/403, got ${res.status()}`,
      recommendation: "Enforce Bearer token on all protected endpoints",
    };
  }
  return null;
}

export async function testIdorWithDifferentUser(
  resourcePath: string,
  adminToken: string,
  otherToken: string,
): Promise<SecurityFinding | null> {
  const ctx = await request.newContext();
  const adminRes = await ctx.get(`${API_URL}${resourcePath}`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  if (!adminRes.ok()) {
    await ctx.dispose();
    return null;
  }
  const otherRes = await ctx.get(`${API_URL}${resourcePath}`, {
    headers: { Authorization: `Bearer ${otherToken}` },
  });
  await ctx.dispose();
  if (otherRes.ok() && adminToken !== otherToken) {
    return {
      id: "SEC-003",
      title: `Potential IDOR on ${resourcePath}`,
      severity: "High",
      description: "Different user token could access resource",
      recommendation: "Verify org-scoped access control on resource endpoints",
    };
  }
  return null;
}

export function writeSecurityReport(findings: SecurityFinding[]): void {
  const reportDir = path.join(process.cwd(), "tests/reports");
  fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(
    path.join(reportDir, "security-findings.json"),
    JSON.stringify({ timestamp: new Date().toISOString(), findings }, null, 2),
  );
}

export async function captureResponsiveScreenshot(
  page: Page,
  name: string,
  viewport: { width: number; height: number },
): Promise<void> {
  await page.setViewportSize(viewport);
  await page.waitForTimeout(500);
  const dir = path.join(process.cwd(), "tests/reports/screenshots");
  fs.mkdirSync(dir, { recursive: true });
  await page.screenshot({
    path: path.join(dir, `${name}-${viewport.width}x${viewport.height}.png`),
    fullPage: true,
  });
}
