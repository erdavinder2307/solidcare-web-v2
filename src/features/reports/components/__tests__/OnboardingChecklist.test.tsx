import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material/styles";
import { createAppTheme } from "@/lib/theme/theme";
import { patientsApi } from "@/features/patients/api/patientsApi";
import { appointmentsApi } from "@/features/appointments/api/appointmentsApi";
import { prescriptionsApi } from "@/features/prescriptions/api/prescriptionsApi";
import { billingApi } from "@/features/billing/api/billingApi";
import OnboardingChecklist from "../OnboardingChecklist";
import { allTotalsKnown, buildOnboardingSteps, dismissKey } from "../onboardingSteps";

vi.mock("@/features/patients/api/patientsApi", () => ({ patientsApi: { list: vi.fn() } }));
vi.mock("@/features/appointments/api/appointmentsApi", () => ({ appointmentsApi: { list: vi.fn() } }));
vi.mock("@/features/prescriptions/api/prescriptionsApi", () => ({ prescriptionsApi: { list: vi.fn() } }));
vi.mock("@/features/billing/api/billingApi", () => ({ billingApi: { listInvoices: vi.fn() } }));

// jsdom here has no working localStorage; give each test a clean in-memory one.
function memoryStorage(): Storage {
  const data = new Map<string, string>();
  return {
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: (k) => data.get(k) ?? null,
    key: (i) => [...data.keys()][i] ?? null,
    removeItem: (k) => void data.delete(k),
    setItem: (k, v) => void data.set(k, String(v)),
  };
}

const page = (total: number) => Promise.resolve({ items: [], total, page: 1, page_size: 1, total_pages: total });

function setTotals(p: number, a: number, rx: number, inv: number) {
  vi.mocked(patientsApi.list).mockReturnValue(page(p));
  vi.mocked(appointmentsApi.list).mockReturnValue(page(a) as never);
  vi.mocked(prescriptionsApi.list).mockReturnValue(page(rx));
  vi.mocked(billingApi.listInvoices).mockReturnValue(page(inv));
}

function renderChecklist(clinicId = "clinic-1") {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <ThemeProvider theme={createAppTheme()}>
          <OnboardingChecklist clinicId={clinicId} />
        </ThemeProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("buildOnboardingSteps", () => {
  it("ticks a step only when its count is above zero", () => {
    const steps = buildOnboardingSteps({ patient: 3, appointment: 0, prescription: 1 });
    expect(steps.map((s) => [s.id, s.done])).toEqual([
      ["patient", true],
      ["appointment", false],
      ["prescription", true],
      ["invoice", false],
    ]);
  });

  it("needs every count before the list is shown", () => {
    expect(allTotalsKnown({ patient: 0, appointment: 0, prescription: 0 })).toBe(false);
    expect(allTotalsKnown({ patient: 0, appointment: 0, prescription: 0, invoice: 0 })).toBe(true);
  });
});

describe("OnboardingChecklist", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, "localStorage", { value: memoryStorage(), configurable: true });
  });

  it("shows progress from real counts and links the open steps", async () => {
    setTotals(2, 1, 0, 0);
    renderChecklist();

    expect(await screen.findByText("2 of 4 done")).toBeInTheDocument();
    expect(screen.getByText("Add your first patient")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Register patient" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "New prescription" })).toHaveAttribute("href", "/prescriptions/new");
    expect(screen.getByRole("link", { name: "New invoice" })).toHaveAttribute("href", "/billing/invoices/new");
    expect(patientsApi.list).toHaveBeenCalledWith({ page: 1, page_size: 1 });
    expect(appointmentsApi.list).toHaveBeenCalledWith({ page: 1, page_size: 1, clinic_id: "clinic-1" });
  });

  it("hides itself once every step is done", async () => {
    setTotals(1, 1, 1, 1);
    renderChecklist();
    await waitFor(() => expect(billingApi.listInvoices).toHaveBeenCalled());
    await waitFor(() => expect(screen.queryByTestId("onboarding-checklist")).not.toBeInTheDocument());
  });

  it("stays hidden when one count fails to load", async () => {
    setTotals(0, 0, 0, 0);
    vi.mocked(billingApi.listInvoices).mockRejectedValue(new Error("403"));
    renderChecklist();
    await waitFor(() => expect(billingApi.listInvoices).toHaveBeenCalled());
    expect(screen.queryByTestId("onboarding-checklist")).not.toBeInTheDocument();
  });

  it("can be dismissed and stays dismissed for that clinic", async () => {
    setTotals(0, 0, 0, 0);
    const { unmount } = renderChecklist();
    await userEvent.click(await screen.findByRole("button", { name: "Hide checklist" }));
    expect(screen.queryByTestId("onboarding-checklist")).not.toBeInTheDocument();
    expect(window.localStorage.getItem(dismissKey("clinic-1"))).toBe("1");
    unmount();

    vi.clearAllMocks();
    renderChecklist();
    expect(screen.queryByTestId("onboarding-checklist")).not.toBeInTheDocument();
    expect(patientsApi.list).not.toHaveBeenCalled();

    renderChecklist("clinic-2");
    expect(await screen.findByText("0 of 4 done")).toBeInTheDocument();
  });
});
