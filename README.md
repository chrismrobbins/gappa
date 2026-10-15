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
| `ELEVENLABS_VOICE_ID` | scripts | Voice used for recordings |
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

## Recording voices

The recorder collects every line the course can say, records only the missing ones into
`public/audio/<lang>/<key>.mp3`, and rewrites `public/audio/<lang>/index.json`. It tracks usage in
`scripts/voice-usage.json` and stops at `ELEVENLABS_MONTHLY_CAP`.

```sh
# 1. Pick a voice: saves one sample per voice into scripts/auditions/ (git-ignored)
npm run voices -- --audition "नमस्कार, कसे आहात?" --voices <voiceId1>,<voiceId2>
# 2. Put the chosen id in ELEVENLABS_VOICE_ID, then check the cost
npm run voices -- --dry
# 3. Record for real, and commit public/audio/ and scripts/voice-usage.json
npm run voices
```

Lines without a recording fall back to the device's Marathi (or Hindi) voice. After changing voices,
delete `public/audio/mr/` and record again.
