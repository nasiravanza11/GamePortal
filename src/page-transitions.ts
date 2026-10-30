const STORAGE_KEY = 'rao-page-exit'
const EXIT_MS = 520
const ENTER_MS = 560

function normalizePath(path: string): string {
  let p = path.replace(/\\/g, '/')
  if (p.endsWith('/index.html')) {
    p = p.slice(0, -'/index.html'.length) || '/'
  }
  if (p.length > 1 && p.endsWith('/')) {
    p = p.slice(0, -1)
  }
  return p || '/'
}

function isInternalPageLink(anchor: HTMLAnchorElement): URL | null {
  if (anchor.target === '_blank' || anchor.hasAttribute('download')) return null
  if (anchor.dataset.noPageTransition !== undefined || anchor.hasAttribute('data-resume-link')) {
    return null
  }

  const href = anchor.getAttribute('href')
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return null
  }

  let next: URL
  try {
    next = new URL(anchor.href, location.href)
  } catch {
    return null
  }

  const current = new URL(location.href)
  if (next.origin !== current.origin) return null

  const samePath = normalizePath(next.pathname) === normalizePath(current.pathname)
  if (samePath && next.hash) return null
  if (samePath && !next.hash) return null

  return next
}

function getOverlay(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.page-transition-overlay')
}

function getApp(): HTMLElement | null {
  return document.querySelector<HTMLElement>('#app')
}

export function setupPageTransitions(): void {
  const root = document.documentElement
  if (root.dataset.pageTransitions === '1') return
  root.dataset.pageTransitions = '1'

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'
  }

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
  let exiting = false

  const scrollToHashTarget = (): void => {
    const hash = location.hash
    if (!hash || hash.length < 2) return
    const target = document.querySelector<HTMLElement>(hash)
    if (!target) return
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
  }

  const markReady = (): void => {
    root.classList.remove(
      'page-entering',
      'page-enter-active',
      'page-loading',
      'page-exiting',
      'page-exiting-active',
    )
    root.classList.add('page-ready')
    sessionStorage.removeItem(STORAGE_KEY)
    requestAnimationFrame(scrollToHashTarget)
  }

  const runEnter = (): void => {
    window.scrollTo(0, 0)
    const overlay = getOverlay()
    const app = getApp()

    if (reduceMotion) {
      overlay?.style.removeProperty('opacity')
      markReady()
      return
    }

    root.classList.remove('page-exiting', 'page-exiting-active', 'page-ready')
    root.classList.add('page-entering', 'page-loading')

    if (overlay) overlay.style.opacity = '1'

    let finished = false
    const finish = (): void => {
      if (finished) return
      finished = true
      markReady()
    }

    const onOpacityDone = (event: TransitionEvent): void => {
      if (event.propertyName !== 'opacity') return
      if (event.target !== app && event.target !== overlay) return
      finish()
    }

    app?.addEventListener('transitionend', onOpacityDone)
    overlay?.addEventListener('transitionend', onOpacityDone)
    window.setTimeout(finish, ENTER_MS + 80)

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        root.classList.add('page-enter-active')
      })
    })
  }

  if (sessionStorage.getItem(STORAGE_KEY) === '1') {
    root.classList.add('page-loading')
  }

  runEnter()

  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return
    exiting = false
    runEnter()
  })

  if (reduceMotion) return

  document.addEventListener(
    'click',
    (event) => {
      if (exiting) {
        event.preventDefault()
        event.stopImmediatePropagation()
        return
      }

      if (!(event.target instanceof Element)) return
      const anchor = event.target.closest<HTMLAnchorElement>('a[href]')
      if (!anchor) return
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return
      }

      const next = isInternalPageLink(anchor)
      if (!next) return

      event.preventDefault()
      event.stopPropagation()
      exiting = true
      document.body.classList.remove('menu-open')

      const app = getApp()
      const overlay = getOverlay()
      root.classList.remove('page-ready')
      root.classList.add('page-exiting')

      let navigated = false
      const navigate = (): void => {
        if (navigated) return
        navigated = true
        sessionStorage.setItem(STORAGE_KEY, '1')
        location.assign(next.href)
      }

      const onExitDone = (transitionEvent: TransitionEvent): void => {
        if (transitionEvent.propertyName !== 'opacity') return
        if (transitionEvent.target !== app && transitionEvent.target !== overlay) return
        navigate()
      }

      app?.addEventListener('transitionend', onExitDone, { once: true })
      overlay?.addEventListener('transitionend', onExitDone, { once: true })
      window.setTimeout(navigate, EXIT_MS + 80)

      requestAnimationFrame(() => {
        root.classList.add('page-exiting-active')
        if (overlay) overlay.style.opacity = '1'
      })
    },
    true,
  )
}
