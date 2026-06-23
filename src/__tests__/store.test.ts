import { describe, it, expect } from "vitest";
import { createI18n } from "../core/createI18n";
import type { Messages } from "../core/types";

describe("createI18n store", () => {
  it("creates a reactive store", () => {
    const i18n = createI18n<Messages>({
      locale: "es",
      messages: { es: { hello: "Hola" } },
    });

    expect(i18n.locale.value).toBe("es");
    expect(i18n.$snapshot()).toEqual({
      locale: "es",
      messages: { es: { hello: "Hola" } },
      loadedNamespaces: [],
      isLoading: false,
    });
  });

  it("setLocale updates the locale", () => {
    const i18n = createI18n<Messages>({
      locale: "es",
      messages: { es: { hello: "Hola" }, en: { hello: "Hello" } },
    });

    i18n.setLocale("en");
    expect(i18n.locale.value).toBe("en");
  });

  it("currentMessages getter reacts to locale", () => {
    const i18n = createI18n({
      locale: "es",
      messages: {
        es: { hello: "Hola" },
        en: { hello: "Hello" },
      },
    });

    expect(i18n.currentMessages.value).toEqual({ hello: "Hola" });
    i18n.setLocale("en");
    expect(i18n.currentMessages.value).toEqual({ hello: "Hello" });
  });

  it("fallbackMessages getter works", () => {
    const i18n = createI18n<Messages>({
      locale: "es",
      fallbackLocale: "en",
      messages: {
        es: { hello: "Hola" },
        en: { hello: "Hello" },
      },
    });

    expect(i18n.fallbackMessages.value).toEqual({ hello: "Hello" });
  });
});
