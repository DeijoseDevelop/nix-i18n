import { describe, it, expect } from "vitest";
import { pluralize, isPluralTemplate } from "../core/pluralize";

describe("pluralize", () => {
  it("selects zero form", () => {
    expect(pluralize(0, "No items | One item | {count} items", "en")).toBe("No items");
  });

  it("selects one form", () => {
    expect(pluralize(1, "No items | One item | {count} items", "en")).toBe("One item");
  });

  it("selects other form", () => {
    expect(pluralize(5, "No items | One item | {count} items", "en")).toBe("5 items");
  });

  it("handles Spanish plurals", () => {
    const template = "No hay artículos | Un artículo | {count} artículos";
    expect(pluralize(0, template, "es")).toBe("No hay artículos");
    expect(pluralize(1, template, "es")).toBe("Un artículo");
    expect(pluralize(5, template, "es")).toBe("5 artículos");
  });

  it("detects plural templates", () => {
    expect(isPluralTemplate("a | b | c")).toBe(true);
    expect(isPluralTemplate("simple text")).toBe(false);
  });
});
