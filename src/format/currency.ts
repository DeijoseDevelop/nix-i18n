import type { I18nStore, Messages } from "../core/types";
import { createIntlFormatterCache } from "./intlCache";

const currencyFormatterCache = createIntlFormatterCache(
  (locale: string, options?: Intl.NumberFormatOptions) =>
    new Intl.NumberFormat(locale, options),
);

export function createCurrencyFormatter<TMessages extends Messages>(
  i18n: I18nStore<TMessages>,
): (
  value: number,
  currency: string,
  options?: Omit<Intl.NumberFormatOptions, "style" | "currency">,
) => string {
  return (value, currency, options) => {
    const locale = i18n.locale.value;
    return currencyFormatterCache(locale, {
      ...options,
      style: "currency",
      currency,
    }).format(value);
  };
}
