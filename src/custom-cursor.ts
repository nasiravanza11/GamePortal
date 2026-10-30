const CLICKABLE =
  'a, button, summary, label[for], select, [role="button"], input[type="button"], input[type="submit"], input[type="reset"], input[type="checkbox"], input[type="radio"], .menu-trigger, .filter-chip, .play-button, .primary-button, .footer-back-top, .game-card'

const TEXT_FIELD = 'input:not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"]), textarea'

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function setupCustomCursor(): void {
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!finePointer || reducedMotion) return

  const root = document.documentElement
  if (root.dataset.customCursor === '1') return
  root.dataset.customCursor = '1'

  const dot = document.createElement('div')
  dot.className = 'custom-cursor-dot'
  dot.setAttribute('aria-hidden', 'true')

  const ring = document.createElement('div')
  ring.className = 'custom-cursor-ring'
  ring.setAttribute('aria-hidden', 'true')

  document.body.append(dot, ring)
  root.classList.add('custom-cursor-active')

  let targetX = -100
  let targetY = -100
  let dotX = targetX
  let dotY = targetY
  let ringX = targetX
  let ringY = targetY
  let visible = false
  let mode: 'default' | 'pointer' | 'card' = 'default'
  let running = false

  const setMode = (next: typeof mode): void => {
    if (mode === next) return
    mode = next
    dot.dataset.mode = next
  }

  const syncModeFromTarget = (target: EventTarget | null): void => {
    if (!(target instanceof Element)) {
      setMode('default')
      return
    }
    if (target.closest(TEXT_FIELD)) {
      setMode('default')
      return
    }
    const card = target.closest<HTMLElement>('.game-card.is-playable[data-game-url]')
    if (card) {
      setMode('card')
      return
    }
    const clickable = target.closest(CLICKABLE)
    if (
      clickable instanceof HTMLButtonElement ||
      clickable instanceof HTMLInputElement ||
      clickable instanceof HTMLSelectElement
    ) {
      if (clickable.disabled || clickable.getAttribute('aria-disabled') === 'true') {
        setMode('default')
        return
      }
    }
    setMode(clickable ? 'pointer' : 'default')
  }

  const tick = (): void => {
    dotX = lerp(dotX, targetX, 0.14)
    dotY = lerp(dotY, targetY, 0.14)
    ringX = lerp(ringX, targetX, 0.07)
    ringY = lerp(ringY, targetY, 0.07)

    dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`

    if (running) requestAnimationFrame(tick)
  }

  const startLoop = (): void => {
    if (running) return
    running = true
    requestAnimationFrame(tick)
  }

  const show = (): void => {
    if (visible) return
    visible = true
    dot.classList.add('is-visible')
    ring.classList.add('is-visible')
    startLoop()
  }

  const hide = (): void => {
    visible = false
    dot.classList.remove('is-visible')
    ring.classList.remove('is-visible')
  }

  document.addEventListener(
    'pointermove',
    (event) => {
      targetX = event.clientX
      targetY = event.clientY
      show()
      syncModeFromTarget(event.target)
    },
    { passive: true },
  )

  startLoop()

  document.addEventListener(
    'pointerover',
    (event) => {
      syncModeFromTarget(event.target)
    },
    { passive: true },
  )

  document.addEventListener('pointerdown', () => {
    dot.classList.add('is-pressed')
    ring.classList.add('is-pressed')
  })

  document.addEventListener('pointerup', () => {
    dot.classList.remove('is-pressed')
    ring.classList.remove('is-pressed')
  })

  document.addEventListener('mouseleave', hide)

  document.addEventListener(
    'focusin',
    (event) => {
      if (event.target instanceof Element && event.target.matches(TEXT_FIELD)) {
        root.classList.add('custom-cursor-text')
        hide()
      }
    },
    true,
  )

  document.addEventListener(
    'focusout',
    (event) => {
      if (event.target instanceof Element && event.target.matches(TEXT_FIELD)) {
        root.classList.remove('custom-cursor-text')
      }
    },
    true,
  )
}
