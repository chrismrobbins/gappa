// Pure decision logic for speech input; the browser facts are injected so it can be tested.
import type { SpeechMode } from '../types'

export interface SpeechEnv {
  userAgent: string
  /** navigator.userAgentData?.brands names, when available. */
  brands: string[]
  hasWebkitRecognition: boolean
  cloudEnabled: boolean
}

/** Free in-browser recognition is only dependable on desktop Chrome. */
function isDesktopChrome(env: SpeechEnv): boolean {
  if (/iPhone|iPad|iPod|Android|Mobile|Edg\/|EdgA|OPR\//.test(env.userAgent)) return false
  // Brands are reliable when present (Brave, Edge, Opera all say "Chromium" but not "Google Chrome").
  if (env.brands.length > 0) return env.brands.includes('Google Chrome')
  return /Chrome\//.test(env.userAgent)
}

export function resolveMode(setting: SpeechMode, env: SpeechEnv): 'browser' | 'server' | 'off' {
  if (setting === 'off') return 'off'
  if (setting === 'browser') return env.hasWebkitRecognition ? 'browser' : fallbackMode(env)
  if (setting === 'server') return fallbackMode(env)
  if (env.hasWebkitRecognition && isDesktopChrome(env)) return 'browser'
  return fallbackMode(env)
}

function fallbackMode(env: SpeechEnv): 'server' | 'off' {
  return env.cloudEnabled ? 'server' : 'off'
}
