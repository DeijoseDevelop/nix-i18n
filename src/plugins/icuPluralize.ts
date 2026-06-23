import type { I18nInstance, Messages } from "../core/types";

export type PluralCategory = "zero" | "one" | "two" | "few" | "many" | "other";

export function icuPluralize(
  template: string,
  count: number,
  locale: string,
): string {
  const match = template.match(/\{count,\s*plural,\s*(.+)\s*\}/s);
  if (!match) return template;

  const rulesText = match[1];
  const rules = parseRules(rulesText);
  const category = selectPluralCategory(count, locale, rules);
  const rule = rules[category] ?? rules.other;
  if (!rule) return template;

  return rule.replace(/#/g, String(count)).replace(/\{count\}/g, String(count));
}

function parseRules(text: string): Record<PluralCategory, string> {
  const rules: Partial<Record<PluralCategory, string>> = {};
  const regex = /(\w+)\s*\{([^}]*)\}/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const category = match[1] as PluralCategory;
    rules[category] = match[2].trim();
  }
  return rules as Record<PluralCategory, string>;
}

function selectPluralCategory(
  count: number,
  locale: string,
  rules: Record<PluralCategory, string>,
): PluralCategory {
  const categories = Object.keys(rules) as PluralCategory[];
  if (categories.includes("one") && count === 1) return "one";
  if (categories.includes("zero") && count === 0) return "zero";
  if (categories.includes("two") && count === 2) return "two";

  const intlCategory = new Intl.PluralRules(locale).select(count) as PluralCategory;
  if (categories.includes(intlCategory)) return intlCategory;
  return "other";
}

export function icuPluralizePlugin<TMessages extends Messages>(
  i18n: I18nInstance<TMessages>,
): () => void {
  const originalT = i18n.t;
  i18n.t = ((key: string, params?: Record<string, unknown>, options?: { context?: string }) => {
    const result = originalT(key as never, params as never, options);
    if (params && typeof params.count === "number" && result.includes("{count, plural")) {
      return icuPluralize(result, params.count, i18n.locale.value);
    }
    return result;
  }) as I18nInstance<TMessages>["t"];

  return () => {
    i18n.t = originalT;
  };
}
