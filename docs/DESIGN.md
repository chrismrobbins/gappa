# Gappa design

Gappa should feel like a warm, playful, polished game: Duolingo's energy, with an Indian festival
palette (marigold garlands, peacock teal, kumkum red, turmeric, cream). Chunky, tactile,
confident. Never a wireframe: every screen has one obvious primary action, generous type, and color.

## Principles

1. **Big and tactile.** Primary buttons, options, tiles and path nodes are "3D": a solid face plus a
   darker bottom edge (`box-shadow: 0 4px 0 <edge>`) that collapses on press (`translateY(4px)`).
2. **Devanagari is the hero.** Target-language text is always the largest thing in its context.
   Romanization sits quietly under it.
3. **One clear next step.** The Learn screen opens with a "Continue" hero button; lesson screens end
   in a full-width footer button.
4. **Color means something.** Marigold = primary action / progress / XP. Peacock = correct /
   unlocked / current. Kumkum = wrong. Streak = orange flame. Muted cream = locked.
5. **Calm motion.** Short spring-y transitions (`--dur`, `--ease`), a feedback sheet that slides up, a
   pulsing ring on the current lesson. Everything respects `prefers-reduced-motion`.

## Type scale

Body 17px (`html { font-size: 106.25% }`). Display: 'Baloo 2' 700–800. Body and Devanagari: 'Mukta'.

| Token | Use |
|---|---|
| `--text-instruction` 1.45rem Baloo 800 | Lesson instruction ("What does this mean?") |
| `--text-native-hero` 2.6rem | Teach-card word, prompt to translate |
| `--text-native` 1.9rem | Prompts, letters examples |
| `--text-option` 1.3rem | Devanagari inside options, tiles, match |
| `--text-rom` 0.85rem, muted, letter-spacing .02em | Romanization line |

## Layout

- Content column: `--max-width` 600px, centered, 16px side gutter. Bars are full-bleed with an inner
  centered container (never a border that stops short of the window edge).
- **Wide screens (≥ 900px, Mac/iPad landscape):** tab bar becomes a fixed left sidebar (240px) with the
  wordmark on top and labelled nav items; the top stats bar sits at the top of the content column.
- Background: `--bg` with a very faint rangoli dot pattern (two offset radial-gradient layers,
  ~4% opacity of `--marigold`), fixed.

## Components

- **Top bar:** left the गप्पा wordmark (small, marigold-ink); right three stat pills: flame + streak
  (orange when today is done, muted otherwise), star + XP, goal ring (filled arc + today's XP
  in the center).
- **Hero card (Learn):** greeting, "Today: 12 / 20 XP" with a thick rounded progress bar, a one-line
  streak nudge ("Keep your 3-day streak alive!" / "Start a streak today"), and a big marigold
  "Continue · <next lesson title>" button that starts the next unlocked, unfinished lesson.
- **Unit banner:** full-width rounded card filled with a unit color (unit 1 peacock, then indigo,
  kumkum, marigold-ink…), white text: eyebrow "UNIT 1", title `नमस्कार! · Hello!`, lessons done
  "0 / 5" chip. Letters track uses a turmeric banner "अक्षरं · Letters".
- **Path:** 80px round 3D nodes on a serpentine (horizontal offset follows a sine wave, ±70px).
  Current node: marigold with a pulsing ring and a "Start" speech-bubble label floating above it.
  Done: marigold-ink face with a white check. Locked: cream face, muted lock. Checkpoint: rounded
  square with a trophy. Letters nodes show the lesson's first letter (अ, ए, क…) in big Devanagari
  instead of an icon. Small decorative marigold flowers (inline SVG, 8 petals) sit beside the
  path every few nodes, alternating sides.
- **Tab bar (phone):** full-bleed, 64px + safe area; icon 26px over label; the active item gets a
  marigold-soft pill behind the icon and marigold-ink label.
- **Lesson header:** close X, a thick 14px progress bar (marigold fill with a lighter top highlight
  stripe), nothing else.
- **Prompt:** instruction heading, then the prompt in a speech-bubble card (surface, soft border, a
  small tail) with a round peacock speaker button (48px) and a smaller turtle (slow) button.
  Listening prompts show only a big 96px speaker button and the turtle.
- **Options:** full-width 3D buttons, 64px min height, `--text-option` Devanagari, rom underneath.
  Selected: peacock-soft face, peacock border and edge. After check: right = peacock, wrong = kumkum.
- **Tiles:** answer area with two faint ruled lines (like a notebook); tiles are 3D chips with
  Devanagari + rom; used tiles leave a dashed placeholder in the bank.
- **Match:** two columns of 3D tiles; selected = peacock-soft; matched pairs fade to 40% and
  disable; a wrong pair shakes briefly (kumkum).
- **Teach cards:** "New word" eyebrow chip; each item is a card with a colored left accent strip,
  the word at `--text-native-hero`, rom, English in bold, note/register chips, and the speaker button.
- **Tip card:** notebook look: turmeric left border, a "Tip" badge with a lightbulb, body text 1.05rem
  with emphasized Devanagari in marigold-ink.
- **Feedback sheet:** full-bleed bottom sheet that slides up, tinted peacock-soft or kumkum-soft,
  with a round icon (check / x), title ("Nice!" / "Not quite"), correct answer when wrong, and a
  full-width 3D Continue button in peacock or kumkum.
- **Finish:** big celebration title ("Lesson complete!"), three stat tiles (XP marigold, accuracy
  peacock, streak orange) with icons and count-up numbers, earned badges as medallions, petal
  confetti, full-width Continue.
- **Review:** two large feature cards (Due words, Fix my mistakes) each with an icon medallion,
  a big count and a 3D button; a friendly empty state with an illustration-style icon.
- **Me:** profile header card (marigold circle avatar with the username's first letter, username,
  "Level 3" badge, level progress bar), a 2×2 stats grid (streak, total XP, level, freezes), badges
  as round medallions (earned: marigold gradient + icon; unearned: cream + muted), settings as a
  grouped list card with rows (label left, control right).
