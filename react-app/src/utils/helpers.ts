// src/utils/helpers.ts

/**
 * Форматирует ISO-дату в строку вида "мар 2026" с учётом переданной локализации.
 * Если дата отсутствует, возвращает подпись "сейчас".
 */
export function fmtDate(iso: string | null, t: any): string {
  if (!iso) return t.present;
  const d = new Date(iso);
  return `${t.months[d.getMonth()]} ${d.getFullYear()}`;
}
