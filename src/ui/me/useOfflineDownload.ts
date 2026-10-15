import { useCallback, useEffect, useRef, useState } from 'react'
import { DEFAULT_LANG } from '../../content'
import { VOICES } from '../../config'
import { voicesToDownload } from '../../lib/offlineClips'
import { downloadClips, listClipUrls, type DownloadProgress } from '../../services/offline'

export type DownloadState = 'idle' | 'running' | 'done'

export interface OfflineDownload {
  clipCount: number | null
  progress: DownloadProgress | null
  state: DownloadState
  start(): void
}

/** Clip list for the voice preference, plus a `start` that has the service worker cache them. */
export function useOfflineDownload(voicePref: string): OfflineDownload {
  const [urls, setUrls] = useState<string[] | null>(null)
  const [progress, setProgress] = useState<DownloadProgress | null>(null)
  const [state, setState] = useState<DownloadState>('idle')
  const stop = useRef<(() => void) | null>(null)
  useEffect(() => {
    setUrls(null); setState('idle'); setProgress(null)
    void listClipUrls(DEFAULT_LANG, voicesToDownload(voicePref, VOICES.map((v) => v.id))).then(setUrls)
  }, [voicePref])
  useEffect(() => () => stop.current?.(), [])
  const start = useCallback(() => {
    if (!urls) return
    setState('running')
    void downloadClips(urls, (p) => {
      setProgress(p)
      if (p.done >= p.total) setState('done')
    }).then((s) => { stop.current = s })
  }, [urls])
  return { clipCount: urls ? urls.length : null, progress, state, start }
}
