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

/** A worked example on an intro slide; `text` is spoken. */
export interface IntroExample {
  /** Optional build-up shown before the result, e.g. ['क', 'ा'] → का. */
  parts?: string[]
  text: string
  rom: string
  en?: string
}

/** A quick multiple-choice check placed right after a slide. */
export interface IntroCheck {
  question: string
  /** Big target-language text to read (and play) above the options. */
  prompt?: string
  options: string[]
  answer: number
  /** One line shown after answering, right or wrong. */
  explain: string
}

export interface IntroSlide {
  title: string
  /** Short paragraphs. `**bold**` marks target-language text. */
  body: string[]
  examples?: IntroExample[]
  check?: IntroCheck
}

/** "How the language works" lessons: explanation slides with light checks, before Unit 1. */
export interface IntroLesson {
  id: string
  title: string
  slides: IntroSlide[]
}

export interface Course {
  lang: LangId
  name: string
  nativeName: string
  /** BCP-47 locale for device speech, e.g. 'mr-IN'. */
  locale: string
  intro: IntroLesson[]
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
/** An intro slide: teaching only, nothing to answer. */
export interface SlideCard {
  kind: 'slide'
  slide: IntroSlide
}
export interface ChoiceCard {
  kind: 'choice'
  key: ItemKey
  instruction: string
  /** Absent for a plain question with nothing to read. */
  prompt?: Shown
  /** Target-language text to play as audio. */
  say?: string
  /** Listening exercise: show only the audio button, not the prompt text. */
  hidePrompt?: boolean
  options: Shown[]
  answer: number
  /** One line shown after answering, right or wrong. */
  explain?: string
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
export type Card = TeachCard | TeachLettersCard | TipCard | SlideCard | ExerciseCard

export interface ExerciseResult {
  key: ItemKey
  correct: boolean
}

// ---------- Progress (saved locally and synced to Supabase) ----------

export type RomanizationMode = 'auto' | 'always' | 'tap'
export type SpeechMode = 'auto' | 'browser' | 'server' | 'off'

/** 'mix' = a random recorded voice per line, else a VoiceDef id. */
export type VoicePref = 'mix' | string

export interface VoiceDef {
  id: string
  name: string
  gender: 'female' | 'male'
  /** ElevenLabs voice id used by the recorder. */
  elevenLabsId: string
}

export interface Settings {
  dailyGoal: number
  romanization: RomanizationMode
  sound: boolean
  speech: SpeechMode
  voice: VoicePref
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

export type SessionKind = 'lesson' | 'script' | 'intro' | 'review' | 'checkpoint'

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

// ---------- Teacher mode ----------

export type Role = 'learner' | 'teacher' | 'admin'
export type ReviewVerdict = 'ok' | 'fix'
export type ReviewStatus = 'open' | 'resolved'

/** What a teacher sends when checking or flagging one line. `voice`: a voice id, 'all', or null. */
export interface ReviewInput {
  itemKey: ItemKey
  lessonId: string
  /** Snapshot of the text that was reviewed. */
  target: string
  verdict: ReviewVerdict
  correction: string | null
  comment: string | null
  voice: string | null
}

/** A saved review (one per reviewer and line). */
export interface Review extends ReviewInput {
  id: string
  status: ReviewStatus
  createdAt: string
  reviewerId: string
}

/** An open fix with the reviewer's username, for the admin. */
export interface OpenFix extends Review {
  reviewer: string
}

export interface ProfileRow {
  id: string
  username: string
  role: Role
}
