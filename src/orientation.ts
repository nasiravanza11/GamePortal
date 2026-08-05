const LANDSCAPE_MOBILE_QUERY =
  '(orientation: landscape) and (max-height: 900px) and (hover: none) and (pointer: coarse)'

export function isLandscapeMobile(): boolean {
  return window.matchMedia(LANDSCAPE_MOBILE_QUERY).matches
}

export function updatePortraitLock(): void {
  const overlay = document.getElementById('portrait-lock')
  const app = document.getElementById('app')
  const locked = isLandscapeMobile()

  overlay?.classList.toggle('hidden', !locked)
  document.body.classList.toggle('is-landscape-locked', locked)
  if (app) app.inert = locked
}

export async function tryLockPortrait(): Promise<void> {
  try {
    await screen.orientation?.lock?.('portrait')
  } catch {
    /* PWA / fullscreen / supported mobile only */
  }
}

export function initPortraitLock(): void {
  const mq = window.matchMedia(LANDSCAPE_MOBILE_QUERY)

  updatePortraitLock()
  mq.addEventListener('change', updatePortraitLock)
  window.addEventListener('orientationchange', updatePortraitLock)
  document.addEventListener('pointerdown', () => void tryLockPortrait(), { once: true })
}
