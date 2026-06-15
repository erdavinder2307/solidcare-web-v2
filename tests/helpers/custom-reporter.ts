import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from "@playwright/test/reporter";
import fs from "fs";
import path from "path";

interface FailureRecord {
  testName: string;
  file: string;
  error: string;
  severity: string;
  reproductionSteps: string[];
  suggestedFix: string;
}

class SolidcareReporter implements Reporter {
  private failures: FailureRecord[] = [];
  private passed = 0;
  private failed = 0;
  private skipped = 0;
  private total = 0;

  onTestEnd(test: TestCase, result: TestResult): void {
    this.total++;
    if (result.status === "passed") this.passed++;
    else if (result.status === "failed") {
      this.failed++;
      this.failures.push({
        testName: test.title,
        file: test.location.file,
        error: result.error?.message ?? "Unknown error",
        severity: test.title.includes("@critical") ? "Critical" : "High",
        reproductionSteps: [
          `Run: npx playwright test ${path.basename(test.location.file)} -g "${test.title}"`,
          "Ensure API and web servers are running",
          "Ensure seed data is applied",
        ],
        suggestedFix: "Review trace/screenshot in tests/reports/html",
      });
    } else if (result.status === "skipped") this.skipped++;
  }

  onEnd(result: FullResult): void {
    const reportDir = path.join(process.cwd(), "tests/reports");
    fs.mkdirSync(reportDir, { recursive: true });

    const summary = {
      timestamp: new Date().toISOString(),
      total: this.total,
      passed: this.passed,
      failed: this.failed,
      skipped: this.skipped,
      passRate: this.total ? Math.round((this.passed / this.total) * 100) : 0,
      status: result.status,
      failures: this.failures,
    };

    fs.writeFileSync(
      path.join(reportDir, "execution-summary.json"),
      JSON.stringify(summary, null, 2),
    );

    if (this.failures.length > 0) {
      const md = [
        "# Failed Test Report",
        "",
        `Generated: ${summary.timestamp}`,
        "",
        ...this.failures.map(
          (f) =>
            `## ${f.testName}\n\n- **File:** ${f.file}\n- **Severity:** ${f.severity}\n- **Error:** ${f.error}\n- **Reproduction:**\n${f.reproductionSteps.map((s) => `  1. ${s}`).join("\n")}\n- **Suggested Fix:** ${f.suggestedFix}\n`,
        ),
      ].join("\n");
      fs.writeFileSync(path.join(reportDir, "failed-tests.md"), md);
    }
  }
}

export default SolidcareReporter;
