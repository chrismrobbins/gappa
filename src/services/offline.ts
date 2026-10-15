import { clipUrls, voiceIndexUrl } from '../lib/offlineClips'
import type { LangId } from '../types'

export interface DownloadProgress { done: number; total: number; failed: number }

/** Registers the service worker (production only). Never throws. */
export function registerServiceWorker(): void {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => undefined)
  })
}

export function offlineSupported(): boolean {
  return import.meta.env.PROD && 'serviceWorker' in navigator
}

async function fetchKeys(lang: LangId, voiceId: string): Promise<string[]> {
  try {
    const res = await fetch(voiceIndexUrl(lang, voiceId))
    const keys: unknown = res.ok ? await res.json() : []
    return Array.isArray(keys) ? keys.filter((k): k is string => typeof k === 'string') : []
  } catch {
    return []
  }
}

/** Every clip url for the given voices. */
export async function listClipUrls(lang: LangId, voiceIds: string[]): Promise<string[]> {
  const keys = await Promise.all(voiceIds.map((id) => fetchKeys(lang, id)))
  return clipUrls(lang, Object.fromEntries(voiceIds.map((id, i) => [id, keys[i]])))
}

/** Asks the service worker to cache `urls`; `onProgress` fires after each batch. Returns a stop function. */
export async function downloadClips(urls: string[], onProgress: (p: DownloadProgress) => void): Promise<() => void> {
  const reg = await navigator.serviceWorker.ready
  const listener = (e: MessageEvent): void => {
    if (e.data?.type === 'DOWNLOAD_PROGRESS') onProgress(e.data as DownloadProgress)
  }
  navigator.serviceWorker.addEventListener('message', listener)
  reg.active?.postMessage({ type: 'DOWNLOAD_AUDIO', urls })
  return () => navigator.serviceWorker.removeEventListener('message', listener)
}
