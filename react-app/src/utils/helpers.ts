export function fmtDate(iso: string | null, t: any): string {
  if (!iso) return t.present;
  const d = new Date(iso);
  return `${t.months[d.getMonth()]} ${d.getFullYear()}`;
}