import { CHECKPOINT_SIZE } from '../../config'
import { checkpointId } from '../../lib/progress'
import type { Course, IntroLesson, Lesson, ScriptLesson, SessionKind, Unit } from '../../types'

export interface NodeInfo {
  id: string
  kind: SessionKind
  title: string
  blurb: string
  tipTitle?: string
  words: number
  phrases: number
  /** First letter of a script lesson, shown on its path node. */
  glyph?: string
}

export interface Section {
  id: string
  eyebrow: string
  /** Picks the banner color (`tone-<tone>` in learn.css). */
  tone: string
  title: string
  nativeTitle?: string
  nodes: NodeInfo[]
}

const scriptNode = (s: ScriptLesson): NodeInfo => ({
  id: s.id, kind: 'script', title: s.title, blurb: s.note ?? 'Learn to read and say these letters.',
  words: s.letters.length, phrases: 0, glyph: s.letters[0]?.char,
})

const introNode = (l: IntroLesson): NodeInfo => ({
  id: l.id, kind: 'intro', title: l.title, blurb: 'How Marathi works, in a few quick slides.',
  words: l.slides.length, phrases: 0,
})

const lessonNode = (l: Lesson): NodeInfo => ({
  id: l.id, kind: 'lesson', title: l.title, blurb: 'Words and phrases, step by step.',
  tipTitle: l.tip?.title, words: l.words.length, phrases: l.phrases.length,
})

const checkpointNode = (u: Unit): NodeInfo => ({
  id: checkpointId(u.id), kind: 'checkpoint', title: 'Checkpoint',
  blurb: `${CHECKPOINT_SIZE} questions from ${u.title}. Pass to earn bonus XP.`, words: 0, phrases: 0,
})

const UNIT_TONES = 4

const unitSection = (u: Unit, i: number): Section => ({
  id: u.id, eyebrow: `Unit ${i + 1}`, tone: `u${(i % UNIT_TONES) + 1}`, title: u.title, nativeTitle: u.nativeTitle, nodes: [...u.lessons.map(lessonNode), checkpointNode(u)],
})

export type Track = 'lessons' | 'letters'

const introSection = (c: Course): Section => ({
  id: 'intro', eyebrow: 'Start here', tone: 'intro', title: 'How Marathi works', nativeTitle: 'सुरुवात', nodes: c.intro.map(introNode),
})

const lettersSection = (c: Course): Section => ({
  id: 'script', eyebrow: 'The script', tone: 'letters', title: 'Letters', nativeTitle: 'अक्षरं', nodes: c.script.map(scriptNode),
})

/** The sections shown on the Learn screen for one track. */
export function sectionsFor(course: Course, track: Track): Section[] {
  if (track === 'letters') return [lettersSection(course)]
  return [introSection(course), ...course.units.map(unitSection)]
}

/** Counts line shown in the lesson sheet. */
export function countsLabel(n: NodeInfo): string {
  if (n.kind === 'checkpoint') return `${CHECKPOINT_SIZE} questions`
  if (n.kind === 'intro') return `${n.words} short slides`
  if (n.kind === 'script') return `${n.words} letters`
  return `${n.words} words · ${n.phrases} phrases`
}
