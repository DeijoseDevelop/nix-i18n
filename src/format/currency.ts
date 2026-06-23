import type { I18nStore, Messages } from "../core/types";

export function createCurrencyFormatter<TMessages extends Messages>(
  i18n: I18nStore<TMessages>,
): (
  value: number,
  currency: string,
  options?: Omit<Intl.NumberFormatOptions, "style" | "currency">,
) => string {
  return (value, currency, options) => {
    const locale = i18n.locale.value;
    return new Intl.NumberFormat(locale, {
      ...options,
      style: "currency",
      currency,
    }).format(value);
  };
}
