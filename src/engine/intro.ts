// Intro lessons: explanation slides, each optionally followed by one quick check.

import type { Card, ChoiceCard, Course, IntroCheck, IntroLesson } from '../types'
import type { Rng } from '../lib/random'

export const findIntro = (course: Course, introId: string): IntroLesson | undefined =>
  course.intro.find((l) => l.id === introId)

/** Options keep their authored order: some are ordered pairs. */
function checkCard(key: string, check: IntroCheck): ChoiceCard {
  return {
    kind: 'choice',
    key,
    instruction: check.question,
    prompt: check.prompt === undefined ? undefined : { text: check.prompt },
    say: check.prompt,
    options: check.options.map((text) => ({ text })),
    answer: check.answer,
    explain: check.explain,
  }
}

// `rng` is accepted for the same signature as the other builders; intro lessons are never shuffled.
export function buildIntroLesson(course: Course, introId: string, _rng?: Rng): Card[] {
  const lesson = findIntro(course, introId)
  if (!lesson) return []
  return lesson.slides.flatMap((slide, i): Card[] => [
    { kind: 'slide', slide },
    ...(slide.check ? [checkCard(`${lesson.id}|q|${i}`, slide.check)] : []),
  ])
}
