// One small factory per exercise type.

import type { ChoiceCard, Item, ItemKey, Letter, MatchCard, Shown, SpeakCard, TilesCard } from '../types'
import { tokens } from '../lib/text'
import { shuffle, type Rng } from '../lib/random'
import { pairTokens, wrongItems, wrongLetters, wrongTiles } from './distractors'

/** What a factory needs to pick wrong answers. */
export interface ItemEnv {
  name: string
  pools: readonly (readonly Item[])[]
  rng: Rng
}

export interface LetterEnv {
  pools: readonly (readonly Letter[])[]
  rng: Rng
}

const target = (i: Item): Shown => ({ text: i.target, rom: i.rom })
const english = (i: Item): Shown => ({ text: i.en })
const glyph = (l: Letter): Shown => ({ text: l.char, rom: l.rom })
const sound = (l: Letter): Shown => ({ text: l.rom })

interface ChoiceSpec {
  key: ItemKey
  instruction: string
  prompt: Shown
  say?: string
  hidePrompt?: boolean
  right: Shown
  wrong: Shown[]
}

function choice(spec: ChoiceSpec, rng: Rng): ChoiceCard {
  const { right, wrong, ...rest } = spec
  const options = shuffle([right, ...wrong], rng)
  return { kind: 'choice', ...rest, options, answer: options.indexOf(right) }
}

/** Target -> English. */
export function meaningChoice(env: ItemEnv, key: ItemKey, item: Item): ChoiceCard {
  const wrong = wrongItems(item, env.pools, env.rng).map(english)
  const spec = { key, instruction: 'What does this mean?', prompt: target(item), say: item.target, right: english(item), wrong }
  return choice(spec, env.rng)
}

/** English -> target. */
export function wordChoice(env: ItemEnv, key: ItemKey, item: Item): ChoiceCard {
  const wrong = wrongItems(item, env.pools, env.rng).map(target)
  const instruction = `Pick the ${env.name} for “${item.en}”`
  return choice({ key, instruction, prompt: english(item), right: target(item), wrong }, env.rng)
}

/** Audio -> target. */
export function listenChoice(env: ItemEnv, key: ItemKey, item: Item): ChoiceCard {
  const wrong = wrongItems(item, env.pools, env.rng).map(target)
  const spec = { key, instruction: 'What do you hear?', prompt: target(item), say: item.target, hidePrompt: true, right: target(item), wrong }
  return choice(spec, env.rng)
}

/** Letter -> sound. */
export function letterSoundChoice(env: LetterEnv, key: ItemKey, letter: Letter): ChoiceCard {
  const wrong = wrongLetters(letter, env.pools, env.rng).map(sound)
  const spec = { key, instruction: 'What sound does this letter make?', prompt: { text: letter.char }, say: letter.char, right: sound(letter), wrong }
  return choice(spec, env.rng)
}

/** Audio -> letter. */
export function letterChoice(env: LetterEnv, key: ItemKey, letter: Letter): ChoiceCard {
  const wrong = wrongLetters(letter, env.pools, env.rng).map(glyph)
  const spec = { key, instruction: 'Which letter do you hear?', prompt: glyph(letter), say: letter.char, hidePrompt: true, right: glyph(letter), wrong }
  return choice(spec, env.rng)
}

interface TilesOptions {
  /** Listening version: play the phrase instead of showing the English. */
  listen?: boolean
}

export function tilesFor(
  key: ItemKey,
  item: Item,
  source: readonly Item[],
  rng: Rng,
  { listen = false }: TilesOptions = {},
): TilesCard {
  const tiles = shuffle([...pairTokens(item), ...wrongTiles(item, source, rng)], rng)
  const base = { kind: 'tiles' as const, key, tiles, answers: [tokens(item.target)] }
  if (listen) {
    return { ...base, instruction: 'Build what you hear', prompt: target(item), say: item.target, hidePrompt: true }
  }
  return { ...base, instruction: 'Build the sentence', prompt: english(item) }
}

/** Pairs of items; entries sharing text or meaning are dropped so every pair is unambiguous. */
function matchFor(entries: { key: ItemKey; left: Shown; right: Shown }[]): MatchCard {
  const seen = new Set<string>()
  const kept = entries.filter((e) => {
    const fresh = !seen.has(e.left.text) && !seen.has(e.right.text)
    seen.add(e.left.text)
    seen.add(e.right.text)
    return fresh
  })
  return { kind: 'match', keys: kept.map((e) => e.key), pairs: kept.map(({ left, right }) => ({ left, right })) }
}

export function itemMatch(entries: { key: ItemKey; item: Item }[]): MatchCard {
  return matchFor(entries.map(({ key, item }) => ({ key, left: target(item), right: english(item) })))
}

export function letterMatch(entries: { key: ItemKey; letter: Letter }[]): MatchCard {
  return matchFor(entries.map(({ key, letter }) => ({ key, left: { text: letter.char }, right: sound(letter) })))
}

export function speakFor(key: ItemKey, item: Item): SpeakCard {
  return { kind: 'speak', key, item }
}
