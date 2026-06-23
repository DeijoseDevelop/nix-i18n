import { describe, it, expect } from "vitest";
import { createI18n } from "../core/createI18n";
import type { Messages } from "../core/types";

describe("createI18n translate", () => {
  const i18n = createI18n<Messages>({
    locale: "es",
    fallbackLocale: "en",
    messages: {
      es: {
        hello: "Hola {name}",
        items: "No hay artículos | Un artículo | {count} artículos",
        greeting: "Hola",
        "greeting_formal": "Buenos días",
      },
      en: {
        hello: "Hello {name}",
        items: "No items | One item | {count} items",
      },
    },
  });

  it("translates simple key", () => {
    expect(i18n.t("hello", { name: "Deiver" })).toBe("Hola Deiver");
  });

  it("uses fallback locale", () => {
    expect(i18n.t("hello", { name: "Deiver" })).toBe("Hola Deiver");
  });

  it("pluralizes", () => {
    expect(i18n.t("items", { count: 0 })).toBe("No hay artículos");
    expect(i18n.t("items", { count: 1 })).toBe("Un artículo");
    expect(i18n.t("items", { count: 5 })).toBe("5 artículos");
  });

  it("supports context", () => {
    expect(i18n.t("greeting")).toBe("Hola");
    expect(i18n.t("greeting", undefined, { context: "formal" })).toBe("Buenos días");
  });

  it("reacts to locale change", () => {
    i18n.setLocale("en");
    expect(i18n.t("hello", { name: "Deiver" })).toBe("Hello Deiver");
    expect(i18n.t("items", { count: 5 })).toBe("5 items");
    i18n.setLocale("es");
  });

  it("returns key when translation is missing", () => {
    expect(i18n.t("missing.key" as never)).toBe("missing.key");
  });

  it("supports namespace helper", () => {
    const i18nWithNs = createI18n<Messages>({
      locale: "es",
      messages: {
        es: {
          "auth:login.title": "Iniciar sesión",
        },
      },
    });

    const auth = i18nWithNs.useNamespace("auth");
    expect(auth.t("login.title")).toBe("Iniciar sesión");
  });
});
