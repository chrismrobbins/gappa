import { describe, expect, it } from 'vitest'
import { COURSES } from '../src/content'
import { cardReviewKeys } from '../src/lib/cardKey'
import { groupFixes } from '../src/lib/fixes'
import { fixError, fixInput, initialDraft, okInput } from '../src/lib/reviewDraft'
import { lessonTitles, progressLabel, reviewItems, reviewProgress, reviewSections } from '../src/lib/reviewItems'
import { buildLesson } from '../src/engine'
import type { OpenFix } from '../src/types'

const course = COURSES.mr!
const items = reviewItems(course)

describe('reviewItems', () => {
  it('has unique keys and is stable between calls', () => {
    const keys = items.map((i) => i.key)
    expect(new Set(keys).size).toBe(keys.length)
    expect(reviewItems(course).map((i) => i.key)).toEqual(keys)
  })

  it('covers every word, phrase, letter, letter example, tip example and slide example', () => {
    const has = (lessonId: string, target: string) => items.some((i) => i.lessonId === lessonId && i.target === target)
    for (const u of course.units) for (const l of u.lessons) {
      for (const it of [...l.words, ...l.phrases, ...(l.tip?.examples ?? [])]) expect(has(l.id, it.target), it.target).toBe(true)
    }
    for (const s of course.script) for (const l of s.letters) {
      expect(has(s.id, l.char)).toBe(true)
      expect(has(s.id, l.example.target)).toBe(true)
    }
    for (const l of course.intro) for (const sl of l.slides) for (const ex of sl.examples ?? []) expect(has(l.id, ex.text)).toBe(true)
  })

  it('goes in course order: Start here, Letters, then units', () => {
    expect(reviewSections(course).map((s) => s.title).slice(0, 4)).toEqual(['Start here', 'Letters', 'Unit 1', 'Unit 2'])
  })

  it('maps every teach card (and tip with examples) of every lesson to a reviewable line', () => {
    const byKey = new Set(items.map((i) => i.key))
    for (const l of course.units.flatMap((u) => u.lessons)) {
      for (const card of buildLesson(course, l.id).filter((c) => c.kind === 'teach' || (c.kind === 'tip' && !!c.tip.examples?.length))) {
        expect(cardReviewKeys(card, l.id).some((k) => byKey.has(k)), `${l.id} ${card.kind}`).toBe(true)
      }
    }
  })
})

describe('reviewProgress', () => {
  it('counts checked lines and fixes among the given items only', () => {
    const reviews = [
      { itemKey: items[0].key, verdict: 'ok' as const },
      { itemKey: items[1].key, verdict: 'fix' as const },
      { itemKey: 'gone|w|x', verdict: 'fix' as const },
    ]
    const p = reviewProgress(items, reviews)
    expect(p).toEqual({ checked: 2, total: items.length, fixes: 1 })
    expect(progressLabel({ checked: 86, total: 385, fixes: 4 })).toBe('86 / 385 lines checked · 4 fixes')
  })
})

describe('review drafts', () => {
  const item = items[0]
  it('asks for something to act on, and drops an unchanged correction', () => {
    expect(fixError(item, initialDraft(item))).not.toBeNull()
    expect(fixError(item, { ...initialDraft(item), voice: 'all' })).toBeNull()
    expect(fixInput(item, { ...initialDraft(item), comment: ' hm ' })).toMatchObject({ correction: null, comment: 'hm', voice: null })
    expect(okInput(item)).toMatchObject({ verdict: 'ok', itemKey: item.key })
  })
})

describe('groupFixes', () => {
  it('groups by lesson in course order', () => {
    const fix = (id: string, lessonId: string) => ({ id, lessonId }) as OpenFix
    const titles = lessonTitles(items)
    const order = [...titles.keys()]
    const groups = groupFixes([fix('a', order[3]), fix('b', order[0]), fix('c', order[3])], titles, order)
    expect(groups.map((g) => [g.lessonId, g.fixes.length])).toEqual([[order[0], 1], [order[3], 2]])
  })
})
