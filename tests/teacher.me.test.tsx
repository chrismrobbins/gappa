// @vitest-environment jsdom
// Me screen: teacher tools appear only for teachers/admins (the reviews service is mocked).
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import type { Role } from '../src/types'

let role: Role = 'learner'
vi.mock('../src/services/reviews', () => ({
  fetchMyRole: vi.fn(async () => role),
  fetchMyReviews: vi.fn(async () => []),
}))

beforeAll(() => {
  vi.stubEnv('VITE_SUPABASE_URL', '')
  vi.stubEnv('VITE_SUPABASE_ANON_KEY', '')
  vi.stubGlobal('fetch', vi.fn(async () => new Response('[]', { status: 404 })))
  vi.stubGlobal('matchMedia', (query: string) => ({ matches: query.includes('reduce'), media: query }))
})
afterEach(cleanup)

async function renderMe() {
  const { ProgressProvider } = await import('../src/ui/state/ProgressProvider')
  const { MeScreen } = await import('../src/ui/me/MeScreen')
  render(<ProgressProvider cloud={false} username={null}><MeScreen onTeacher={() => undefined} /></ProgressProvider>)
}

describe('Me screen teacher cards', () => {
  it('shows none for a learner', async () => {
    role = 'learner'
    await renderMe()
    await new Promise((r) => setTimeout(r, 20))
    expect(screen.queryByText('Review content')).toBeNull()
    expect(screen.queryByText('Teachers')).toBeNull()
    expect(screen.queryByText('Open fixes')).toBeNull()
  })

  it('shows the review card for a teacher but not the admin cards', async () => {
    role = 'teacher'
    await renderMe()
    await waitFor(() => expect(screen.getByText('Review content')).toBeTruthy())
    expect(screen.getByText(/lines checked/)).toBeTruthy()
    expect(screen.queryByText('Open fixes')).toBeNull()
  })

  it('shows all three cards for an admin', async () => {
    role = 'admin'
    await renderMe()
    await waitFor(() => expect(screen.getByText('Open fixes')).toBeTruthy())
    expect(screen.getByText('Teachers')).toBeTruthy()
  })
})
