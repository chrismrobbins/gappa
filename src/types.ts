// Shared contracts. Every module builds against these types; change them deliberately.

// ---------- Content ----------

export type LangId = 'mr' | 'hi'
export type Register = 'polite' | 'casual'

/** One learnable word or phrase. `target` is in the course language (Devanagari). */
export interface Item {
  target: string
  /** Romanization; must have the same number of space-separated tokens as `target`. */
  rom: string
  en: string
  /** Other English meanings accepted / shown as hints. */
  alsoEn?: string[]
  note?: string
  register?: Register
}

export interface Tip {
  title: string
  /** Short paragraphs. `**bold**` marks target-language text. */
  body: string[]
  examples?: Item[]
}

export interface Lesson {
  id: string
  title: string
  tip?: Tip
  words: Item[]
  phrases: Item[]
}

export interface Unit {
  id: string
  title: string
  nativeTitle: string
  lessons: Lesson[]
}

export interface Letter {
  char: string
  rom: string
  example: Item
}

export interface ScriptLesson {
  id: string
  title: string
  note?: string
  letters: Letter[]
}

export interface Course {
  lang: LangId
  name: string
  nativeName: string
  /** BCP-47 locale for device speech, e.g. 'mr-IN'. */
  locale: string
  script: ScriptLesson[]
  units: Unit[]
}

// ---------- Lesson cards (built by the engine, rendered by the UI) ----------

/** Something shown on screen: target text plus optional romanization. */
export interface Shown {
  text: string
  rom?: string
}

/** Review keys: `${lessonId}|w|${target}` (word), `|p|` (phrase), `|l|` (letter). */
export type ItemKey = string

export interface TeachCard {
  kind: 'teach'
  title: string
  items: Item[]
}
export interface TeachLettersCard {
  kind: 'teach-letters'
  letters: Letter[]
}
export interface TipCard {
  kind: 'tip'
  tip: Tip
}
export interface ChoiceCard {
  kind: 'choice'
  key: ItemKey
  instruction: string
  prompt: Shown
  /** Target-language text to play as audio. */
  say?: string
  /** Listening exercise: show only the audio button, not the prompt text. */
  hidePrompt?: boolean
  options: Shown[]
  answer: number
}
export interface MatchCard {
  kind: 'match'
  keys: ItemKey[]
  pairs: { left: Shown; right: Shown }[]
}
export interface TilesCard {
  kind: 'tiles'
  key: ItemKey
  instruction: string
  prompt: Shown
  say?: string
  hidePrompt?: boolean
  /** Shuffled tiles, including distractors. */
  tiles: Shown[]
  /** Accepted answers as normalized token lists. */
  answers: string[][]
}
export interface SpeakCard {
  kind: 'speak'
  key: ItemKey
  item: Item
}

export type ExerciseCard = ChoiceCard | MatchCard | TilesCard | SpeakCard
export type Card = TeachCard | TeachLettersCard | TipCard | ExerciseCard

export interface ExerciseResult {
  key: ItemKey
  correct: boolean
}

// ---------- Progress (saved locally and synced to Supabase) ----------

export type RomanizationMode = 'auto' | 'always' | 'tap'
export type SpeechMode = 'auto' | 'browser' | 'server' | 'off'

export interface Settings {
  dailyGoal: number
  romanization: RomanizationMode
  sound: boolean
  speech: SpeechMode
  updatedAt: number
}

export interface DayLog {
  xp: number
  sessions: number
}

export interface LessonRecord {
  completedAt: number
  bestAccuracy: number
  count: number
}

/** Leitner-box spaced repetition state for one item. */
export interface CardState {
  box: number
  due: number
  misses: number
  updatedAt: number
}

export interface Progress {
  schema: 1
  settings: Settings
  /** Keyed by local date 'YYYY-MM-DD'. */
  days: Record<string, DayLog>
  /** Keyed by lesson / script lesson / checkpoint id. */
  lessons: Record<string, LessonRecord>
  cards: Record<ItemKey, CardState>
  /** Badge id -> earned timestamp. */
  badges: Record<string, number>
}

export type SessionKind = 'lesson' | 'script' | 'review' | 'checkpoint'

export interface SessionInput {
  kind: SessionKind
  /** Lesson / script / checkpoint id; 'review' for review sessions. */
  id: string
  results: ExerciseResult[]
  now: number
}

export interface SessionOutcome {
  progress: Progress
  xpEarned: number
  accuracy: number
  passed: boolean
  newBadges: string[]
}

export interface StreakInfo {
  current: number
  longest: number
  freezes: number
  /** Dates a freeze covered. */
  frozenDays: string[]
  doneToday: boolean
}

export interface LevelInfo {
  level: number
  xpIntoLevel: number
  xpForNext: number
}

export interface BadgeDef {
  id: string
  name: string
  description: string
}
