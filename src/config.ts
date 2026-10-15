// Game tuning lives here as data, never as literals in screens or logic.

import type { BadgeDef } from './types'

export const XP = {
  lesson: 10,
  perfectBonus: 5,
  script: 8,
  review: 5,
  checkpoint: 20,
} as const

/** Checkpoints pass at this accuracy. */
export const CHECKPOINT_PASS = 0.8
export const CHECKPOINT_SIZE = 12
export const REVIEW_SIZE = 12
/** Most pairs on one match card. */
export const MATCH_SIZE = 5

/** Days until next review for each Leitner box (index = box). */
export const BOX_INTERVAL_DAYS = [0, 1, 3, 7, 16, 35] as const

export const DAILY_GOALS = [10, 20, 30, 50] as const

export const STREAK_FREEZE = { earnEveryDays: 7, max: 2 } as const

/** XP to reach level n is LEVEL_STEP * n * (n - 1): L2 = 50, L3 = 150, L4 = 300… */
export const LEVEL_STEP = 25

/** In 'auto' romanization mode, romanization is always shown below this level. */
export const ROMANIZATION_FADE_LEVEL = 6

/** Spoken answers pass at this similarity (0–1). */
export const SPEECH_PASS = 0.6
export const SPEECH_MAX_SECONDS = 8

export const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/
export const PASSWORD_MIN = 8
/** Usernames map to synthetic emails for Supabase Auth; no mail is ever sent. */
export const USERNAME_EMAIL_DOMAIN = 'users.gappa.example'

export const BADGES: BadgeDef[] = [
  { id: 'first-lesson', name: 'पहिलं पाऊल', description: 'Finish your first lesson' },
  { id: 'perfect', name: 'Perfect!', description: 'Finish a lesson with no mistakes' },
  { id: 'streak-3', name: 'Three days', description: 'Reach a 3-day streak' },
  { id: 'streak-7', name: 'One week', description: 'Reach a 7-day streak' },
  { id: 'streak-30', name: 'One month', description: 'Reach a 30-day streak' },
  { id: 'xp-100', name: '100 XP', description: 'Earn 100 XP' },
  { id: 'xp-500', name: '500 XP', description: 'Earn 500 XP' },
  { id: 'xp-1000', name: '1000 XP', description: 'Earn 1000 XP' },
  { id: 'letters', name: 'अक्षरं', description: 'Finish every letters lesson' },
  { id: 'unit', name: 'Unit done', description: 'Finish every lesson in a unit' },
  { id: 'checkpoint', name: 'Checkpoint', description: 'Pass a unit checkpoint' },
]
