// Every line of the course a teacher can check, in course order, each with a stable key.

import { itemKey, type EntryKind } from '../engine/keys'
import type { Course, Item, IntroExample, Letter, Review } from '../types'

export interface ReviewItem {
  key: string
  sectionId: string
  sectionTitle: string
  lessonId: string
  lessonTitle: string
  target: string
  rom: string
  en?: string
  note?: string
  kind: EntryKind
}

interface Where { sectionId: string; sectionTitle: string; lessonId: string; lessonTitle: string }

function make(where: Where, kind: EntryKind, target: string, rest: Pick<ReviewItem, 'rom' | 'en' | 'note'>): ReviewItem {
  return { ...where, key: itemKey(where.lessonId, kind, target), target, kind, ...rest }
}

const fromItem = (w: Where, kind: EntryKind, it: Item) => make(w, kind, it.target, { rom: it.rom, en: it.en, note: it.note })
const fromExample = (w: Where, ex: IntroExample) => make(w, 'i', ex.text, { rom: ex.rom, en: ex.en })

function fromLetter(w: Where, l: Letter): ReviewItem[] {
  return [make(w, 'l', l.char, { rom: l.rom }), fromItem(w, 'l', l.example)]
}

function introItems(course: Course): ReviewItem[] {
  return course.intro.flatMap((lesson) => {
    const w = { sectionId: 'intro', sectionTitle: 'Start here', lessonId: lesson.id, lessonTitle: lesson.title }
    return lesson.slides.flatMap((s) => (s.examples ?? []).map((ex) => fromExample(w, ex)))
  })
}

function scriptItems(course: Course): ReviewItem[] {
  return course.script.flatMap((s) => {
    const w = { sectionId: 'script', sectionTitle: 'Letters', lessonId: s.id, lessonTitle: s.title }
    return s.letters.flatMap((l) => fromLetter(w, l))
  })
}

function unitItems(course: Course): ReviewItem[] {
  return course.units.flatMap((u, i) =>
    u.lessons.flatMap((l) => {
      const w = { sectionId: u.id, sectionTitle: `Unit ${i + 1}`, lessonId: l.id, lessonTitle: l.title }
      return [
        ...(l.tip?.examples ?? []).map((it) => fromItem(w, 't', it)),
        ...l.words.map((it) => fromItem(w, 'w', it)),
        ...l.phrases.map((it) => fromItem(w, 'p', it)),
      ]
    }),
  )
}

/** The same line can appear twice in a lesson (e.g. two slides); the first one stands for both. */
function uniqueByKey(items: ReviewItem[]): ReviewItem[] {
  const seen = new Set<string>()
  return items.filter((i) => !seen.has(i.key) && seen.add(i.key))
}

export function reviewItems(course: Course): ReviewItem[] {
  return uniqueByKey([...introItems(course), ...scriptItems(course), ...unitItems(course)])
}

export interface ReviewLesson { id: string; title: string; items: ReviewItem[] }
export interface ReviewSection { id: string; title: string; lessons: ReviewLesson[] }

/** Items grouped into sections (Start here, Letters, Unit 1…) and lessons, keeping course order. */
export function reviewSections(course: Course): ReviewSection[] {
  const sections: ReviewSection[] = []
  for (const item of reviewItems(course)) {
    let section = sections.find((s) => s.id === item.sectionId)
    if (!section) sections.push((section = { id: item.sectionId, title: item.sectionTitle, lessons: [] }))
    let lesson = section.lessons.find((l) => l.id === item.lessonId)
    if (!lesson) section.lessons.push((lesson = { id: item.lessonId, title: item.lessonTitle, items: [] }))
    lesson.items.push(item)
  }
  return sections
}

export interface ReviewProgress { checked: number; total: number; fixes: number }

/** How many of `items` the teacher has checked, and how many of those need a fix. */
export function reviewProgress(items: readonly ReviewItem[], reviews: readonly Pick<Review, 'itemKey' | 'verdict'>[]): ReviewProgress {
  const byKey = new Map(reviews.map((r) => [r.itemKey, r.verdict]))
  const verdicts = items.flatMap((i) => byKey.get(i.key) ?? [])
  return { checked: verdicts.length, total: items.length, fixes: verdicts.filter((v) => v === 'fix').length }
}

export function progressLabel(p: ReviewProgress): string {
  const fixes = p.fixes === 1 ? '1 fix' : `${p.fixes} fixes`
  return `${p.checked} / ${p.total} lines checked · ${fixes}`
}

/** lessonId -> title, in course order (Map keeps insertion order). */
export function lessonTitles(items: readonly ReviewItem[]): Map<string, string> {
  return new Map(items.map((i) => [i.lessonId, i.lessonTitle]))
}
