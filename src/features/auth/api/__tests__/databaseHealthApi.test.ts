import { afterEach, describe, expect, it, vi } from "vitest";
import axios from "axios";
import { databaseHealthApi, databaseHealthUrl } from "../databaseHealthApi";

afterEach(() => vi.restoreAllMocks());

describe("databaseHealthUrl", () => {
  it("sits at the API root, next to /api/v1", () => {
    expect(databaseHealthUrl("https://api.example.test/api/v1")).toBe("https://api.example.test/health/db");
    expect(databaseHealthUrl("https://api.example.test/api/v1/")).toBe("https://api.example.test/health/db");
    expect(databaseHealthUrl("/api/v1")).toBe("/health/db");
  });
});

describe("databaseHealthApi.check", () => {
  const reply = (status: number, data: unknown) =>
    vi.spyOn(axios, "get").mockResolvedValue({ status, data } as never);

  it("maps the API replies", async () => {
    reply(200, { database: "ready" });
    expect(await databaseHealthApi.check()).toBe("ready");
    reply(503, { database: "starting", error_code: "DB_STARTING" });
    expect(await databaseHealthApi.check()).toBe("starting");
    reply(503, { database: "unreachable", error_code: null });
    expect(await databaseHealthApi.check()).toBe("unknown");
    reply(404, "<html>");
    expect(await databaseHealthApi.check()).toBe("unknown");
  });

  it("reports unknown when the request fails", async () => {
    vi.spyOn(axios, "get").mockRejectedValue(new Error("Network Error"));
    expect(await databaseHealthApi.check()).toBe("unknown");
  });
});

describe("databaseHealthApi.wake", () => {
  it("never throws", async () => {
    const post = vi.spyOn(axios, "post").mockRejectedValue(new Error("Network Error"));
    await expect(databaseHealthApi.wake()).resolves.toBeUndefined();
    expect(post).toHaveBeenCalledWith("/health/db", undefined, expect.anything());
  });
});
