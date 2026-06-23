import type { I18nStore, Messages } from "../core/types";

export function createListFormatter<TMessages extends Messages>(
  i18n: I18nStore<TMessages>,
): (values: string[], options?: Intl.ListFormatOptions) => string {
  return (values, options) => {
    const locale = i18n.locale.value;
    return new Intl.ListFormat(locale, options).format(values);
  };
}
