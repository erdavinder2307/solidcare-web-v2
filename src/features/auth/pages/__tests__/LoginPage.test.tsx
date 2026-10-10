import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AxiosError, AxiosHeaders, type AxiosResponse } from "axios";
import LoginPage from "../LoginPage";
import { authApi } from "../../api/authApi";
import { databaseHealthApi } from "../../api/databaseHealthApi";
import { DATABASE_WAIT_TEXT } from "../../components/DatabaseWaitCard";

vi.mock("../../api/authApi", () => ({ authApi: { login: vi.fn() } }));
vi.mock("../../api/databaseHealthApi", () => ({
  databaseHealthApi: { wake: vi.fn().mockResolvedValue(undefined), check: vi.fn() },
}));

const login = vi.mocked(authApi.login);
const check = vi.mocked(databaseHealthApi.check);
const wake = vi.mocked(databaseHealthApi.wake);

function apiError(status: number, data: unknown): AxiosError {
  const config = { headers: new AxiosHeaders() };
  const response = { status, data, statusText: "", headers: {}, config } as AxiosResponse;
  return new AxiosError("Request failed", "ERR_BAD_RESPONSE", config, {}, response);
}
const dbStarting = () => apiError(503, { error_code: "DB_STARTING", detail: "starting" });
const tokens = {
  access_token: "a",
  refresh_token: "r",
  token_type: "bearer",
  expires_in: 900,
  requires_mfa: false,
  mfa_token: null,
};

function renderLogin() {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<div>Dashboard</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

async function signIn() {
  fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: "doc@example.test" } });
  fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: "secret-pass-1" } });
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
  });
}

const advance = (ms: number) => act(() => vi.advanceTimersByTimeAsync(ms));

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  login.mockReset();
  check.mockReset();
  wake.mockClear();
});
afterEach(() => vi.useRealTimers());

describe("LoginPage while the database wakes", () => {
  it("wakes the database once when the page opens", () => {
    renderLogin();
    expect(wake).toHaveBeenCalledTimes(1);
  });

  it("shows the waiting card on DB_STARTING and signs in automatically when ready", async () => {
    login.mockRejectedValueOnce(dbStarting()).mockResolvedValueOnce(tokens);
    check.mockResolvedValueOnce("starting").mockResolvedValue("ready");
    renderLogin();
    await signIn();

    expect(await screen.findByText(DATABASE_WAIT_TEXT.title)).toBeInTheDocument();
    expect(screen.getByText(DATABASE_WAIT_TEXT.body)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Sign in" })).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    await advance(10_000); // first poll: still starting
    expect(login).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText("Time waited")).toHaveTextContent("0:10");

    await advance(10_000); // second poll: ready → same details sent again
    expect(login).toHaveBeenCalledTimes(2);
    expect(login.mock.calls[1][0]).toEqual({ email: "doc@example.test", password: "secret-pass-1" });
    expect(await screen.findByText("Dashboard")).toBeInTheDocument();
  });

  it("after 5 minutes offers Try again, which signs in again", async () => {
    login.mockRejectedValueOnce(dbStarting()).mockResolvedValueOnce(tokens);
    check.mockResolvedValue("starting");
    renderLogin();
    await signIn();
    await screen.findByText(DATABASE_WAIT_TEXT.title);

    await advance(5 * 60_000);
    expect(screen.getByText(DATABASE_WAIT_TEXT.timedOut)).toBeInTheDocument();
    expect(screen.queryByText(DATABASE_WAIT_TEXT.title)).not.toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: DATABASE_WAIT_TEXT.tryAgain }));
    });
    expect(login).toHaveBeenCalledTimes(2);
    expect(await screen.findByText("Dashboard")).toBeInTheDocument();
  });

  it("keeps the normal message for a real error", async () => {
    login.mockRejectedValueOnce(apiError(401, { detail: "Invalid credentials. Please try again." }));
    renderLogin();
    await signIn();

    expect(await screen.findByRole("alert")).toHaveTextContent("Invalid credentials. Please try again.");
    expect(screen.queryByText(DATABASE_WAIT_TEXT.title)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
  });
});
