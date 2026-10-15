import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import { loadLocal, saveLocal } from '../../services/storage'
import { pullProgress, pushProgress } from '../../services/sync'
import { emptyProgress, mergeProgress } from '../../lib/progress'
import type { Progress } from '../../types'

const PUSH_DELAY_MS = 1500

export interface ProgressStore {
  progress: Progress
  setProgress: Dispatch<SetStateAction<Progress>>
  /** Pushes any unsent change now (used before signing out). */
  flush(): Promise<void>
}

/**
 * Merges the cloud copy into local. Until that succeeds nothing is pushed, because a push
 * replaces the cloud row and would drop progress made on other devices. Retries when back online.
 */
function useCloudPull(cloud: boolean, setProgress: Dispatch<SetStateAction<Progress>>): boolean {
  const [pulled, setPulled] = useState(!cloud)
  useEffect(() => {
    if (!cloud) return undefined
    let alive = true
    const pull = (): void => {
      pullProgress()
        .then((remote) => {
          if (!alive) return
          if (remote) setProgress((local) => mergeProgress(local, remote))
          setPulled(true)
          window.removeEventListener('online', pull)
        })
        .catch(() => undefined) // Offline: stay local-only until the 'online' retry.
    }
    window.addEventListener('online', pull)
    pull()
    return () => {
      alive = false
      window.removeEventListener('online', pull)
    }
  }, [cloud, setProgress])
  return pulled
}

/** Debounced push of the latest progress; a failed push stays pending and is retried by flush. */
function useDebouncedPush(enabled: boolean, progress: Progress): () => Promise<void> {
  const pending = useRef<Progress | null>(null)
  const flush = useCallback(async () => {
    const p = pending.current
    pending.current = null
    if (p) await pushProgress(p).catch(() => { pending.current ??= p })
  }, [])
  useEffect(() => {
    if (!enabled) return undefined
    pending.current = progress
    const timer = window.setTimeout(() => void flush(), PUSH_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [enabled, progress, flush])
  useFlushWhenHidden(flush)
  return flush
}

/** Home-screen apps are often closed straight after a lesson: send what is pending first. */
function useFlushWhenHidden(flush: () => Promise<void>): void {
  useEffect(() => {
    const onChange = () => { if (document.visibilityState === 'hidden') void flush() }
    document.addEventListener('visibilitychange', onChange)
    return () => document.removeEventListener('visibilitychange', onChange)
  }, [flush])
}

/** Progress for one owner (username, or null in local mode): saved locally, synced when cloud is on. */
export function useProgressStore(cloud: boolean, owner: string | null): ProgressStore {
  const [progress, setProgress] = useState<Progress>(() => loadLocal(owner) ?? emptyProgress(Date.now()))
  const pulled = useCloudPull(cloud, setProgress)
  useEffect(() => saveLocal(progress, owner), [progress, owner])
  const flush = useDebouncedPush(cloud && pulled, progress)
  return { progress, setProgress, flush }
}
