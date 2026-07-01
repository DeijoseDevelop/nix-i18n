import { describe, it, expect } from "vitest";
import { createI18n } from "../core/createI18n";

describe("performance caches smoke test", () => {
  it("formatters reuse Intl instances across calls", () => {
    const i18n = createI18n({ locale: "es", messages: {} });

    // Mismo locale y options -> debería devolver el mismo string
    const d1 = i18n.d(new Date(2026, 5, 23), { dateStyle: "medium" });
    const d2 = i18n.d(new Date(2026, 5, 23), { dateStyle: "medium" });
    expect(d1).toBe(d2);

    // Cambio de locale -> resultado distinto
    i18n.setLocale("en");
    const d3 = i18n.d(new Date(2026, 5, 23), { dateStyle: "medium" });
    expect(d3).not.toBe(d1);

    // Volver a es
    i18n.setLocale("es");
    const d4 = i18n.d(new Date(2026, 5, 23), { dateStyle: "medium" });
    expect(d4).toBe(d1);
  });

  it("number formatter caches and reacts to locale", () => {
    const i18n = createI18n({ locale: "es", messages: {} });

    const n1 = i18n.nFormat(1234.5, { maximumFractionDigits: 2 });
    const n2 = i18n.nFormat(1234.5, { maximumFractionDigits: 2 });
    expect(n1).toBe(n2);

    i18n.setLocale("en");
    const n3 = i18n.nFormat(1234.5, { maximumFractionDigits: 2 });
    expect(n3).not.toBe(n1);
  });

  it("currency formatter caches and reacts to locale", () => {
    const i18n = createI18n({ locale: "es", messages: {} });

    const c1 = i18n.c(99.9, "USD");
    const c2 = i18n.c(99.9, "USD");
    expect(c1).toBe(c2);

    i18n.setLocale("en");
    const c3 = i18n.c(99.9, "USD");
    expect(c3).not.toBe(c1);
  });

  it("relativeTime formatter caches and reacts to locale", () => {
    const i18n = createI18n({ locale: "es", messages: {} });

    const r1 = i18n.rt(-1, "day");
    const r2 = i18n.rt(-1, "day");
    expect(r1).toBe(r2);

    i18n.setLocale("en");
    const r3 = i18n.rt(-1, "day");
    expect(r3).not.toBe(r1);
  });

  it("list formatter caches and reacts to locale", () => {
    const i18n = createI18n({ locale: "es", messages: {} });

    const l1 = i18n.list(["a", "b", "c"], { type: "conjunction" });
    const l2 = i18n.list(["a", "b", "c"], { type: "conjunction" });
    expect(l1).toBe(l2);

    i18n.setLocale("en");
    const l3 = i18n.list(["a", "b", "c"], { type: "conjunction" });
    expect(l3).not.toBe(l1);
  });

  it("translate caches key resolution and invalidates on messages change", () => {
    const i18n = createI18n({
      locale: "es",
      messages: {
        es: { hello: "Hola {name}" },
        en: { hello: "Hello {name}" },
      },
    });

    // Primera llamada
    const t1 = i18n.t("hello", { name: "Deiver" });
    expect(t1).toBe("Hola Deiver");

    // Cache hit -> mismo resultado
    const t2 = i18n.t("hello", { name: "Deiver" });
    expect(t2).toBe(t1);

    // Cambio de locale invalida cache
    i18n.setLocale("en");
    const t3 = i18n.t("hello", { name: "Deiver" });
    expect(t3).toBe("Hello Deiver");

    // Volver a es
    i18n.setLocale("es");
    const t4 = i18n.t("hello", { name: "Deiver" });
    expect(t4).toBe("Hola Deiver");
  });

  it("translate uses fallback correctly with cache", () => {
    const i18n = createI18n({
      locale: "es",
      fallbackLocale: "en",
      messages: {
        es: {},
        en: { hello: "Hello {name}" },
      },
    });

    const t1 = i18n.t("hello", { name: "Deiver" });
    expect(t1).toBe("Hello Deiver");

    const t2 = i18n.t("hello", { name: "Deiver" });
    expect(t2).toBe(t1);
  });

  it("pluralize caches Intl.PluralRules and reacts to locale", () => {
    const i18n = createI18n({
      locale: "es",
      messages: {
        es: { items: "No hay artículos | Un artículo | {count} artículos" },
        en: { items: "No items | One item | {count} items" },
      },
    });

    expect(i18n.t("items", { count: 0 })).toBe("No hay artículos");
    expect(i18n.t("items", { count: 1 })).toBe("Un artículo");
    expect(i18n.t("items", { count: 5 })).toBe("5 artículos");

    i18n.setLocale("en");
    expect(i18n.t("items", { count: 0 })).toBe("No items");
    expect(i18n.t("items", { count: 1 })).toBe("One item");
    expect(i18n.t("items", { count: 5 })).toBe("5 items");
  });

  it("contextual translations work with cache", () => {
    const i18n = createI18n({
      locale: "es",
      messages: {
        es: {
          greeting: "Hola",
          greeting_formal: "Buenos días",
        },
      },
    });

    expect(i18n.t("greeting")).toBe("Hola");
    expect(i18n.t("greeting", undefined, { context: "formal" })).toBe("Buenos días");
    // Repetir para verificar cache
    expect(i18n.t("greeting")).toBe("Hola");
    expect(i18n.t("greeting", undefined, { context: "formal" })).toBe("Buenos días");
  });
});
