import { useEffect, useRef, useState } from 'react'
import { startListening, type Listener } from '../../services/speech'
import type { LangId } from '../../types'

type SpeechPhase = 'idle' | 'listening' | 'processing'
type Heard = { text: string } | { error: string }

const messageOf = (e: unknown, fallback: string): string => (e instanceof Error ? e.message : fallback)

async function readTranscript(active: Listener): Promise<Heard> {
  try {
    const text = (await active.stop()).trim()
    return text ? { text } : { error: 'We did not catch that. Tap the mic and try again.' }
  } catch (e) {
    return { error: messageOf(e, 'We could not hear that. Please try again.') }
  }
}

/** The live listener, cancelled on unmount; `alive` turns away results that arrive afterwards. */
function useListenerRef() {
  const listener = useRef<Listener | null>(null)
  const alive = useRef(true)
  useEffect(() => () => { alive.current = false; listener.current?.cancel() }, [])
  return { listener, alive }
}

/** Mic state machine: toggle() starts listening, then stops and hands back the transcript. */
export function useSpeech(lang: LangId, mode: 'browser' | 'server', onTranscript: (text: string) => void) {
  const [phase, setPhase] = useState<SpeechPhase>('idle')
  const [error, setError] = useState<string | null>(null)
  const { listener, alive } = useListenerRef()

  const begin = () => {
    try {
      listener.current = startListening(lang, mode)
      setError(null)
      setPhase('listening')
    } catch (e) {
      setError(messageOf(e, 'We could not start the microphone.'))
    }
  }
  const finish = async (active: Listener) => {
    listener.current = null
    setPhase('processing')
    const heard = await readTranscript(active)
    if (!alive.current) return // The card is gone; grading now would hit the next card.
    setPhase('idle')
    if ('text' in heard) onTranscript(heard.text)
    else setError(heard.error)
  }
  const toggle = () => {
    if (phase === 'idle') begin()
    else if (phase === 'listening' && listener.current) void finish(listener.current)
  }
  return { phase, error, toggle }
}
