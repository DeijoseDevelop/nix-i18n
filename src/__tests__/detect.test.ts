import { describe, it, expect, vi, afterEach } from "vitest";
import { createI18n } from "../core/createI18n";
import { detectLocalePlugin } from "../plugins/detect";
import type { Messages } from "../core/types";

describe("detectLocalePlugin", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("detects locale from URL path", () => {
    vi.stubGlobal("location", { pathname: "/es/about" });

    const i18n = createI18n<Messages>({
      locale: "en",
      messages: { en: { hello: "Hello" }, es: { hello: "Hola" } },
    });

    detectLocalePlugin(i18n, { order: ["path"] });
    expect(i18n.locale.value).toBe("es");
  });

  it("detects locale from URL path with custom prefix", () => {
    vi.stubGlobal("location", { pathname: "/app/es/about" });

    const i18n = createI18n<Messages>({
      locale: "en",
      messages: { en: { hello: "Hello" }, es: { hello: "Hola" } },
    });

    detectLocalePlugin(i18n, { order: ["path"], pathPrefix: "app" });
    expect(i18n.locale.value).toBe("es");
  });

  it("detects locale from URL query param", () => {
    vi.stubGlobal("location", { search: "?lang=fr" });

    const i18n = createI18n<Messages>({
      locale: "en",
      messages: { en: { hello: "Hello" }, fr: { hello: "Bonjour" } },
    });

    detectLocalePlugin(i18n, { order: ["url"] });
    expect(i18n.locale.value).toBe("fr");
  });

  it("falls back to navigator locale base", () => {
    vi.stubGlobal("navigator", { language: "es-ES" });

    const i18n = createI18n<Messages>({
      locale: "en",
      messages: { en: { hello: "Hello" }, es: { hello: "Hola" } },
    });

    detectLocalePlugin(i18n, { order: ["navigator"] });
    expect(i18n.locale.value).toBe("es");
  });
});
