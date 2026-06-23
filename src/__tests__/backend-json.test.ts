import { describe, it, expect, vi } from "vitest";
import { jsonBackend } from "../backends/json";

describe("jsonBackend", () => {
  it("fetches namespace JSON", async () => {
    const data = { hello: "Hola" };
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(data),
    } as unknown as Response);

    const backend = jsonBackend({ baseUrl: "/locales" });
    const result = await backend.load("es", "common");

    expect(result).toEqual(data);
    expect(fetch).toHaveBeenCalledWith("/locales/es/common.json");
  });

  it("handles fetch errors gracefully", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    } as unknown as Response);

    const backend = jsonBackend({ baseUrl: "/locales" });
    const result = await backend.load("es", "common");

    expect(result).toEqual({});
  });

  it("caches repeated loads", async () => {
    const data = { hello: "Hola" };
    const json = vi.fn().mockResolvedValue(data);
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json,
    } as unknown as Response);

    const backend = jsonBackend({ baseUrl: "/locales" });
    await backend.load("es", "common");
    await backend.load("es", "common");

    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
