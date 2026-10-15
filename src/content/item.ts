import type { Item, Letter } from '../types'

type Extra = Pick<Item, 'alsoEn' | 'note' | 'register'>

/** Compact item constructor for content files: it(target, rom, en, extra?). */
export function it(target: string, rom: string, en: string, extra: Extra = {}): Item {
  return { target, rom, en, ...extra }
}

/** Compact letter constructor: letter(char, rom, exampleTarget, exampleRom, exampleEn). */
export function letter(char: string, rom: string, target: string, exRom: string, en: string): Letter {
  return { char, rom, example: it(target, exRom, en) }
}
