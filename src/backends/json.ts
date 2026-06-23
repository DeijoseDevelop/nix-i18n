import type { I18nBackend, Messages } from "../core/types";

export type JsonBackendOptions = {
  baseUrl: string;
  namespaces?: string[];
};

export function jsonBackend<TMessages extends Messages>(
  options: JsonBackendOptions,
): I18nBackend<TMessages> {
  const { baseUrl } = options;
  const cache = new Map<string, Promise<Partial<TMessages>>>();

  return {
    supportsNamespaces: true,
    load(locale: string, namespace: string): Promise<Partial<TMessages>> {
      const cacheKey = `${locale}:${namespace}`;
      if (cache.has(cacheKey)) {
        return cache.get(cacheKey)!;
      }

      const url = `${baseUrl.replace(/\/$/, "")}/${locale}/${namespace}.json`;
      const promise = fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error(`[nix-i18n] Failed to load ${url}: ${res.status}`);
          return res.json() as Promise<Partial<TMessages>>;
        })
        .catch((err) => {
          console.error(`[nix-i18n] Error loading namespace "${namespace}" for locale "${locale}":`, err);
          return {} as Partial<TMessages>;
        });

      cache.set(cacheKey, promise);
      return promise;
    },
  };
}
