# Gappa architecture

Gappa (गप्पा, "chit-chat") is a Duolingo-style course for Marathi (Hindi in phase 2).
Vite + React + TypeScript web app that installs to the iPhone/iPad home screen, hosted on Vercel,
accounts and progress in Supabase, voices pre-recorded with ElevenLabs.

## Coding standards (non-negotiable)

- **KISS.** The simplest thing that works. No speculative abstraction, no frameworks beyond React.
- **DRY.** One source of truth: types in `src/types.ts`, tuning numbers in `src/config.ts`,
  text helpers in `src/lib/text.ts`. Never re-implement a helper that exists.
- **Small, single-purpose functions.** One core job per function. Aim for ≤ 25 lines; split anything
  that branches into several jobs. Components render; logic lives in `src/lib` / `src/engine`.
- **Pure core.** `src/engine` and `src/lib/progress` are pure (no DOM, no network, no `Date.now()` —
  time is passed in). Side effects live in `src/services`.
- **Typed.** `strict` TypeScript, no `any`, no non-null `!` unless provably safe.
- **Tested.** Pure modules ship with Vitest tests in `tests/`.
- Comments explain *why*, not *what*. Learner-facing copy is warm, plain English, sentence case.
- Secrets never reach the browser: only `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are public.

## Module map

| Path | Owner | Purpose |
|---|---|---|
| `src/types.ts` | lead | All shared types (content, cards, progress) |
| `src/config.ts` | lead | XP, intervals, goals, badges, limits |
| `src/lib/text.ts` | lead | `normalize`, `tokens`, `displayTokens`, `levenshtein`, `similarity` |
| `src/lib/audioKey.ts` | lead | `canonicalLine`, `audioKey` (shared with the recorder) |
| `src/lib/random.ts` | lead | `seededRng`, `shuffle`, `sample`, `pickOne` |
| `src/lib/voicePick.ts` | services | Pure `pickVoice` (preferred / mix / any recorded voice) |
| `src/content/**` | lead | Course data only (`COURSES`, `DEFAULT_LANG`, `getCourse`) |
| `src/lib/username.ts` | services | Username normalization, email mapping and form rules (shared with `api/signup`) |
| `src/lib/speechMode.ts` | services | Pure speech-mode decision (`resolveMode`) |
| `src/lib/dates.ts` | core | Local date keys and day arithmetic |
| `src/lib/progress/*` | core | Pure progress logic (see API) |
| `src/engine/*` | engine | Builds lesson/review/checkpoint card queues, grades answers |
| `src/services/*` | services | Supabase auth + sync, audio playback, speech input, sound effects, local storage |
| `api/*` | services | Vercel functions: `signup`, `transcribe` |
| `supabase/migrations/*` | services | Tables, RLS, invite functions |
| `scripts/*` | services | Voice recording, invites, password reset |
| `src/ui/**`, `src/styles/*` | ui | React screens and CSS |

## APIs (implement exactly these signatures)

### `src/lib/dates.ts`
```ts
dateKey(ms: number): string                 // local 'YYYY-MM-DD'
addDays(key: string, n: number): string
daysBetween(a: string, b: string): number   // b - a in whole days
```

### `src/lib/progress/` (pure; re-exported from `src/lib/progress/index.ts`)
```ts
emptyProgress(now: number): Progress
asProgress(data: unknown): Progress | null                     // shape check for loaded/pulled data
updateCard(prev: CardState | undefined, correct: boolean, now: number): CardState   // Leitner, BOX_INTERVAL_DAYS
dueKeys(p: Progress, now: number, limit: number): ItemKey[]    // most overdue first
mistakeKeys(p: Progress, limit: number): ItemKey[]             // cards with misses > 0, box <= 1
totalXp(p: Progress): number                                   // sum of days[].xp
levelInfo(xp: number): LevelInfo                               // LEVEL_STEP formula
streakInfo(p: Progress, today: string): StreakInfo             // derived from days; see Streaks
sessionXp(input: SessionInput, accuracy: number, alreadyDone: boolean): number
recordSession(p: Progress, input: SessionInput, course: Course): SessionOutcome
evaluateBadges(p: Progress, course: Course, today: string): string[]  // newly earned ids
mergeProgress(a: Progress, b: Progress): Progress              // see Sync
updateSettings(p: Progress, patch: Partial<Settings>, now: number): Progress
showsRomanization(p: Progress): boolean                        // 'always', or 'auto' below ROMANIZATION_FADE_LEVEL
isLessonDone(p: Progress, id: string): boolean
isUnlocked(p: Progress, course: Course, lessonId: string): boolean
```

**Accuracy** = share of exercises right on the *first* try (results list one entry per exercise
attempt; the first result per key counts). **Passed**: lessons/script/review always pass;
checkpoints pass at `CHECKPOINT_PASS`. XP: `XP.lesson` (+`XP.perfectBonus` at 100%), `XP.script`,
`XP.review`, `XP.checkpoint` (first pass only; a failed checkpoint earns 0). Replaying a finished
lesson earns half XP (rounded down).

**Streaks** are derived only from `days` (so merging is trivial). A day counts if `sessions > 0`.
Walk from the first active day to `today`: an active day adds 1 and every `STREAK_FREEZE.earnEveryDays`
consecutive days earns a freeze (max `STREAK_FREEZE.max`); a missed day (not today) spends a
freeze (streak continues, date goes in `frozenDays`) or resets the streak to 0. Today being
inactive never breaks the streak.

**Unlocking**: script lessons unlock in order; unit lessons unlock in order across units; a
checkpoint (`<unitId>-cp`) unlocks when all its unit's lessons are done.

**Sync** (`src/ui/state/useProgressStore.ts`): on sign-in the cloud copy is pulled and merged into
the local one; pushing (debounced, and flushed when the app is hidden or before sign-out) starts only
after a pull has succeeded, because a push replaces the cloud row. An offline start stays local-only
and retries the pull on the `online` event.

**Merge** (`mergeProgress`): days → max of each field; lessons → max `count`, max
`bestAccuracy`, min `completedAt`; cards → newer `updatedAt` wins; badges → union (earliest ts);
settings → newer `updatedAt` wins.

### `src/engine/` (pure; re-exported from `src/engine/index.ts`)
```ts
itemKey(lessonId: string, kind: 'w' | 'p' | 'l', target: string): ItemKey
buildLesson(course: Course, lessonId: string, rng?: Rng): Card[]
buildScriptLesson(course: Course, scriptId: string, rng?: Rng): Card[]
buildReview(course: Course, keys: ItemKey[], rng?: Rng): Card[]
buildCheckpoint(course: Course, unitId: string, rng?: Rng): Card[]
gradeChoice(card: ChoiceCard, index: number): boolean
gradeTiles(card: TilesCard, picked: string[]): boolean        // picked = tile texts in order
gradeSpeech(target: string, transcript: string): boolean      // similarity >= SPEECH_PASS
findEntry(course: Course, key: ItemKey): { item: Item; letter?: Letter; lessonId: string } | undefined
```

**Lesson flow** (teach before test): optional `tip` card first; words in groups of 2–3, each
group → `teach` card, then one recognition `choice` per word (alternate target→English,
English→target, listening with `hidePrompt`); from the second group on a `match` of up to 5 words
seen so far. Then phrases: each phrase gets a `teach` card before any question about it, then a
`choice` (pick the English meaning) and a `tiles` (build the target sentence from its tokens plus
2–3 distractor words from the lesson). The lesson closes with a listening `tiles` (hidePrompt) and
one `speak` card for a phrase. Distractor options come from the same lesson first, then earlier
lessons of the course; never duplicate the right answer's text or meaning.

**Script lessons**: `teach-letters` (2–3 letters) → `choice` letter→sound (rom), `choice`
sound(audio)→letter; end with a `match` letter↔rom.

**Review / checkpoint**: one exercise per key, type picked from the item kind (word → choice,
phrase → tiles or choice, letter → choice). Checkpoint = `CHECKPOINT_SIZE` items from the unit.

### `src/services/`
```ts
// storage.ts — one copy per owner (username; null = local mode) so a shared device never mixes learners
loadLocal(owner: string | null): Progress | null ; saveLocal(p: Progress, owner: string | null): void
// supabase.ts
supabase: SupabaseClient | null ; cloudEnabled: boolean
// auth.ts
usernameToEmail(username: string): string
signIn(username: string, password: string): Promise<void>
signUp(username: string, password: string, invite: string): Promise<void>   // POST /api/signup then signIn
signOut(): Promise<void>
currentUsername(): Promise<string | null>
onAuthChange(cb: (username: string | null) => void): () => void
// sync.ts
pullProgress(): Promise<Progress | null> ; pushProgress(p: Progress): Promise<void>
// audio.ts
loadVoiceIndex(lang: LangId): Promise<void>                  // every voice's index
setVoicePreference(pref: VoicePref): void
previewVoice(pref: VoicePref): void
say(text: string, opts?: { slow?: boolean; lang?: LangId }): void   // recorded clip (chosen voice), else device voice
// speech.ts
resolveSpeechMode(setting: SpeechMode): 'browser' | 'server' | 'off'
startListening(lang: LangId, mode: 'browser' | 'server'): Listener
interface Listener { stop(): Promise<string>; cancel(): void }
// sfx.ts
sfx(name: 'correct' | 'wrong' | 'finish' | 'tap'): void
```

## Recorded voices

The course is recorded in every voice in `VOICES` (`src/config.ts`: id, name, gender, ElevenLabs id).
`npm run voices` (scripts/record-voices.ts) collects every line the course can say (words, phrases,
tip examples, letters and letter examples), records missing ones with ElevenLabs into
`public/audio/<lang>/<voiceId>/<audioKey>.mp3`, and writes `public/audio/<lang>/<voiceId>/index.json`
(array of keys) per voice. `--voice <id>` records one voice; `--dry` only counts (per voice, total,
budget left). Monthly character use across all voices is tracked in `scripts/voice-usage.json` and
capped by `ELEVENLABS_MONTHLY_CAP`. To add a voice: new entry in `VOICES`, then `--voice <id>`.

`Settings.voice` is `'mix'` (default) or a voice id. `ProgressProvider` pushes it into the audio
service (`setVoicePreference`), so `say()` callers never pass it. `say()` asks the pure
`pickVoice(pref, available, rng)` (`src/lib/voicePick.ts`): the preferred voice if it has the clip,
otherwise a random voice that does ('mix' always picks randomly, so an unknown saved id also works);
with no recorded clip it falls back to the device voice (`mr-IN`, then `hi-IN`). Settings previews a
voice with `previewVoice(pref)`. Slow playback uses `playbackRate`, never a second recording.

## Speech input

`auto` mode: desktop Chrome → browser `webkitSpeechRecognition` (free); everything else
(iPhone/iPad Safari) → record with `MediaRecorder` and POST to `/api/transcribe`, which checks the
Supabase session and forwards to ElevenLabs Scribe. Without cloud (local mode), server mode is off.

## Accounts

Validation rules (`usernameError`, `passwordError`, `signInError`, `signUpError`) and
`usernameToEmail` live in `src/lib/username.ts` and are shared by the form and `api/signup`.

Username + password. Usernames map to `<username>@users.gappa.example` in Supabase Auth (no email is
sent). Sign-up goes through `/api/signup`, which claims an invite code and creates the user with the
service-role key. Public sign-ups are disabled in Supabase. Without Supabase env vars the app runs
in **local mode** (progress on this device only).
