import type { I18nBackend, Messages } from "../core/types";

export type ApiBackendOptions = {
  url: string;
  headers?: Record<string, string>;
  method?: "GET" | "POST";
  body?: (locale: string, namespace: string) => unknown;
};

export function apiBackend<TMessages extends Messages>(
  options: ApiBackendOptions,
): I18nBackend<TMessages> {
  const cache = new Map<string, Promise<Partial<TMessages>>>();

  return {
    supportsNamespaces: true,
    load(locale: string, namespace: string): Promise<Partial<TMessages>> {
      const cacheKey = `${locale}:${namespace}`;
      if (cache.has(cacheKey)) {
        return cache.get(cacheKey)!;
      }

      const base = typeof location !== "undefined" ? location.origin : "http://localhost";
      const url = new URL(options.url, base);
      url.searchParams.set("locale", locale);
      url.searchParams.set("namespace", namespace);

      const init: RequestInit = {
        method: options.method ?? "GET",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      };

      if (options.method === "POST" && options.body) {
        init.body = JSON.stringify(options.body(locale, namespace));
      }

      const promise = fetch(url.toString(), init)
        .then((res) => {
          if (!res.ok) throw new Error(`[nix-i18n] API error: ${res.status}`);
          return res.json() as Promise<Partial<TMessages>>;
        })
        .catch((err) => {
          console.error(`[nix-i18n] Error loading translations from API:`, err);
          return {} as Partial<TMessages>;
        });

      cache.set(cacheKey, promise);
      return promise;
    },
  };
}
