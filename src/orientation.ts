export function isLandscapeMobile(): boolean {
  const w = window.innerWidth
  const h = window.innerHeight
  if (w <= h) return false
  return Math.min(w, h) <= 1024
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
  updatePortraitLock()
  window.addEventListener('resize', updatePortraitLock)
  window.addEventListener('orientationchange', updatePortraitLock)
  window.visualViewport?.addEventListener('resize', updatePortraitLock)
  document.addEventListener('pointerdown', () => void tryLockPortrait(), { once: true })
}
