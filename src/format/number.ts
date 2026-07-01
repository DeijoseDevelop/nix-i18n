import type { I18nStore, Messages } from "../core/types";
import { createIntlFormatterCache } from "./intlCache";

const numberFormatterCache = createIntlFormatterCache(
  (locale: string, options?: Intl.NumberFormatOptions) =>
    new Intl.NumberFormat(locale, options),
);

export function createNumberFormatter<TMessages extends Messages>(
  i18n: I18nStore<TMessages>,
): (value: number, options?: Intl.NumberFormatOptions) => string {
  return (value, options) => {
    const locale = i18n.locale.value;
    return numberFormatterCache(locale, options).format(value);
  };
}
