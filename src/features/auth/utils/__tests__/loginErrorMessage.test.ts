import { describe, it, expect } from "vitest";
import { AxiosError, AxiosHeaders, type AxiosResponse } from "axios";
import { getLoginErrorMessage, LOGIN_ERROR_MESSAGES } from "../loginErrorMessage";

function axiosErrorWith(response?: { status: number; data?: unknown }): AxiosError {
  const config = { headers: new AxiosHeaders() };
  const res = response
    ? ({ ...response, statusText: "", headers: {}, config } as AxiosResponse)
    : undefined;
  return new AxiosError("Request failed", response ? "ERR_BAD_RESPONSE" : "ERR_NETWORK", config, {}, res);
}

describe("getLoginErrorMessage", () => {
  it("reports an unreachable server when there is no response (network or CORS failure)", () => {
    expect(getLoginErrorMessage(axiosErrorWith())).toBe(LOGIN_ERROR_MESSAGES.unreachable);
  });

  it("reports a server problem for a 5xx, even when it carries a detail", () => {
    expect(getLoginErrorMessage(axiosErrorWith({ status: 500 }))).toBe(LOGIN_ERROR_MESSAGES.server);
    expect(getLoginErrorMessage(axiosErrorWith({ status: 503, data: { detail: "db down" } }))).toBe(
      LOGIN_ERROR_MESSAGES.server,
    );
  });

  it("shows the API detail for a 401 or 400 that has one", () => {
    expect(getLoginErrorMessage(axiosErrorWith({ status: 401, data: { detail: "Account locked" } }))).toBe(
      "Account locked",
    );
    expect(getLoginErrorMessage(axiosErrorWith({ status: 400, data: { detail: "Email not verified" } }))).toBe(
      "Email not verified",
    );
  });

  it("falls back to invalid credentials for a 401 without a detail", () => {
    expect(getLoginErrorMessage(axiosErrorWith({ status: 401 }))).toBe(LOGIN_ERROR_MESSAGES.invalidCredentials);
    expect(getLoginErrorMessage(axiosErrorWith({ status: 401, data: {} }))).toBe(
      LOGIN_ERROR_MESSAGES.invalidCredentials,
    );
  });
});
