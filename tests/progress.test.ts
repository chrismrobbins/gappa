import { describe, expect, it } from 'vitest'
import { BOX_INTERVAL_DAYS } from '../src/config'
import { COURSES } from '../src/content'
import { addDays } from '../src/lib/dates'
import {
  asProgress, dueKeys, emptyProgress, evaluateBadges, isUnlocked, levelInfo, mergeProgress, mistakeKeys,
  recordSession, sessionXp, streakInfo, totalXp, updateCard, updateSettings,
} from '../src/lib/progress'
import type { ExerciseResult, Progress, SessionInput } from '../src/types'

const course = COURSES.mr!
const DAY = 86_400_000
const NOW = new Date(2026, 5, 10, 12).getTime()
const TODAY = '2026-06-10'

const withDays = (days: string[]): Progress => ({
  ...emptyProgress(0),
  days: Object.fromEntries(days.map((d) => [d, { xp: 10, sessions: 1 }])),
})
const run = (start: string, n: number): string[] => Array.from({ length: n }, (_, i) => addDays(start, i))
const results = (...ok: boolean[]): ExerciseResult[] => ok.map((correct, i) => ({ key: `k${i}`, correct }))
const input = (kind: SessionInput['kind'], id: string, r: ExerciseResult[], now = NOW): SessionInput => ({ kind, id, results: r, now })

describe('cards', () => {
  it('moves up a box when right and caps at the top', () => {
    let c = updateCard(undefined, true, NOW)
    expect(c.box).toBe(1)
    expect(c.due).toBe(NOW + BOX_INTERVAL_DAYS[1] * DAY)
    for (let i = 0; i < 10; i++) c = updateCard(c, true, NOW)
    expect(c.box).toBe(BOX_INTERVAL_DAYS.length - 1)
  })
  it('resets to box 0 and counts a miss when wrong', () => {
    const c = updateCard(updateCard(updateCard(undefined, true, NOW), true, NOW), false, NOW + 5)
    expect(c).toEqual({ box: 0, due: NOW + 5, misses: 1, updatedAt: NOW + 5 })
  })
  it('lists due cards most overdue first, within the limit', () => {
    const p = emptyProgress(0)
    p.cards = {
      a: { box: 1, due: 300, misses: 0, updatedAt: 0 },
      b: { box: 1, due: 100, misses: 0, updatedAt: 0 },
      c: { box: 1, due: 200, misses: 0, updatedAt: 0 },
      later: { box: 1, due: 9999, misses: 0, updatedAt: 0 },
    }
    expect(dueKeys(p, 500, 10)).toEqual(['b', 'c', 'a'])
    expect(dueKeys(p, 500, 2)).toEqual(['b', 'c'])
  })
  it('lists missed cards in low boxes only', () => {
    const p = emptyProgress(0)
    p.cards = {
      shaky: { box: 0, due: 0, misses: 2, updatedAt: 0 },
      recovered: { box: 3, due: 0, misses: 2, updatedAt: 0 },
      clean: { box: 0, due: 0, misses: 0, updatedAt: 0 },
    }
    expect(mistakeKeys(p, 10)).toEqual(['shaky'])
  })
})

describe('xp and levels', () => {
  it('uses the level thresholds', () => {
    expect(levelInfo(0)).toEqual({ level: 1, xpIntoLevel: 0, xpForNext: 50 })
    expect(levelInfo(49).level).toBe(1)
    expect(levelInfo(50)).toEqual({ level: 2, xpIntoLevel: 0, xpForNext: 100 })
    expect(levelInfo(150).level).toBe(3)
    expect(levelInfo(299).level).toBe(3)
    expect(levelInfo(300)).toMatchObject({ level: 4, xpForNext: 200 })
  })
  it('sums daily xp', () => {
    const p = withDays(['2026-06-01', '2026-06-02'])
    expect(totalXp(p)).toBe(20)
  })
  it('awards session xp', () => {
    expect(sessionXp(input('lesson', 'x', []), 0.9, false)).toBe(10)
    expect(sessionXp(input('lesson', 'x', []), 1, false)).toBe(15)
    expect(sessionXp(input('lesson', 'x', []), 1, true)).toBe(7)
    expect(sessionXp(input('script', 'x', []), 1, false)).toBe(8)
    expect(sessionXp(input('review', 'review', []), 0.5, false)).toBe(5)
    expect(sessionXp(input('checkpoint', 'x', []), 0.8, false)).toBe(20)
    expect(sessionXp(input('checkpoint', 'x', []), 0.79, false)).toBe(0)
  })
})

describe('streaks', () => {
  it('is zero with no activity', () => {
    expect(streakInfo(emptyProgress(0), TODAY)).toMatchObject({ current: 0, doneToday: false })
  })
  it('counts consecutive days and ignores an inactive today', () => {
    const p = withDays(['2026-06-07', '2026-06-08', '2026-06-09'])
    expect(streakInfo(p, TODAY)).toMatchObject({ current: 3, longest: 3, doneToday: false })
    expect(streakInfo(withDays([...Object.keys(p.days), TODAY]), TODAY)).toMatchObject({ current: 4, doneToday: true })
  })
  it('resets after a missed day without a freeze', () => {
    const p = withDays(['2026-06-05', '2026-06-06', '2026-06-08', '2026-06-09'])
    expect(streakInfo(p, TODAY)).toMatchObject({ current: 2, longest: 2 })
  })
  it('earns a freeze every 7 days and spends it on a missed day', () => {
    const days = [...run('2026-05-30', 7), ...run('2026-06-07', 3)] // gap on 06-06
    const s = streakInfo(withDays(days), TODAY)
    expect(s).toMatchObject({ current: 10, freezes: 0, frozenDays: ['2026-06-06'] })
  })
  it('keeps at most the maximum number of freezes', () => {
    expect(streakInfo(withDays(run('2026-05-01', 30)), '2026-05-30').freezes).toBe(2)
  })
  it('breaks when freezes run out', () => {
    const days = [...run('2026-05-30', 7), '2026-06-08', '2026-06-09']
    const s = streakInfo(withDays(days), TODAY) // 06-06 frozen, 06-07 breaks
    expect(s).toMatchObject({ current: 2, longest: 7, frozenDays: ['2026-06-06'] })
  })
})

describe('merge', () => {
  it('applies the sync rules', () => {
    const a = emptyProgress(1)
    const b = emptyProgress(2)
    a.days = { d1: { xp: 5, sessions: 2 } }
    b.days = { d1: { xp: 9, sessions: 1 }, d2: { xp: 1, sessions: 1 } }
    a.lessons = { l: { completedAt: 50, bestAccuracy: 0.9, count: 1 } }
    b.lessons = { l: { completedAt: 20, bestAccuracy: 0.7, count: 3 } }
    a.cards = { k: { box: 2, due: 1, misses: 0, updatedAt: 10 } }
    b.cards = { k: { box: 1, due: 2, misses: 1, updatedAt: 5 } }
    a.badges = { x: 100, y: 7 }
    b.badges = { x: 40 }
    b.settings = { ...b.settings, dailyGoal: 50 }
    const m = mergeProgress(a, b)
    expect(m.days).toEqual({ d1: { xp: 9, sessions: 2 }, d2: { xp: 1, sessions: 1 } })
    expect(m.lessons.l).toEqual({ completedAt: 20, bestAccuracy: 0.9, count: 3 })
    expect(m.cards.k.box).toBe(2)
    expect(m.badges).toEqual({ x: 40, y: 7 })
    expect(m.settings.dailyGoal).toBe(50)
    expect(a.days.d1.xp).toBe(5)
  })
})

describe('settings', () => {
  it('has defaults and patches with a timestamp', () => {
    const p = emptyProgress(1)
    expect(p.settings).toEqual({ dailyGoal: 20, romanization: 'auto', sound: true, speech: 'auto', updatedAt: 1 })
    const q = updateSettings(p, { dailyGoal: 30 }, 9)
    expect(q.settings).toMatchObject({ dailyGoal: 30, sound: true, updatedAt: 9 })
    expect(p.settings.dailyGoal).toBe(20)
  })
})

describe('unlocking with the real course', () => {
  const scriptIds = course.script.map((s) => s.id)
  const lessonIds = course.units[0].lessons.map((l) => l.id)
  const done = (...ids: string[]): Progress => {
    const p = emptyProgress(0)
    ids.forEach((id) => { p.lessons[id] = { completedAt: 1, bestAccuracy: 1, count: 1 } })
    return p
  }
  it('unlocks script lessons in order', () => {
    expect(isUnlocked(done(), course, scriptIds[0])).toBe(true)
    expect(isUnlocked(done(), course, scriptIds[1])).toBe(false)
    expect(isUnlocked(done(scriptIds[0]), course, scriptIds[1])).toBe(true)
  })
  it('unlocks unit lessons in order and the checkpoint after all lessons', () => {
    expect(isUnlocked(done(), course, lessonIds[0])).toBe(true)
    expect(isUnlocked(done(), course, lessonIds[1])).toBe(false)
    expect(isUnlocked(done(lessonIds[0]), course, lessonIds[1])).toBe(true)
    const cp = `${course.units[0].id}-cp`
    expect(isUnlocked(done(...lessonIds.slice(1)), course, cp)).toBe(false)
    expect(isUnlocked(done(...lessonIds), course, cp)).toBe(true)
  })
  it('rejects unknown ids', () => {
    expect(isUnlocked(done(), course, 'nope')).toBe(false)
  })
})

describe('recordSession and badges', () => {
  const lessonId = course.units[0].lessons[0].id
  it('records a perfect first lesson', () => {
    const out = recordSession(emptyProgress(0), input('lesson', lessonId, results(true, true)), course)
    expect(out).toMatchObject({ xpEarned: 15, accuracy: 1, passed: true })
    expect(out.newBadges).toEqual(['first-lesson', 'perfect'])
    expect(out.progress.days[TODAY]).toEqual({ xp: 15, sessions: 1 })
    expect(out.progress.lessons[lessonId]).toEqual({ completedAt: NOW, bestAccuracy: 1, count: 1 })
    expect(out.progress.cards.k0.box).toBe(1)
    expect(out.progress.badges['perfect']).toBe(NOW)
  })
  it('counts only the first try per key but updates cards for every result', () => {
    const r: ExerciseResult[] = [{ key: 'a', correct: false }, { key: 'a', correct: true }, { key: 'b', correct: true }]
    const out = recordSession(emptyProgress(0), input('lesson', lessonId, r), course)
    expect(out.accuracy).toBe(0.5)
    expect(out.progress.cards.a.misses).toBe(1)
    expect(out.progress.cards.a.box).toBe(1)
  })
  it('gives half xp on replay and keeps the best accuracy and first date', () => {
    const first = recordSession(emptyProgress(0), input('lesson', lessonId, results(true, false)), course)
    const again = recordSession(first.progress, input('lesson', lessonId, results(true, true), NOW + DAY), course)
    expect(first.xpEarned).toBe(10)
    expect(again.xpEarned).toBe(7)
    expect(again.progress.lessons[lessonId]).toEqual({ completedAt: NOW, bestAccuracy: 1, count: 2 })
    expect(again.newBadges).not.toContain('first-lesson')
  })
  it('does not record a failed checkpoint but still logs the session', () => {
    const id = `${course.units[0].id}-cp`
    const out = recordSession(emptyProgress(0), input('checkpoint', id, results(true, false, false)), course)
    expect(out).toMatchObject({ passed: false, xpEarned: 0 })
    expect(out.progress.lessons[id]).toBeUndefined()
    expect(out.progress.days[TODAY].sessions).toBe(1)
  })
  it('passes a checkpoint and earns the checkpoint badge', () => {
    const id = `${course.units[0].id}-cp`
    const out = recordSession(emptyProgress(0), input('checkpoint', id, results(true, true, true, true, false)), course)
    expect(out).toMatchObject({ passed: true, xpEarned: 20 })
    expect(out.newBadges).toContain('checkpoint')
  })
  it('review adds xp and cards but no lesson record', () => {
    const out = recordSession(emptyProgress(0), input('review', 'review', results(true)), course)
    expect(out.xpEarned).toBe(5)
    expect(out.progress.lessons).toEqual({})
  })
  it('awards letters and unit badges, streak and xp badges', () => {
    const p = withDays(run('2026-06-01', 9))
    p.days['2026-06-09'] = { xp: 1000, sessions: 1 }
    course.script.forEach((s) => { p.lessons[s.id] = { completedAt: 1, bestAccuracy: 0.5, count: 1 } })
    course.units[0].lessons.forEach((l) => { p.lessons[l.id] = { completedAt: 1, bestAccuracy: 0.5, count: 1 } })
    const ids = evaluateBadges(p, course, TODAY)
    expect(ids).toEqual(expect.arrayContaining(['letters', 'unit', 'streak-3', 'streak-7', 'xp-100', 'xp-500', 'xp-1000']))
    expect(ids).not.toContain('streak-30')
    expect(ids).not.toContain('checkpoint')
    p.badges = Object.fromEntries(ids.map((id) => [id, 1]))
    expect(evaluateBadges(p, course, TODAY)).toEqual([])
  })
})

describe('asProgress', () => {
  it('accepts saved progress and rejects other shapes', () => {
    const p = emptyProgress(0)
    expect(asProgress(JSON.parse(JSON.stringify(p)))).toEqual(p)
    expect(asProgress({ ...p, schema: 2 })).toBeNull()
    expect(asProgress({ schema: 1 })).toBeNull()
    expect(asProgress('nope')).toBeNull()
  })
})
