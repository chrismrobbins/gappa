// Review keys and course lookups.

import type { Course, Item, ItemKey, Lesson, Letter, ScriptLesson } from '../types'

export type EntryKind = 'w' | 'p' | 'l'

interface ParsedKey {
  lessonId: string
  kind: EntryKind
  target: string
}

export function itemKey(lessonId: string, kind: EntryKind, target: string): ItemKey {
  return `${lessonId}|${kind}|${target}`
}

export function parseKey(key: ItemKey): ParsedKey | undefined {
  const [lessonId, kind, ...rest] = key.split('|')
  const validKind = kind === 'w' || kind === 'p' || kind === 'l'
  if (!lessonId || !validKind || rest.length === 0) return undefined
  return { lessonId, kind, target: rest.join('|') }
}

export function lessonsOf(course: Course): Lesson[] {
  return course.units.flatMap((u) => u.lessons)
}

export function findLesson(course: Course, lessonId: string): Lesson | undefined {
  return lessonsOf(course).find((l) => l.id === lessonId)
}

export function findScript(course: Course, scriptId: string): ScriptLesson | undefined {
  return course.script.find((s) => s.id === scriptId)
}

/** Lessons before `lessonId` in course order, nearest first. */
export function earlierLessons(course: Course, lessonId: string): Lesson[] {
  const all = lessonsOf(course)
  const at = all.findIndex((l) => l.id === lessonId)
  return all.slice(0, Math.max(at, 0)).reverse()
}

/** Script lessons before `scriptId`, nearest first. */
export function earlierScripts(course: Course, scriptId: string): ScriptLesson[] {
  const at = course.script.findIndex((s) => s.id === scriptId)
  return course.script.slice(0, Math.max(at, 0)).reverse()
}

function findLetter(course: Course, { lessonId, target }: ParsedKey): Letter | undefined {
  return findScript(course, lessonId)?.letters.find((l) => l.char === target)
}

function findItem(course: Course, { lessonId, kind, target }: ParsedKey): Item | undefined {
  const lesson = findLesson(course, lessonId)
  const list = kind === 'w' ? lesson?.words : lesson?.phrases
  return list?.find((i) => i.target === target)
}

export function findEntry(
  course: Course,
  key: ItemKey,
): { item: Item; letter?: Letter; lessonId: string } | undefined {
  const parsed = parseKey(key)
  if (!parsed) return undefined
  if (parsed.kind === 'l') {
    const letter = findLetter(course, parsed)
    return letter && { item: letter.example, letter, lessonId: parsed.lessonId }
  }
  const item = findItem(course, parsed)
  return item && { item, lessonId: parsed.lessonId }
}
