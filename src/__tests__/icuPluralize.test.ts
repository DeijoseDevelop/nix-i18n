import { describe, it, expect } from "vitest";
import { createI18n } from "../core/createI18n";
import { icuPluralize, icuPluralizePlugin } from "../plugins/icuPluralize";
import type { Messages } from "../core/types";

describe("icuPluralize", () => {
  it("selects one form", () => {
    const template = "{count, plural, one {# item} other {# items}}";
    expect(icuPluralize(template, 1, "en")).toBe("1 item");
  });

  it("selects other form", () => {
    const template = "{count, plural, one {# item} other {# items}}";
    expect(icuPluralize(template, 5, "en")).toBe("5 items");
  });

  it("selects zero form when present", () => {
    const template = "{count, plural, zero {no items} one {# item} other {# items}}";
    expect(icuPluralize(template, 0, "en")).toBe("no items");
  });

  it("returns original template if no ICU plural", () => {
    expect(icuPluralize("hello", 1, "en")).toBe("hello");
  });
});

describe("icuPluralizePlugin", () => {
  it("applies ICU pluralization through t", () => {
    const i18n = createI18n<Messages>({
      locale: "en",
      messages: {
        en: {
          items: "{count, plural, one {# item} other {# items}}",
        },
      },
    });

    icuPluralizePlugin(i18n);

    expect(i18n.t("items", { count: 1 })).toBe("1 item");
    expect(i18n.t("items", { count: 5 })).toBe("5 items");
  });

  it("returns a cleanup function", () => {
    const i18n = createI18n<Messages>({
      locale: "en",
      messages: { en: { items: "{count, plural, one {# item} other {# items}}" } },
    });

    const cleanup = icuPluralizePlugin(i18n);
    expect(typeof cleanup).toBe("function");
    cleanup();
  });
});
