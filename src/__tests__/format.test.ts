import { describe, it, expect } from "vitest";
import { createI18n } from "../core/createI18n";

describe("formatters", () => {
  const i18n = createI18n({
    locale: "es",
    messages: {},
  });

  it("formats dates", () => {
    const date = new Date(2026, 5, 23);
    expect(i18n.d(date, { dateStyle: "medium" })).toBe("23 jun 2026");
  });

  it("formats numbers", () => {
    expect(i18n.nFormat(1234.5, { maximumFractionDigits: 2 })).toBe("1234,5");
  });

  it("formats currency", () => {
    expect(i18n.c(99.9, "USD")).toMatch(/99,90\sUS\$/);
  });

  it("formats relative time", () => {
    expect(i18n.rt(-1, "day")).toBe("hace 1 día");
  });

  it("formats lists", () => {
    expect(i18n.list(["a", "b", "c"], { type: "conjunction" })).toBe("a, b y c");
  });

  it("reacts to locale change", () => {
    i18n.setLocale("en");
    expect(i18n.c(99.9, "USD")).toBe("$99.90");
    i18n.setLocale("es");
  });
});
