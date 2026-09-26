export function fmtDate(iso: string | null, t: any): string {
  if (!iso) return t.present;
  const d = new Date(iso);
  return `${t.months[d.getMonth()]} ${d.getFullYear()}`;
}
const API_ORIGIN = import.meta.env.VITE_BACKEND_URL ?? "";
export const imageSrc = (url: string): string =>
  url.startsWith("http") ? url : API_ORIGIN + url;
