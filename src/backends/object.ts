import type { I18nBackend, Messages } from "../core/types";

export function objectBackend<TMessages extends Messages>(
  messages: Record<string, Partial<TMessages>>,
): I18nBackend<TMessages> {
  return {
    supportsNamespaces: false,
    load(locale: string) {
      return messages[locale] ?? {};
    },
  };
}
