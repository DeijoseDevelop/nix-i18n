import { describe, it, expect } from "vitest";
import { createI18n } from "../core/createI18n";
import type { Messages } from "../core/types";

describe("type-safe usage", () => {
  it("infers keys from a typed message schema", () => {
    type MyMessages = {
      hello: "Hello {name}";
      goodbye: "Goodbye {name}";
      nested: {
        title: "Title";
      };
    };

    const i18n = createI18n<MyMessages>({
      locale: "en",
      messages: {
        en: {
          hello: "Hello {name}",
          goodbye: "Goodbye {name}",
          nested: {
            title: "Title",
          },
        },
      },
    });

    expect(i18n.t("hello", { name: "Deiver" })).toBe("Hello Deiver");
    expect(i18n.t("goodbye", { name: "Ana" })).toBe("Goodbye Ana");
    expect(i18n.t("nested.title")).toBe("Title");
  });

  it("works with default Messages type", () => {
    const i18n = createI18n<Messages>({
      locale: "es",
      messages: {
        es: { hello: "Hola {name}" },
      },
    });

    expect(i18n.t("hello", { name: "Deiver" })).toBe("Hola Deiver");
  });
});
