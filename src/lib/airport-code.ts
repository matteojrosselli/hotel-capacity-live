export function normalizeAirportCode(raw: string): string | null {
  const code = raw.trim().toUpperCase();
  if (!/^[A-Z]{3}$/.test(code)) return null;
  return code;
}
