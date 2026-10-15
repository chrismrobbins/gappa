import { CHECKPOINT_PASS, LEVEL_STEP, XP } from '../../config'
import type { ExerciseResult, LevelInfo, Progress, SessionInput } from '../../types'

export function totalXp(p: Progress): number {
  return Object.values(p.days).reduce((sum, d) => sum + d.xp, 0)
}

const xpToReach = (level: number): number => LEVEL_STEP * level * (level - 1)

export function levelInfo(xp: number): LevelInfo {
  let level = 1
  while (xpToReach(level + 1) <= xp) level++
  return {
    level,
    xpIntoLevel: xp - xpToReach(level),
    xpForNext: xpToReach(level + 1) - xpToReach(level),
  }
}

/** Share of exercises right on the first try; only the first result per key counts. */
export function accuracyOf(results: ExerciseResult[]): number {
  const first = new Map<string, boolean>()
  for (const r of results) if (!first.has(r.key)) first.set(r.key, r.correct)
  if (first.size === 0) return 0
  return [...first.values()].filter(Boolean).length / first.size
}

export function isPassed(kind: SessionInput['kind'], accuracy: number): boolean {
  return kind !== 'checkpoint' || accuracy >= CHECKPOINT_PASS
}

function baseXp(kind: SessionInput['kind'], accuracy: number): number {
  if (!isPassed(kind, accuracy)) return 0
  if (kind === 'lesson') return XP.lesson + (accuracy === 1 ? XP.perfectBonus : 0)
  return XP[kind]
}

export function sessionXp(input: SessionInput, accuracy: number, alreadyDone: boolean): number {
  const xp = baseXp(input.kind, accuracy)
  return alreadyDone ? Math.floor(xp / 2) : xp
}
