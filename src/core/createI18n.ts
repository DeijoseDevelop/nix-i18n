import { createInjectionKey } from "@deijose/nix-js";
import { createI18nStore } from "./createI18nStore";
import { createTranslate, createPlural, createNamespaceApi } from "./translate";
import { createDateFormatter } from "../format/date";
import { createNumberFormatter } from "../format/number";
import { createCurrencyFormatter } from "../format/currency";
import { createRelativeTimeFormatter } from "../format/relativeTime";
import { createListFormatter } from "../format/list";
import { persistLocalePlugin } from "../plugins/persist";
import { detectLocalePlugin } from "../plugins/detect";
import type {
  I18nInstance,
  I18nOptions,
  Messages,
} from "./types";

export const I18nInjectionKey = createInjectionKey<I18nInstance>("nix-i18n");

export function createI18n<TMessages extends Messages = Messages>(
  options: I18nOptions<TMessages>,
): I18nInstance<TMessages> {
  const backend = options.backend;
  const namespaces = options.namespaces ?? [];

  const store = createI18nStore<TMessages>(options, backend);

  const t = createTranslate<TMessages>(store as I18nInstance<TMessages>);
  const n = createPlural(t);

  const i18n: I18nInstance<TMessages> = Object.assign(store, {
    t,
    n,
    fallbackLocale: options.fallbackLocale ?? options.locale,
    d: createDateFormatter(store),
    nFormat: createNumberFormatter(store),
    c: createCurrencyFormatter(store),
    rt: createRelativeTimeFormatter(store),
    list: createListFormatter(store),
    useNamespace: (namespace: string) => createNamespaceApi(t, n, namespace),
  });

  if (options.persist) {
    const persistOptions = typeof options.persist === "object" ? options.persist : {};
    persistLocalePlugin(i18n, persistOptions);
  }

  if (options.detect) {
    const detectOptions = typeof options.detect === "object" ? options.detect : {};
    detectLocalePlugin(i18n, detectOptions);
  }

  if (backend && namespaces.length > 0) {
    for (const ns of namespaces) {
      void i18n.loadNamespace(ns);
    }
  }

  return i18n;
}
