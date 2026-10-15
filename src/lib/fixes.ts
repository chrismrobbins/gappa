import type { OpenFix } from '../types'

export interface FixGroup { lessonId: string; lessonTitle: string; fixes: OpenFix[] }

/** Open fixes grouped by lesson, in the order lessons first appear in `lessonOrder`. */
export function groupFixes(fixes: readonly OpenFix[], titles: ReadonlyMap<string, string>, lessonOrder: readonly string[]): FixGroup[] {
  const rank = (id: string) => { const i = lessonOrder.indexOf(id); return i < 0 ? lessonOrder.length : i }
  const ids = [...new Set(fixes.map((f) => f.lessonId))].sort((a, b) => rank(a) - rank(b))
  return ids.map((id) => ({
    lessonId: id, lessonTitle: titles.get(id) ?? id, fixes: fixes.filter((f) => f.lessonId === id),
  }))
}

/** Voice column -> words for people: 'all' / a voice name / nothing. */
export function voiceLabel(voice: string | null, names: ReadonlyMap<string, string>): string | null {
  if (!voice) return null
  return voice === 'all' ? 'All voices' : names.get(voice) ?? voice
}
