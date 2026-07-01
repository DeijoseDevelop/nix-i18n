const PLURAL_CATEGORIES: Intl.LDMLPluralRule[] = ["zero", "one", "two", "few", "many", "other"];

const pluralRulesCache = new Map<string, Intl.PluralRules>();

function getPluralRules(locale: string): Intl.PluralRules {
  let pr = pluralRulesCache.get(locale);
  if (!pr) {
    pr = new Intl.PluralRules(locale);
    pluralRulesCache.set(locale, pr);
  }
  return pr;
}

export function pluralize(
  count: number,
  template: string,
  locale: string,
): string {
  const segments = template.split("|").map((s) => s.trim());

  let index: number;
  switch (segments.length) {
    case 1:
      index = 0;
      break;
    case 2:
      index = count === 1 ? 0 : 1;
      break;
    case 3:
      index = count === 0 ? 0 : count === 1 ? 1 : 2;
      break;
    default:
      index = PLURAL_CATEGORIES.indexOf(getPluralRules(locale).select(count));
      break;
  }

  const segment = segments[index] ?? segments[segments.length - 1] ?? "";
  return interpolateCount(segment, count);
}

function interpolateCount(template: string, count: number): string {
  return template.replace(/\{count\}/g, String(count));
}

export function isPluralTemplate(value: string): boolean {
  return value.includes("|");
}
