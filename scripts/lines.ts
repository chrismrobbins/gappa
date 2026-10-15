// Pure: every line a course can say, deduped by canonical form.
import { canonicalLine } from '../src/lib/audioKey'
import type { Course, Item } from '../src/types'

function lessonItems(course: Course): Item[] {
  return course.units.flatMap((u) =>
    u.lessons.flatMap((l) => [...l.words, ...l.phrases, ...(l.tip?.examples ?? [])]),
  )
}

function letterLines(course: Course): string[] {
  return course.script.flatMap((s) => s.letters.flatMap((l) => [l.char, l.example.target]))
}

export function collectLines(course: Course): string[] {
  const all = [...letterLines(course), ...lessonItems(course).map((i) => i.target)]
  return [...new Set(all.map(canonicalLine).filter(Boolean))]
}

/** Billing counts characters (code points), not UTF-16 units. */
export function charCount(line: string): number {
  return [...line].length
}
