# Gappa (गप्पा)

A small, Duolingo-style course for learning Marathi: letters, words and phrases in short lessons,
with streaks, XP, spaced review, and native-speaker audio. It is a Vite + React + TypeScript web app
that installs to the iPhone/iPad home screen. Accounts and progress sync live in Supabase, the
Vercel functions in `api/` handle sign-up and speech-to-text, and voices are pre-recorded with
ElevenLabs. See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the module map and APIs.

## Local development

```sh
npm i
npm run dev        # http://localhost:5173
```

With no Supabase env vars the app runs in **local mode**: no sign-in, progress is kept in this
browser's `localStorage`, and server speech recognition is off (desktop Chrome can still use its
built-in recognition).

```sh
npm test           # Vitest: pure modules plus a jsdom smoke test of the whole app
npm run typecheck
npm run build      # typecheck + production build into dist/
```

## Supabase setup

1. Create a project at supabase.com.
2. Run the migration: paste `supabase/migrations/0001_init.sql` into the SQL editor, or
   `supabase db push` with the CLI linked to the project.
3. **Authentication → Sign In / Providers**: turn off **Allow new users to sign up**. Accounts
   are created only by `/api/signup` with an invite code. Email confirmation can stay off; the
   synthetic `@users.gappa.example` addresses never receive mail.
4. Copy the keys from **Project Settings → API** into `.env` (start from `.env.example`):

| Variable | Where | Value |
|---|---|---|
| `VITE_SUPABASE_URL` | browser (build time) | Project URL |
| `VITE_SUPABASE_ANON_KEY` | browser (build time) | `anon` public key |
| `SUPABASE_URL` | server + scripts | Project URL |
| `SUPABASE_ANON_KEY` | server | `anon` key (verifies sessions in `/api/transcribe`) |
| `SUPABASE_SERVICE_ROLE_KEY` | server + scripts | `service_role` key. **Never** prefix with `VITE_` |
| `ELEVENLABS_API_KEY` | server + scripts | ElevenLabs API key |
| `ELEVENLABS_TTS_MODEL` / `ELEVENLABS_STT_MODEL` | optional | Defaults `eleven_v3` / `scribe_v1` |
| `ELEVENLABS_MONTHLY_CAP` | scripts | Character budget per month (default 28000) |

`.env` is git-ignored. Only the two `VITE_` values are bundled into the browser code.

`/api/*` only runs on Vercel, so to try sign-up or server speech locally use `vercel dev`
instead of `npm run dev`.

## Deploy to Vercel

1. Import the GitHub repo in Vercel. It detects Vite (build `npm run build`, output `dist`).
2. Add these env vars under **Settings → Environment Variables**: `VITE_SUPABASE_URL`,
   `VITE_SUPABASE_ANON_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
   `ELEVENLABS_API_KEY`, and optionally `ELEVENLABS_STT_MODEL`.
3. Deploy. `vercel.json` adds the SPA rewrite and security headers (a strict Content-Security-Policy
   that allows only this origin, Google Fonts and `*.supabase.co`).

## Invites and accounts

```sh
npm run invite                       # one-use code, e.g. GAPPA-7KQ2M9XA
npm run invite -- 5 "Family"         # five uses, with a note
npm run reset-password -- <username> <newPassword>
```

These use `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` from `.env`.

## Teachers

Teacher mode lets a native speaker review every word, phrase, letter and example (text,
romanization, English and each recorded voice) and flag fixes, which you then see and resolve.

1. Paste `supabase/migrations/0002_teachers.sql` into the Supabase SQL editor and run it.
2. Make yourself the admin: `npm run set-role -- chrismrobbins admin`.
3. Invite her with `npm run invite`, and have her sign up with the code.
4. Make her a teacher from **Me → Teachers → Make teacher**, or `npm run set-role -- <username> teacher`.
5. She now sees **Review content** on Me (and a flag button inside lessons). Read what she found
   with `npm run feedback` (grouped by lesson, with ids), then mark one done with
   `npm run feedback -- --resolve <id>` or from **Me → Open fixes**.

Until 0002 is applied the app works as before; nobody sees teacher tools.

## Offline

Once the app has been opened online it launches and runs lessons offline (a hand-written service
worker, `public/sw.js`, active in production builds only). Audio you have played is cached, and
**Me → Settings → Offline audio** downloads every clip for your voice setting (about 15 MB for Mix)
before a trip. Progress is saved on the device and syncs when you are back online. After a deploy,
open the app once online to pick up the new version.

## Recording voices

The course is recorded in every voice listed in `VOICES` (`src/config.ts`). The recorder collects every
line the course can say, records only the missing ones into `public/audio/<lang>/<voiceId>/<key>.mp3`,
and rewrites each voice's `index.json`. It tracks usage in `scripts/voice-usage.json` and stops at
`ELEVENLABS_MONTHLY_CAP` (the cap covers all voices together).

```sh
# Audition: saves one sample per raw ElevenLabs voice id into scripts/auditions/ (git-ignored)
npm run voices -- --audition "नमस्कार, कसे आहात?" --voices <elevenLabsId1>,<elevenLabsId2>
# Check the cost per voice and the total
npm run voices -- --dry
# Record every voice (or just one with --voice <id>); commit public/audio/ and scripts/voice-usage.json
npm run voices
```

To add a voice: add an entry to `VOICES` in `src/config.ts`, then run `npm run voices -- --voice <id>`.
Learners pick a voice or "Mix" (a random recorded voice per line) in Me → Settings.

Lines without a recording fall back to the device's Marathi (or Hindi) voice. To re-record a voice, delete
`public/audio/mr/<voiceId>/` and run it again.
