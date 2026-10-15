import { describe, expect, it } from 'vitest'
import { getCourse } from '../src/content'
import { defaultOpen, isSectionOpen } from '../src/ui/learn/sectionOpen'
import { sectionsFor } from '../src/ui/learn/sections'

const [startHere, unit1] = sectionsFor(getCourse('mr'), 'lessons')

describe('collapsible Learn sections', () => {
  it('opens only the section that holds the next lesson by default', () => {
    expect(defaultOpen(startHere, 'mr-0-2')).toBe(true)
    expect(defaultOpen(unit1, 'mr-0-2')).toBe(false)
  })
  it('keeps everything closed when there is no next lesson', () => {
    expect(defaultOpen(unit1, null)).toBe(false)
  })
  it("lets the learner's choice override the default either way", () => {
    expect(isSectionOpen(unit1, 'mr-0-2', { [unit1.id]: true })).toBe(true)
    expect(isSectionOpen(startHere, 'mr-0-2', { [startHere.id]: false })).toBe(false)
  })
})
