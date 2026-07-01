export function createIntlFormatterCache<
  TOptions extends object,
  TFormatter extends { format: (...args: any[]) => string },
>(
  createFormatter: (locale: string, options?: TOptions) => TFormatter,
): (locale: string, options?: TOptions) => TFormatter {
  const cache = new Map<string, TFormatter>();
  return (locale, options) => {
    const key = locale + ":" + JSON.stringify(options ?? {});
    let formatter = cache.get(key);
    if (!formatter) {
      formatter = createFormatter(locale, options);
      cache.set(key, formatter);
    }
    return formatter;
  };
}
