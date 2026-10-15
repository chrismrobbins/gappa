import { describe, expect, it } from 'vitest'
import { COURSES } from '../src/content'
import type { Course, Item } from '../src/types'
import { displayTokens } from '../src/lib/text'

const courses: Course[] = Object.values(COURSES).filter((c): c is Course => c !== undefined)
const lessonsOf = (c: Course) => c.units.flatMap((u) => u.lessons)

function allItems(c: Course): Item[] {
  const unitItems = lessonsOf(c).flatMap((l) => [...l.words, ...l.phrases, ...(l.tip?.examples ?? [])])
  const letterItems = c.script.flatMap((s) => s.letters.map((l) => l.example))
  return [...unitItems, ...letterItems]
}

describe.each(courses)('course $lang content', (course) => {
  it('has unique lesson ids across lessons, script lessons and units', () => {
    const ids = [...course.intro.map((l) => l.id), ...lessonsOf(course).map((l) => l.id), ...course.script.map((s) => s.id), ...course.units.map((u) => u.id)]
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has enough words and phrases per lesson', () => {
    for (const l of lessonsOf(course)) {
      expect(l.words.length, `${l.id} words`).toBeGreaterThanOrEqual(4)
      expect(l.phrases.length, `${l.id} phrases`).toBeGreaterThanOrEqual(3)
    }
  })

  it('has romanization with the same token count as the target', () => {
    for (const item of allItems(course)) {
      expect(displayTokens(item.rom).length, `${item.target} / ${item.rom}`).toBe(displayTokens(item.target).length)
    }
  })

  it('has no empty strings', () => {
    for (const item of allItems(course)) {
      expect(item.target.trim(), item.en).not.toBe('')
      expect(item.rom.trim(), item.target).not.toBe('')
      expect(item.en.trim(), item.target).not.toBe('')
    }
    for (const l of course.script.flatMap((s) => s.letters)) {
      expect(l.char.trim()).not.toBe('')
      expect(l.rom.trim(), l.char).not.toBe('')
    }
  })

  it('has valid intro lessons', () => {
    for (const lesson of course.intro) {
      expect(lesson.slides.length, lesson.id).toBeGreaterThan(0)
      for (const slide of lesson.slides) {
        for (const ex of slide.examples ?? []) {
          expect(ex.text.trim(), lesson.id).not.toBe('')
          expect(ex.rom.trim(), ex.text).not.toBe('')
        }
        const check = slide.check
        if (!check) continue
        expect(Number.isInteger(check.answer) && check.answer >= 0 && check.answer < check.options.length, check.question).toBe(true)
        expect(new Set(check.options).size, check.question).toBe(check.options.length)
      }
    }
  })

  it('has unique letters within each script lesson', () => {
    for (const s of course.script) {
      const chars = s.letters.map((l) => l.char)
      expect(new Set(chars).size, s.id).toBe(chars.length)
    }
  })
})
