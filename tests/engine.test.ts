import { describe, expect, it } from 'vitest'
import { COURSES } from '../src/content'
import { seededRng } from '../src/lib/random'
import { CHECKPOINT_SIZE } from '../src/config'
import { displayTokens, tokens } from '../src/lib/text'
import {
  buildCheckpoint, buildLesson, buildReview, buildScriptLesson, findEntry,
  gradeChoice, gradeSpeech, gradeTiles, itemKey,
} from '../src/engine'
import type { Card, ChoiceCard, Course, ExerciseCard, ItemKey, TilesCard } from '../src/types'

const course = COURSES.mr as Course
const lessons = course.units.flatMap((u) => u.lessons)
const SEEDS = [1, 2, 3]

const isExercise = (c: Card): c is ExerciseCard => ['choice', 'match', 'tiles', 'speak'].includes(c.kind)
const cardKeys = (c: ExerciseCard): ItemKey[] => ('keys' in c ? c.keys : [c.key])

/** Keys shown on teach / teach-letters cards so far. */
function taughtKeys(card: Card, lessonId: string): ItemKey[] {
  if (card.kind === 'teach') {
    return card.items.flatMap((i) => [itemKey(lessonId, 'w', i.target), itemKey(lessonId, 'p', i.target)])
  }
  return card.kind === 'teach-letters' ? card.letters.map((l) => itemKey(lessonId, 'l', l.char)) : []
}

function expectTeachBeforeTest(cards: Card[], lessonId: string) {
  const taught = new Set<ItemKey>()
  for (const card of cards) {
    taughtKeys(card, lessonId).forEach((k) => taught.add(k))
    if (!isExercise(card)) continue
    for (const key of cardKeys(card)) expect(taught.has(key), `${key} tested before taught`).toBe(true)
  }
}

function expectValidChoice(card: ChoiceCard) {
  expect(card.options.length).toBeGreaterThanOrEqual(3)
  expect(card.options.length).toBeLessThanOrEqual(4)
  expect(card.answer).toBeGreaterThanOrEqual(0)
  expect(card.answer).toBeLessThan(card.options.length)
  const texts = card.options.map((o) => o.text)
  expect(new Set(texts).size, texts.join(',')).toBe(texts.length)
}

function expectReachable(card: TilesCard) {
  const texts = card.tiles.map((t) => t.text)
  for (const answer of card.answers) for (const token of answer) expect(texts).toContain(token)
  expect(card.tiles.length).toBeGreaterThan(card.answers[0].length)
}

function expectValidExercises(cards: Card[]) {
  for (const card of cards) {
    if (card.kind === 'choice') expectValidChoice(card)
    if (card.kind === 'tiles') expectReachable(card)
    if (card.kind === 'match') expect(card.pairs.length).toBe(card.keys.length)
  }
}

describe('lessons', () => {
  for (const lesson of lessons) {
    it(`${lesson.id} is well formed`, () => {
      for (const seed of SEEDS) {
        const cards = buildLesson(course, lesson.id, seededRng(seed))
        expectTeachBeforeTest(cards, lesson.id)
        expectValidExercises(cards)
        expect(cards[cards.length - 1].kind).toBe('speak')
      }
    })
  }

  it('is deterministic for a seed', () => {
    const id = lessons[0].id
    expect(buildLesson(course, id, seededRng(5))).toEqual(buildLesson(course, id, seededRng(5)))
  })

  it('uses the course name in instructions', () => {
    const cards = buildLesson(course, lessons[0].id, seededRng(1))
    const text = JSON.stringify(cards.filter((c) => c.kind === 'choice'))
    expect(text).toContain(`Pick the ${course.name} for`)
    const renamed = buildLesson({ ...course, name: 'Hindi' }, lessons[0].id, seededRng(1))
    expect(JSON.stringify(renamed.filter((c) => c.kind === 'choice'))).toContain('Pick the Hindi for')
  })

  it('tiles pair each token with its romanization', () => {
    const cards = buildLesson(course, lessons[0].id, seededRng(1))
    const tiles = cards.filter((c): c is TilesCard => c.kind === 'tiles')
    expect(tiles.length).toBeGreaterThan(0)
    for (const t of tiles) for (const tile of t.tiles) expect(displayTokens(tile.rom ?? '').length).toBe(1)
  })

  it('returns nothing for an unknown lesson', () => {
    expect(buildLesson(course, 'nope')).toEqual([])
  })
})

describe('script lessons', () => {
  for (const script of course.script) {
    it(`${script.id} is well formed`, () => {
      for (const seed of SEEDS) {
        const cards = buildScriptLesson(course, script.id, seededRng(seed))
        expectTeachBeforeTest(cards, script.id)
        expectValidExercises(cards)
        expect(cards[cards.length - 1].kind).toBe('match')
        expect(cards[0].kind).toBe('teach-letters')
      }
    })
  }
})

describe('review and checkpoint', () => {
  const allKeys: ItemKey[] = [
    ...lessons.flatMap((l) => [
      ...l.words.map((w) => itemKey(l.id, 'w', w.target)),
      ...l.phrases.map((p) => itemKey(l.id, 'p', p.target)),
    ]),
    ...course.script.flatMap((s) => s.letters.map((l) => itemKey(s.id, 'l', l.char))),
  ]

  it('builds one valid exercise per key', () => {
    for (const seed of SEEDS) {
      const cards = buildReview(course, allKeys, seededRng(seed))
      expect(cards).toHaveLength(allKeys.length)
      expectValidExercises(cards)
      cards.forEach((c, i) => expect(isExercise(c) && cardKeys(c)).toContain(allKeys[i]))
    }
  })

  it('builds a checkpoint of CHECKPOINT_SIZE items from the unit', () => {
    for (const unit of course.units) {
      const cards = buildCheckpoint(course, unit.id, seededRng(9))
      expect(cards).toHaveLength(CHECKPOINT_SIZE)
      expectValidExercises(cards)
    }
  })

  it('skips unknown keys', () => {
    expect(buildReview(course, ['x|w|y', 'junk'])).toEqual([])
  })
})

describe('findEntry', () => {
  it('finds words, phrases and letters', () => {
    const lesson = lessons[0]
    expect(findEntry(course, itemKey(lesson.id, 'w', lesson.words[0].target))?.item).toBe(lesson.words[0])
    expect(findEntry(course, itemKey(lesson.id, 'p', lesson.phrases[0].target))?.lessonId).toBe(lesson.id)
    const letter = course.script[0].letters[0]
    const found = findEntry(course, itemKey(course.script[0].id, 'l', letter.char))
    expect(found?.letter).toBe(letter)
    expect(found?.item).toBe(letter.example)
  })

  it('returns undefined for unknown keys', () => {
    expect(findEntry(course, 'nope')).toBeUndefined()
    expect(findEntry(course, `${lessons[0].id}|w|missing`)).toBeUndefined()
  })
})

describe('grading', () => {
  const cards = buildLesson(course, lessons[0].id, seededRng(1))
  const choice = cards.find((c): c is ChoiceCard => c.kind === 'choice') as ChoiceCard
  const tiles = cards.find((c): c is TilesCard => c.kind === 'tiles') as TilesCard

  it('grades choices', () => {
    expect(gradeChoice(choice, choice.answer)).toBe(true)
    expect(gradeChoice(choice, (choice.answer + 1) % choice.options.length)).toBe(false)
  })

  it('grades tiles ignoring case and punctuation', () => {
    const right = tiles.answers[0]
    expect(gradeTiles(tiles, right)).toBe(true)
    expect(gradeTiles(tiles, right.map((t) => `${t}.`))).toBe(true)
    expect(gradeTiles(tiles, [...right].reverse().concat('x'))).toBe(false)
    expect(gradeTiles(tiles, [])).toBe(false)
  })

  it('grades speech with tolerance', () => {
    const phrase = lessons[0].phrases[0].target
    expect(gradeSpeech(phrase, phrase)).toBe(true)
    expect(gradeSpeech(phrase, phrase.slice(0, -1))).toBe(true)
    expect(gradeSpeech(phrase, 'hello there')).toBe(false)
    expect(gradeSpeech(phrase, '')).toBe(false)
    expect(tokens(phrase).length).toBeGreaterThan(0)
  })
})
