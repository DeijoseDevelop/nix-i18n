import { describe, it, expect, vi } from "vitest";
import { apiBackend } from "../backends/api";

describe("apiBackend", () => {
  it("fetches from API with query params", async () => {
    const data = { hello: "Hola" };
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(data),
    } as unknown as Response);

    const backend = apiBackend({ url: "/api/translations" });
    const result = await backend.load("es", "common");

    expect(result).toEqual(data);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/translations?locale=es&namespace=common"),
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("sends custom headers", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    } as unknown as Response);

    const backend = apiBackend({
      url: "/api/translations",
      headers: { Authorization: "Bearer token" },
    });
    await backend.load("es", "common");

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: "Bearer token" }),
      }),
    );
  });

  it("handles POST method", async () => {
    const data = { hello: "Hola" };
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(data),
    } as unknown as Response);

    const backend = apiBackend({
      url: "/api/translations",
      method: "POST",
      body: (locale, namespace) => ({ locale, namespace }),
    });
    const result = await backend.load("es", "common");

    expect(result).toEqual(data);
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ locale: "es", namespace: "common" }),
      }),
    );
  });
});
