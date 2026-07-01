import type { I18nStore, Messages } from "../core/types";
import { createIntlFormatterCache } from "./intlCache";

const listFormatterCache = createIntlFormatterCache(
  (locale: string, options?: Intl.ListFormatOptions) =>
    new Intl.ListFormat(locale, options),
);

export function createListFormatter<TMessages extends Messages>(
  i18n: I18nStore<TMessages>,
): (values: string[], options?: Intl.ListFormatOptions) => string {
  return (values, options) => {
    const locale = i18n.locale.value;
    return listFormatterCache(locale, options).format(values);
  };
}
