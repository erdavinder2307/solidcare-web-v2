import AxeBuilder from "@axe-core/playwright";
import { Page } from "@playwright/test";
import fs from "fs";
import path from "path";

export interface A11yReport {
  url: string;
  violations: number;
  passes: number;
  incomplete: number;
  details: unknown[];
}

export async function runAccessibilityScan(page: Page, label: string): Promise<A11yReport> {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  const report: A11yReport = {
    url: page.url(),
    violations: results.violations.length,
    passes: results.passes.length,
    incomplete: results.incomplete.length,
    details: results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      nodes: v.nodes.length,
    })),
  };

  const reportDir = path.join(process.cwd(), "tests/reports");
  fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(
    path.join(reportDir, `a11y-${label.replace(/\s+/g, "-").toLowerCase()}.json`),
    JSON.stringify(report, null, 2),
  );

  return report;
}

export async function testKeyboardNavigation(page: Page): Promise<boolean> {
  await page.keyboard.press("Tab");
  const focused = await page.evaluate(() => document.activeElement?.tagName);
  return focused !== "BODY";
}
