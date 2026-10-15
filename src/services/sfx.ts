type SfxName = 'correct' | 'wrong' | 'finish' | 'tap'
interface Tone { freq: number; start: number; length: number; wave?: OscillatorType; gain?: number }

const SOUNDS: Record<SfxName, Tone[]> = {
  correct: [
    { freq: 660, start: 0, length: 0.12 },
    { freq: 880, start: 0.11, length: 0.2 },
  ],
  wrong: [{ freq: 150, start: 0, length: 0.25, wave: 'triangle', gain: 0.12 }],
  finish: [523, 659, 784, 1047].map((freq, i) => ({ freq, start: i * 0.09, length: 0.18 })),
  tap: [{ freq: 1200, start: 0, length: 0.03, wave: 'square', gain: 0.04 }],
}

let ctx: AudioContext | null = null

function context(): AudioContext | null {
  try {
    ctx ??= new AudioContext()
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

function playTone(audio: AudioContext, tone: Tone): void {
  const osc = audio.createOscillator()
  const gain = audio.createGain()
  const begin = audio.currentTime + tone.start
  osc.type = tone.wave ?? 'sine'
  osc.frequency.value = tone.freq
  gain.gain.setValueAtTime(tone.gain ?? 0.18, begin)
  gain.gain.exponentialRampToValueAtTime(0.0001, begin + tone.length)
  osc.connect(gain).connect(audio.destination)
  osc.start(begin)
  osc.stop(begin + tone.length)
}

export function sfx(name: SfxName): void {
  const audio = context()
  if (audio) SOUNDS[name].forEach((tone) => playTone(audio, tone))
}
