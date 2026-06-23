import type { I18nStore, Messages } from "../core/types";

export function createRelativeTimeFormatter<TMessages extends Messages>(
  i18n: I18nStore<TMessages>,
): (
  value: number,
  unit: Intl.RelativeTimeFormatUnit,
  options?: Intl.RelativeTimeFormatOptions,
) => string {
  return (value, unit, options) => {
    const locale = i18n.locale.value;
    return new Intl.RelativeTimeFormat(locale, options).format(value, unit);
  };
}
