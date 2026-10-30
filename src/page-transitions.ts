const EXIT_MS = 420
const ENTER_MS = 480

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

function ensureOverlay(): HTMLElement {
  let overlay = document.querySelector<HTMLElement>('.page-transition-overlay')
  if (!overlay) {
    overlay = document.createElement('div')
    overlay.className = 'page-transition-overlay'
    overlay.setAttribute('aria-hidden', 'true')
    document.body.append(overlay)
  }
  return overlay
}

export function setupPageTransitions(): void {
  const root = document.documentElement
  if (root.dataset.pageTransitions === '1') return
  root.dataset.pageTransitions = '1'

  ensureOverlay()

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
    root.classList.remove('page-entering', 'page-enter-active', 'page-loading')
    root.classList.add('page-ready')
    requestAnimationFrame(scrollToHashTarget)
  }

  const runEnter = (): void => {
    window.scrollTo(0, 0)
    if (reduceMotion) {
      markReady()
      return
    }

    root.classList.remove('page-exiting', 'page-exiting-active', 'page-ready')
    root.classList.add('page-entering', 'page-loading')
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        root.classList.add('page-enter-active')
      })
    })
    window.setTimeout(markReady, ENTER_MS)
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

      root.classList.add('page-exiting')
      requestAnimationFrame(() => {
        root.classList.add('page-exiting-active')
      })

      window.setTimeout(() => {
        location.assign(next.href)
      }, EXIT_MS)
    },
    true,
  )
}
