import type { I18nStore, Messages } from "../core/types";

export function createNumberFormatter<TMessages extends Messages>(
  i18n: I18nStore<TMessages>,
): (value: number, options?: Intl.NumberFormatOptions) => string {
  return (value, options) => {
    const locale = i18n.locale.value;
    return new Intl.NumberFormat(locale, options).format(value);
  };
}
