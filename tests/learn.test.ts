import { describe, expect, it } from 'vitest'
import { COURSES } from '../src/content'
import { emptyProgress } from '../src/lib/progress'
import { nextNode, streakNudge } from '../src/ui/learn/hero'
import { flowerOffset, pathShift } from '../src/ui/learn/pathLayout'
import { sectionsFor } from '../src/ui/learn/sections'

const course = COURSES.mr!
const DONE = { completedAt: 0, bestAccuracy: 1, count: 1 }

describe('nextNode', () => {
  it('starts at the first lesson of a track', () => {
    const first = sectionsFor(course, 'lessons')[0].nodes[0]
    expect(nextNode(course, emptyProgress(0), 'lessons')?.id).toBe(first.id)
    expect(nextNode(course, emptyProgress(0), 'letters')?.id).toBe(course.script[0].id)
  })

  it('starts a new learner on the intro lessons, then moves to Unit 1', () => {
    const progress = emptyProgress(0)
    expect(nextNode(course, progress, 'lessons')?.kind).toBe('intro')
    course.intro.forEach((l) => { progress.lessons[l.id] = DONE })
    expect(nextNode(course, progress, 'lessons')?.id).toBe(course.units[0].lessons[0].id)
  })

  it('moves on once a lesson is done and ends with null when everything is', () => {
    const progress = emptyProgress(0)
    const [a, b] = sectionsFor(course, 'letters')[0].nodes
    progress.lessons[a.id] = DONE
    expect(nextNode(course, progress, 'letters')?.id).toBe(b.id)
    for (const n of sectionsFor(course, 'letters')[0].nodes) progress.lessons[n.id] = DONE
    expect(nextNode(course, progress, 'letters')).toBeNull()
  })
})

describe('streakNudge', () => {
  it('encourages, keeps and starts streaks', () => {
    expect(streakNudge(3, false)).toBe('Keep your 3-day streak alive!')
    expect(streakNudge(0, false)).toBe('Start a streak today')
    expect(streakNudge(5, true)).toContain('5-day streak')
  })
})

describe('path layout', () => {
  it('weaves within the amplitude and puts flowers on the opposite side of the bend', () => {
    for (let i = 0; i < 12; i++) expect(Math.abs(pathShift(i))).toBeLessThanOrEqual(70)
    expect(pathShift(0)).toBe(0)
    expect(flowerOffset(0)).toBeNull()
    expect(Math.sign(flowerOffset(1) ?? 0)).toBe(-Math.sign(pathShift(1)))
  })
})
