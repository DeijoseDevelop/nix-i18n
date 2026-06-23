import { describe, it, expect } from "vitest";
import { createI18n } from "../core/createI18n";
import type { Messages } from "../core/types";

describe("nestedFallback", () => {
  it("returns exact nested key when available", () => {
    const i18n = createI18n<Messages>({
      locale: "es",
      nestedFallback: true,
      messages: {
        es: {
          auth: {
            login: {
              title: "Iniciar sesión",
            },
          },
        },
      },
    });

    expect(i18n.t("auth.login.title")).toBe("Iniciar sesión");
  });

  it("falls back to parent key when full path is missing", () => {
    const i18n = createI18n<Messages>({
      locale: "es",
      nestedFallback: true,
      messages: {
        es: {
          auth: {
            login: "Acceder",
          },
        },
      },
    });

    expect(i18n.t("auth.login.title")).toBe("Acceder");
  });

  it("falls back to trailing key across namespace", () => {
    const i18n = createI18n<Messages>({
      locale: "es",
      nestedFallback: true,
      messages: {
        es: {
          title: "Título",
        },
      },
    });

    expect(i18n.t("auth:login.title")).toBe("Título");
  });

  it("returns the key itself when no fallback is found", () => {
    const i18n = createI18n<Messages>({
      locale: "es",
      nestedFallback: true,
      messages: {
        es: {
          hello: "Hola",
        },
      },
    });

    expect(i18n.t("auth.login.title")).toBe("auth.login.title");
  });

  it("does not use nested fallback when disabled", () => {
    const i18n = createI18n<Messages>({
      locale: "es",
      messages: {
        es: {
          title: "Título",
        },
      },
    });

    expect(i18n.t("auth.login.title")).toBe("auth.login.title");
  });
});
