import type { I18nStore } from "../core/types";
import type { Messages } from "../core/types";
import { createIntlFormatterCache } from "./intlCache";

const dateFormatterCache = createIntlFormatterCache(
  (locale: string, options?: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(locale, options),
);

export function createDateFormatter<TMessages extends Messages>(
  i18n: I18nStore<TMessages>,
): (value: Date | number, options?: Intl.DateTimeFormatOptions) => string {
  return (value, options) => {
    const locale = i18n.locale.value;
    return dateFormatterCache(locale, options).format(value);
  };
}
