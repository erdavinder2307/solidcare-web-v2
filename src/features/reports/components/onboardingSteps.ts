export type OnboardingStepId = "patient" | "appointment" | "prescription" | "invoice";

export interface OnboardingStep {
  id: OnboardingStepId;
  label: string;
  to: string;
  actionLabel: string;
  done: boolean;
}

/** Record counts for the clinic; undefined while still loading or when the user cannot read that list. */
export type OnboardingTotals = Partial<Record<OnboardingStepId, number>>;

const STEPS: Omit<OnboardingStep, "done">[] = [
  { id: "patient", label: "Add your first patient", to: "/patients/new", actionLabel: "Register patient" },
  { id: "appointment", label: "Book your first appointment", to: "/appointments/new", actionLabel: "Book appointment" },
  { id: "prescription", label: "Write your first prescription", to: "/prescriptions/new", actionLabel: "New prescription" },
  { id: "invoice", label: "Create your first invoice", to: "/billing/invoices/new", actionLabel: "New invoice" },
];

export function buildOnboardingSteps(totals: OnboardingTotals): OnboardingStep[] {
  return STEPS.map((step) => ({ ...step, done: (totals[step.id] ?? 0) > 0 }));
}

/** True only when every count is known, so a slow or failed request never hides or completes the list. */
export function allTotalsKnown(totals: OnboardingTotals): boolean {
  return STEPS.every((step) => typeof totals[step.id] === "number");
}

export function dismissKey(clinicId: string): string {
  return `solidcare.onboarding.dismissed.${clinicId}`;
}

export function readDismissed(clinicId: string): boolean {
  try {
    return window.localStorage.getItem(dismissKey(clinicId)) === "1";
  } catch {
    return false;
  }
}

export function writeDismissed(clinicId: string): void {
  try {
    window.localStorage.setItem(dismissKey(clinicId), "1");
  } catch {
    // Storage blocked (private mode): the list simply shows again next visit.
  }
}
