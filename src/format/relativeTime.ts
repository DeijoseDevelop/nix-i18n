import type { I18nStore, Messages } from "../core/types";
import { createIntlFormatterCache } from "./intlCache";

const relativeTimeFormatterCache = createIntlFormatterCache(
  (locale: string, options?: Intl.RelativeTimeFormatOptions) =>
    new Intl.RelativeTimeFormat(locale, options),
);

export function createRelativeTimeFormatter<TMessages extends Messages>(
  i18n: I18nStore<TMessages>,
): (
  value: number,
  unit: Intl.RelativeTimeFormatUnit,
  options?: Intl.RelativeTimeFormatOptions,
) => string {
  return (value, unit, options) => {
    const locale = i18n.locale.value;
    return relativeTimeFormatterCache(locale, options).format(value, unit);
  };
}
