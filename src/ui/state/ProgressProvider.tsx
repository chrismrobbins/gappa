import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react'
import { DEFAULT_LANG, getCourse } from '../../content'
import { recordSession, updateSettings } from '../../lib/progress'
import { loadVoiceIndex, setVoicePreference } from '../../services/audio'
import { signOut as authSignOut } from '../../services/auth'
import type { Course, Progress, Role, SessionInput, SessionOutcome, Settings } from '../../types'
import { useProgressStore } from './useProgressStore'
import { useRole } from './useRole'

interface ProgressApi {
  progress: Progress
  course: Course
  username: string | null
  cloud: boolean
  role: Role
  finishSession(input: SessionInput): SessionOutcome
  changeSettings(patch: Partial<Settings>): void
  signOut(): Promise<void>
}

const Ctx = createContext<ProgressApi | null>(null)
const course = getCourse(DEFAULT_LANG)

export function ProgressProvider(props: { cloud: boolean; username: string | null; children: ReactNode }) {
  const { cloud, username, children } = props
  const { progress, setProgress, flush } = useProgressStore(cloud, username)
  const role = useRole()
  // recordSession must see the newest progress even if two calls land before a re-render.
  const latest = useRef(progress)
  latest.current = progress
  useEffect(() => void loadVoiceIndex(course.lang), [])
  const voice = progress.settings.voice
  useEffect(() => setVoicePreference(voice), [voice])

  const finishSession = useCallback((input: SessionInput) => {
    const outcome = recordSession(latest.current, input, course)
    latest.current = outcome.progress
    setProgress(outcome.progress)
    return outcome
  }, [setProgress])

  const changeSettings = useCallback(
    (patch: Partial<Settings>) => setProgress((p) => updateSettings(p, patch, Date.now())),
    [setProgress],
  )
  const signOut = useCallback(() => flush().then(authSignOut), [flush])
  const value = useMemo(
    () => ({ progress, course, username, cloud, role, finishSession, changeSettings, signOut }),
    [progress, username, cloud, role, finishSession, changeSettings, signOut],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useProgress(): ProgressApi {
  const api = useContext(Ctx)
  if (!api) throw new Error('useProgress must be used inside ProgressProvider')
  return api
}
