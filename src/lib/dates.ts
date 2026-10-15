export const DAY_MS = 86_400_000

const pad = (n: number): string => String(n).padStart(2, '0')

/** Local calendar date as 'YYYY-MM-DD'. */
export function dateKey(ms: number): string {
  const d = new Date(ms)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** Keys are parsed as UTC midnight so day maths never meets a DST shift. */
function keyToUtc(key: string): number {
  const [y, m, d] = key.split('-').map(Number)
  return Date.UTC(y, m - 1, d)
}

export function addDays(key: string, n: number): string {
  const d = new Date(keyToUtc(key) + n * DAY_MS)
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`
}

/** Whole days from a to b (b - a). */
export function daysBetween(a: string, b: string): number {
  return Math.round((keyToUtc(b) - keyToUtc(a)) / DAY_MS)
}
