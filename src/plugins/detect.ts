import type { I18nInstance, DetectOptions, Messages } from "../core/types";

export function detectLocalePlugin<TMessages extends Messages>(
  i18n: I18nInstance<TMessages>,
  options: DetectOptions = {},
): void {
  const order = options.order ?? ["localStorage", "navigator", "fallback"];
  const storageKey = options.storageKey ?? "nix-i18n-locale";
  const urlParam = options.urlParam ?? "lang";

  for (const source of order) {
    const detected = detectFrom(source, i18n, storageKey, urlParam);
    if (detected && isLocaleSupported(i18n, detected)) {
      i18n.setLocale(detected);
      return;
    }
  }

  const base = i18n.locale.value.split("-")[0];
  if (base && isLocaleSupported(i18n, base)) {
    i18n.setLocale(base);
  }
}

function detectFrom<TMessages extends Messages>(
  source: NonNullable<DetectOptions["order"]>[number],
  i18n: I18nInstance<TMessages>,
  storageKey: string,
  urlParam: string,
): string | null {
  switch (source) {
    case "localStorage":
      return typeof localStorage !== "undefined" ? localStorage.getItem(storageKey) : null;
    case "sessionStorage":
      return typeof sessionStorage !== "undefined" ? sessionStorage.getItem(storageKey) : null;
    case "navigator":
      return typeof navigator !== "undefined" ? navigator.language : null;
    case "url": {
      if (typeof location === "undefined") return null;
      const params = new URLSearchParams(location.search);
      return params.get(urlParam);
    }
    case "fallback":
      return i18n.fallbackLocale ?? i18n.locale.value;
    default:
      return null;
  }
}

function isLocaleSupported<TMessages extends Messages>(
  i18n: I18nInstance<TMessages>,
  locale: string | undefined,
): boolean {
  if (!locale) return false;
  const available = Object.keys(i18n.messages.value);
  if (available.length === 0) return true;
  if (available.includes(locale)) return true;
  const base = locale.split("-")[0] ?? locale;
  return base !== locale && available.includes(base);
}
