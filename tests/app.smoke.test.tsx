// @vitest-environment jsdom
// Runtime smoke test: renders the whole app in local mode and plays the first letters lesson
// through to the finish screen. Catches crashes the type checker cannot.
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import type { Progress } from '../src/types'

const MAX_STEPS = 200

function stubBrowser(): void {
  vi.stubEnv('VITE_SUPABASE_URL', '')
  vi.stubEnv('VITE_SUPABASE_ANON_KEY', '')
  vi.stubGlobal('fetch', vi.fn(async () => new Response('[]', { status: 404 })))
  vi.stubGlobal('matchMedia', (query: string) => ({ matches: query.includes('reduce'), media: query }))
  vi.stubGlobal('speechSynthesis', { speak: vi.fn(), cancel: vi.fn(), getVoices: () => [] })
  vi.stubGlobal('SpeechSynthesisUtterance', class { constructor(public text: string) {} })
  vi.stubGlobal('AudioContext', undefined)
}

const button = (name: string | RegExp): HTMLElement | null => screen.queryByRole('button', { name })

/** Tries right-hand options for each left one until it locks as matched. */
function solveMatch(match: HTMLElement): void {
  const [left, right] = Array.from(match.querySelectorAll<HTMLElement>('.match-col'))
  for (const l of Array.from(left.querySelectorAll<HTMLButtonElement>('button'))) {
    for (const r of Array.from(right.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'))) {
      if (l.disabled) break
      fireEvent.click(l)
      fireEvent.click(r)
    }
  }
}

/** One move on whatever card is showing; wrong answers are fine (they are retried once). */
function step(): void {
  const next = button('Continue')
  if (next) return void fireEvent.click(next)
  const match = document.querySelector<HTMLElement>('.match')
  if (match) return solveMatch(match)
  const tile = document.querySelector<HTMLButtonElement>('.tile-bank .tile:not([hidden])')
  if (tile) {
    fireEvent.click(tile)
    return void fireEvent.click(screen.getByRole('button', { name: 'Check' }))
  }
  const options = screen.queryByRole('group', { name: 'Answers' })
  if (options) {
    fireEvent.click(within(options).getAllByRole('button')[0])
    return void fireEvent.click(screen.getByRole('button', { name: 'Check' }))
  }
  throw new Error(`No way forward on: ${document.body.textContent?.slice(0, 200)}`)
}

function playToFinish(): void {
  for (let i = 0; i < MAX_STEPS && !screen.queryByText('Lesson complete!'); i++) step()
}

function savedProgress(): Progress {
  return JSON.parse(localStorage.getItem('gappa.progress.v1') ?? '{}') as Progress
}

describe('app smoke test (local mode)', () => {
  beforeAll(stubBrowser)
  afterEach(cleanup)

  it('plays the first letters lesson to the finish screen, awards XP and saves it', async () => {
    const { App } = await import('../src/ui/App')
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'अक्षरं · Letters' }))
    fireEvent.click(screen.getByRole('button', { name: /^Vowels I, unlocked$/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Start' }))
    playToFinish()

    expect(screen.getByText('Lesson complete!')).toBeTruthy()
    const xp = screen.getByText(/^\+\d+$/)
    expect(Number(xp.textContent?.slice(1))).toBeGreaterThan(0)

    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByRole('button', { name: /^Vowels I, done$/ })).toBeTruthy()
    expect(savedProgress().lessons['mr-s-1']?.count).toBe(1)
  })

  // Runs after the letters test on the same storage, so the day should show exactly two sessions.
  it('plays the first unit lesson (teach, choice, match, tiles) and records it once', async () => {
    const { App } = await import('../src/ui/App')
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /^Greetings, unlocked$/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Start' }))
    playToFinish()

    expect(screen.getByText('Lesson complete!')).toBeTruthy()
    const lessonId = Object.keys(savedProgress().lessons).find((id) => id !== 'mr-s-1')
    expect(lessonId).toBeDefined()
    expect(savedProgress().lessons[lessonId ?? '']?.count).toBe(1)
    expect(Object.values(savedProgress().days)[0]?.sessions).toBe(2)
  })
})
