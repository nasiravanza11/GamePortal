const SOUND_STORAGE_KEY = 'rao-arcade-sound'
const UI_SOUND_PEAK = 0.48

export type UiSoundVariant = 'tap' | 'open' | 'close'

let audioContext: AudioContext | null = null
let unlockStarted = false
let globalTapStarted = false

function createAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const Ctx = window.AudioContext
    ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctx) return null
  return new Ctx()
}

function getOrCreateAudioContext(): AudioContext | null {
  if (!audioContext) audioContext = createAudioContext()
  return audioContext
}

export function isSoundEnabled(): boolean {
  try {
    return localStorage.getItem(SOUND_STORAGE_KEY) === 'granted'
  } catch {
    return false
  }
}

export function setSoundPreference(value: 'granted' | 'denied'): void {
  try {
    localStorage.setItem(SOUND_STORAGE_KEY, value)
  } catch {
    /* ignore */
  }
}

/** Run on pointerdown before click so autoplay policies allow Web Audio. */
export function primeUiSoundFromGesture(): void {
  const ctx = getOrCreateAudioContext()
  if (!ctx) return

  void ctx.resume()

  const gain = ctx.createGain()
  gain.gain.value = 0
  gain.connect(ctx.destination)

  const osc = ctx.createOscillator()
  osc.connect(gain)
  osc.start()
  osc.stop(ctx.currentTime + 0.001)
}

async function ensureAudioRunning(): Promise<AudioContext | null> {
  const ctx = getOrCreateAudioContext()
  if (!ctx) return null

  if (ctx.state === 'suspended') {
    try {
      await ctx.resume()
    } catch {
      return null
    }
  }

  return ctx.state === 'running' ? ctx : null
}

/** Soft arcade blip + tiny noise transient (global click / touch). */
function playTapClick(ctx: AudioContext): void {
  const start = ctx.currentTime
  const master = ctx.createGain()
  master.connect(ctx.destination)

  const blip = ctx.createOscillator()
  const blipGain = ctx.createGain()
  blip.type = 'sine'
  blip.frequency.setValueAtTime(720, start)
  blip.frequency.exponentialRampToValueAtTime(380, start + 0.042)
  blipGain.gain.setValueAtTime(0.0001, start)
  blipGain.gain.linearRampToValueAtTime(UI_SOUND_PEAK * 0.62, start + 0.005)
  blipGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.068)
  blip.connect(blipGain)
  blipGain.connect(master)

  const bufferFrames = Math.max(1, Math.floor(ctx.sampleRate * 0.022))
  const buffer = ctx.createBuffer(1, bufferFrames, ctx.sampleRate)
  const samples = buffer.getChannelData(0)
  for (let i = 0; i < bufferFrames; i += 1) {
    const decay = 1 - i / bufferFrames
    samples[i] = (Math.random() * 2 - 1) * decay * decay
  }

  const noise = ctx.createBufferSource()
  noise.buffer = buffer
  const filter = ctx.createBiquadFilter()
  filter.type = 'highpass'
  filter.frequency.value = 2200
  filter.Q.value = 0.7
  const noiseGain = ctx.createGain()
  noiseGain.gain.setValueAtTime(0.0001, start)
  noiseGain.gain.linearRampToValueAtTime(UI_SOUND_PEAK * 0.22, start + 0.001)
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.024)
  noise.connect(filter)
  filter.connect(noiseGain)
  noiseGain.connect(master)

  blip.start(start)
  blip.stop(start + 0.072)
  noise.start(start)
  noise.stop(start + 0.026)
}

function playTone(ctx: AudioContext, variant: UiSoundVariant): void {
  if (variant === 'tap') {
    playTapClick(ctx)
    return
  }

  const start = ctx.currentTime
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = variant === 'open' ? 'sine' : 'triangle'
  const f0 = variant === 'open' ? 640 : 480
  const f1 = variant === 'open' ? 960 : 320
  osc.frequency.setValueAtTime(f0, start)
  osc.frequency.exponentialRampToValueAtTime(f1, start + 0.055)

  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(UI_SOUND_PEAK * 0.75, start + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.11)

  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(start)
  osc.stop(start + 0.115)
}

function shouldSkipGlobalTap(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return true
  if (target.closest('[data-no-ui-sound]')) return true
  if (target.closest('[data-sound-consent]:not([hidden])')) return true

  const field = target.closest('input, textarea, select')
  if (!field) return false
  if (field instanceof HTMLInputElement) {
    const type = field.type.toLowerCase()
    if (type === 'button' || type === 'submit' || type === 'reset' || type === 'checkbox' || type === 'radio') {
      return false
    }
    return true
  }
  return true
}

/** Play UI tick (after user has allowed sound in consent). */
export function playUiSound(variant: UiSoundVariant = 'tap'): void {
  if (!isSoundEnabled()) return

  primeUiSoundFromGesture()
  const ctx = getOrCreateAudioContext()
  if (!ctx) return

  if (ctx.state === 'running') {
    playTone(ctx, variant)
    return
  }

  void ensureAudioRunning().then((running) => {
    if (running) playTone(running, variant)
  })
}

/** @deprecated Use playUiSound */
export function playMenuUiSound(variant: 'open' | 'close'): void {
  playUiSound(variant)
}

/** Call from the consent “Allow” button (user gesture). */
export async function enableSoundFromGesture(): Promise<boolean> {
  setSoundPreference('granted')
  primeUiSoundFromGesture()
  const ctx = await ensureAudioRunning()
  if (!ctx) return false
  playTone(ctx, 'open')
  return true
}

/** Resume Web Audio on gestures after consent. */
export function setupUiSoundUnlock(): void {
  if (unlockStarted || typeof document === 'undefined') return
  unlockStarted = true

  const unlock = (): void => {
    if (!isSoundEnabled()) return
    primeUiSoundFromGesture()
  }

  document.addEventListener('pointerdown', unlock, { capture: true, passive: true })
  document.addEventListener('keydown', unlock, { capture: true, passive: true })
}

/** Primary click / touch tick on the whole site when sound is allowed. */
export function setupGlobalUiTapSounds(): void {
  if (globalTapStarted || typeof document === 'undefined') return
  globalTapStarted = true

  document.addEventListener(
    'pointerdown',
    (event) => {
      if (!isSoundEnabled()) return
      if (event.button !== 0) return
      if (shouldSkipGlobalTap(event.target)) return
      playUiSound('tap')
    },
    { capture: true, passive: true },
  )
}

export function initSiteAudio(): void {
  setupUiSoundUnlock()
  setupGlobalUiTapSounds()
}

export function hasSoundPreference(): boolean {
  try {
    const value = localStorage.getItem(SOUND_STORAGE_KEY)
    return value === 'granted' || value === 'denied'
  } catch {
    return false
  }
}
