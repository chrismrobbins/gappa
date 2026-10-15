import { dateKey } from '../../lib/dates'

/** Today's local date key. The UI reads the clock; core modules take time as an argument. */
export function todayKey(): string {
  return dateKey(Date.now())
}
