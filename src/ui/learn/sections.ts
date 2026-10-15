import { CHECKPOINT_SIZE } from '../../config'
import { checkpointId } from '../../lib/progress'
import type { Course, Lesson, ScriptLesson, SessionKind, Unit } from '../../types'

export interface NodeInfo {
  id: string
  kind: SessionKind
  title: string
  blurb: string
  tipTitle?: string
  words: number
  phrases: number
}

export interface Section {
  id: string
  title: string
  nativeTitle?: string
  nodes: NodeInfo[]
}

const scriptNode = (s: ScriptLesson): NodeInfo => ({
  id: s.id, kind: 'script', title: s.title, blurb: s.note ?? 'Learn to read and say these letters.',
  words: s.letters.length, phrases: 0,
})

const lessonNode = (l: Lesson): NodeInfo => ({
  id: l.id, kind: 'lesson', title: l.title, blurb: 'Words and phrases, step by step.',
  tipTitle: l.tip?.title, words: l.words.length, phrases: l.phrases.length,
})

const checkpointNode = (u: Unit): NodeInfo => ({
  id: checkpointId(u.id), kind: 'checkpoint', title: 'Checkpoint',
  blurb: `${CHECKPOINT_SIZE} questions from ${u.title}. Pass to earn bonus XP.`, words: 0, phrases: 0,
})

const unitSection = (u: Unit): Section => ({
  id: u.id, title: u.title, nativeTitle: u.nativeTitle, nodes: [...u.lessons.map(lessonNode), checkpointNode(u)],
})

export type Track = 'lessons' | 'letters'

const lettersSection = (c: Course): Section => ({
  id: 'script', title: 'Letters', nativeTitle: 'अक्षरं', nodes: c.script.map(scriptNode),
})

/** The sections shown on the Learn screen for one track. */
export function sectionsFor(course: Course, track: Track): Section[] {
  return track === 'letters' ? [lettersSection(course)] : course.units.map(unitSection)
}

/** Counts line shown in the lesson sheet. */
export function countsLabel(n: NodeInfo): string {
  if (n.kind === 'checkpoint') return `${CHECKPOINT_SIZE} questions`
  if (n.kind === 'script') return `${n.words} letters`
  return `${n.words} words · ${n.phrases} phrases`
}
