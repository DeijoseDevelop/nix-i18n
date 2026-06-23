import type { I18nStore } from "../core/types";
import type { Messages } from "../core/types";

export function createDateFormatter<TMessages extends Messages>(
  i18n: I18nStore<TMessages>,
): (value: Date | number, options?: Intl.DateTimeFormatOptions) => string {
  return (value, options) => {
    const locale = i18n.locale.value;
    return new Intl.DateTimeFormat(locale, options).format(value);
  };
}
