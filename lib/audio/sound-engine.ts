/**
 * @mold/audio - Phosphor Chiptune Web Audio Synthesizer
 *
 * Pure Web Audio API synthesizer. Zero external assets, zero bandwidth overhead.
 * SSR-safe, mobile-friendly with automatic AudioContext resume on user gesture.
 */

const AUDIO_STORAGE_KEY = "mold_v2_audio_muted"

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {
      // Safe fallback if user gesture is pending
    })
  }
  return audioCtx
}

let memoryMuted = false

export function isAudioMuted(): boolean {
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    try {
      const stored = localStorage.getItem(AUDIO_STORAGE_KEY)
      if (stored !== null) return stored === "true"
    } catch {
      // fallback
    }
  }
  return memoryMuted
}

export function setAudioMuted(muted: boolean): void {
  memoryMuted = muted
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    try {
      localStorage.setItem(AUDIO_STORAGE_KEY, muted ? "true" : "false")
    } catch {
      // safe fallback
    }
  }
}

export function toggleAudioMute(): boolean {
  const current = isAudioMuted()
  const next = !current
  setAudioMuted(next)
  if (!next) {
    // Play subtle confirmation chime on unmute
    playKeyClick()
  }
  return next
}

/**
 * 15ms high-passed mechanical switch click on option selection [1..4]
 */
export function playKeyClick(): void {
  if (isAudioMuted()) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const now = ctx.currentTime

    osc.type = "triangle"
    osc.frequency.setValueAtTime(800, now)
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.015)

    gain.gain.setValueAtTime(0.08, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.015)
  } catch {
    // audio failure recovery
  }
}

/**
 * Harmonically rich ascending sine chime for correct answers
 */
export function playCorrectChime(): void {
  if (isAudioMuted()) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const now = ctx.currentTime
    const notes = [440.0, 554.37, 659.25] // A4 -> C#5 -> E5 major triad

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const startTime = now + idx * 0.05
      const dur = 0.18

      osc.type = "sine"
      osc.frequency.setValueAtTime(freq, startTime)

      gain.gain.setValueAtTime(0.12, startTime)
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(startTime)
      osc.stop(startTime + dur)
    })
  } catch {
    // audio failure recovery
  }
}

/**
 * Low-frequency square wave pulse for mistakes
 */
export function playWrongBuzzer(): void {
  if (isAudioMuted()) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = "sawtooth"
    osc.frequency.setValueAtTime(150, now)
    osc.frequency.linearRampToValueAtTime(100, now + 0.22)

    gain.gain.setValueAtTime(0.15, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.22)
  } catch {
    // audio failure recovery
  }
}

/**
 * Resonant upward frequency sweep on earning a Streak Shield (5-streak)
 */
export function playShieldEarned(): void {
  if (isAudioMuted()) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = "sine"
    osc.frequency.setValueAtTime(320, now)
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.35)

    gain.gain.setValueAtTime(0.18, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.35)
  } catch {
    // audio failure recovery
  }
}

/**
 * Dissipation burst when Streak Shield absorbs a mistake
 */
export function playShieldAbsorbed(): void {
  if (isAudioMuted()) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = "sine"
    osc.frequency.setValueAtTime(600, now)
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.25)

    gain.gain.setValueAtTime(0.15, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.25)
  } catch {
    // audio failure recovery
  }
}

/**
 * Victory fanfare on completing a session
 */
export function playSessionComplete(): void {
  if (isAudioMuted()) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const now = ctx.currentTime
    const chord = [523.25, 659.25, 783.99, 1046.5] // C5 -> E5 -> G5 -> C6

    chord.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const startTime = now + idx * 0.08
      const dur = 0.4

      osc.type = "triangle"
      osc.frequency.setValueAtTime(freq, startTime)

      gain.gain.setValueAtTime(0.12, startTime)
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(startTime)
      osc.stop(startTime + dur)
    })
  } catch {
    // audio failure recovery
  }
}
