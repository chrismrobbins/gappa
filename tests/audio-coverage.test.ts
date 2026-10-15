import { readFileSync } from 'node:fs'
import { expect, test } from 'vitest'
import { VOICES } from '../src/config'
import { getCourse } from '../src/content'
import { buildLesson, buildScriptLesson } from '../src/engine'
import { audioKey } from '../src/lib/audioKey'
import { seededRng } from '../src/lib/random'
import type { Card } from '../src/types'

function spoken(card: Card): string[] {
  if (card.kind === 'teach') return card.items.map((i) => i.target)
  if (card.kind === 'teach-letters') return card.letters.flatMap((l) => [l.char, l.example.target])
  if (card.kind === 'speak') return [card.item.target]
  if (card.kind === 'choice' || card.kind === 'tiles') return card.say ? [card.say] : []
  return []
}
const recorded = (voice: string) =>
  new Set<string>(JSON.parse(readFileSync(`public/audio/mr/${voice}/index.json`, 'utf8')))

// Fails when content changes without `npm run voices`, so no line ships silent.
test.each(VOICES.map((v) => v.id))('every line the lessons speak is recorded in %s', (voice) => {
  const c = getCourse('mr')
  const index = recorded(voice)
  const cards = [...c.units.flatMap((u) => u.lessons.map((l) => buildLesson(c, l.id, seededRng(3)))),
    ...c.script.map((s) => buildScriptLesson(c, s.id, seededRng(3)))].flat()
  const missing = [...new Set(cards.flatMap(spoken))].filter((t) => !index.has(audioKey(t)))
  expect(missing).toEqual([])
})
