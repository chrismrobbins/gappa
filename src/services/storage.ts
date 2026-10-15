import { asProgress } from '../lib/progress'
import type { Progress } from '../types'

const PREFIX = 'gappa.progress.v1'

/** One saved copy per account (and one for local mode), so a shared device never mixes learners. */
function keyFor(owner: string | null): string {
  return owner ? `${PREFIX}:${owner}` : PREFIX
}

/** Storage can be missing or throw (private mode, quota), so every access is guarded. */
export function loadLocal(owner: string | null): Progress | null {
  try {
    const raw = localStorage.getItem(keyFor(owner))
    return raw ? asProgress(JSON.parse(raw)) : null
  } catch {
    return null
  }
}

export function saveLocal(p: Progress, owner: string | null): void {
  try {
    localStorage.setItem(keyFor(owner), JSON.stringify(p))
  } catch {
    // Out of space or blocked: progress stays in memory for this session.
  }
}
