// src/lib/plural.ts
const rules: Record<string, Intl.PluralRules> = {};

export function plural(
  n: number,
  forms: Partial<Record<Intl.LDMLPluralRule, string>>,
  locale = "ru",
) {
  rules[locale] ||= new Intl.PluralRules(locale);
  const form = forms[rules[locale].select(n)] ?? forms.other ?? "";
  return `${n} ${form}`;
}