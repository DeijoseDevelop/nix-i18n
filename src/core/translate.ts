import { interpolate, readValue } from "./interpolate";
import { pluralize, isPluralTemplate } from "./pluralize";
import { resolveKey } from "./resolveKey";
import type {
  I18nInstance,
  InterpolationMap,
  Messages,
  NamespaceApi,
  PluralFn,
  TranslateFn,
} from "./types";

export function createTranslate<TMessages extends Messages>(
  i18n: I18nInstance<TMessages>,
): I18nInstance<TMessages>["t"] {
  return ((key: string, params?: InterpolationMap, options?: { context?: string }) => {
    const locale = i18n.locale.value;
    const messages = i18n.currentMessages.value as Partial<TMessages>;
    const fallback = i18n.fallbackMessages.value as Partial<TMessages>;

    let resolved: string | undefined = resolveKey(messages, key);

    if (resolved === undefined && fallback) {
      resolved = resolveKey(fallback, key);
    }

    if (resolved === undefined) {
      return key;
    }

    if (options?.context) {
      const contextual = resolveKey(messages, `${key}_${options.context}`)
        ?? resolveKey(fallback, `${key}_${options.context}`);
      if (contextual !== undefined) {
        resolved = contextual;
      }
    }

    if (params && "count" in params && isPluralTemplate(resolved)) {
      const count = readValue(params.count);
      resolved = pluralize(Number(count) || 0, resolved, locale);
    }

    if (params) {
      resolved = interpolate(resolved, params);
    }

    return resolved;
  }) as I18nInstance<TMessages>["t"];
}

type SimpleTranslate = (key: string, params?: InterpolationMap, options?: { context?: string }) => string;
type SimplePlural = (count: number, key: string, params?: InterpolationMap) => string;

export function createPlural<TMessages extends Messages>(
  t: TranslateFn<TMessages>,
): PluralFn<TMessages> {
  const simple = t as SimpleTranslate;
  return ((count: number, key: string, params?: InterpolationMap) => {
    return simple(key, { ...(params ?? {}), count });
  }) as PluralFn<TMessages>;
}

export function createNamespaceApi<TMessages extends Messages>(
  t: TranslateFn<TMessages>,
  n: PluralFn<TMessages>,
  namespace: string,
): NamespaceApi<TMessages> {
  const simpleT = t as SimpleTranslate;
  const simpleN = n as SimplePlural;
  return {
    t: (key: string, params?: InterpolationMap, options?: { context?: string }) =>
      simpleT(`${namespace}:${key}`, params, options),
    n: (count: number, key: string, params?: InterpolationMap) =>
      simpleN(count, `${namespace}:${key}`, params),
  };
}

