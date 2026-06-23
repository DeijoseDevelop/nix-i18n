import type { Messages } from "./types";

export function resolveKey<TMessages extends Messages>(
  messages: Partial<TMessages>,
  key: string,
): string | undefined {
  if (!key) return undefined;

  const byPath = resolveByPath(messages, key);
  if (byPath !== undefined) return byPath;

  return resolveExact(messages, key);
}

function resolveByPath(messages: unknown, key: string): string | undefined {
  const parts = key.split(".");
  let current: unknown = messages;

  for (const part of parts) {
    if (current == null || typeof current !== "object") {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }

  return typeof current === "string" ? current : undefined;
}

function resolveExact(messages: unknown, key: string): string | undefined {
  if (messages == null || typeof messages !== "object") return undefined;
  const value = (messages as Record<string, unknown>)[key];
  return typeof value === "string" ? value : undefined;
}

export function resolveKeyWithFallback<TMessages extends Messages>(
  messages: Partial<TMessages>,
  fallback: Partial<TMessages>,
  key: string,
): string | undefined {
  return resolveKey(messages, key) ?? resolveKey(fallback, key);
}

export function applyContext(
  messages: Record<string, unknown>,
  key: string,
  context?: string,
): string | undefined {
  if (!context) return undefined;
  const contextualKey = `${key}_${context}`;
  return resolveKey(messages as Messages, contextualKey);
}
