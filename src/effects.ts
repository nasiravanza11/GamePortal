import { setupCustomCursor } from './custom-cursor'
import type { SitePage } from './layout'
import { heroSubtext, resumeFileName, resumePdfUrl } from './site-config'
import {
  enableSoundFromGesture,
  hasSoundPreference,
  initSiteAudio,
  isSoundEnabled,
  setSoundPreference,
} from './ui-sounds'

const REVEAL_BY_PAGE: Record<SitePage, string> = {
  home: '.section-heading, .filter-bar, .about-section, .contact-section',
  games: '.games-toolbar, #filter-bar',
  about: '.about-section',
  contact: '.contact-section, .arcade-hub',
}

export function setupGamesToolbarGlass(): void {
  const toolbar = document.querySelector<HTMLElement>('.games-toolbar')
  const sentinel = document.querySelector<HTMLElement>('.games-toolbar-sentinel')
  if (!toolbar || !sentinel) return

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry) return
      toolbar.classList.toggle('is-glass', !entry.isIntersecting)
    },
    { threshold: 0 },
  )
  observer.observe(sentinel)
}

export function setupContactForm(): void {
  const form = document.querySelector<HTMLFormElement>('#contact-form')
  if (!form) return

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    const status = form.querySelector<HTMLElement>('.contact-form-status')
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }
    if (status) {
      status.textContent = 'Message sent — we will reply soon.'
    }
    form.reset()
  })
}

function bindNewsletterForm(
  form: HTMLFormElement | null,
  inputId: string,
  statusSelector: string,
): void {
  form?.addEventListener('submit', (event) => {
    event.preventDefault()
    const input = form.querySelector<HTMLInputElement>(`#${inputId}`)
    const status = form.parentElement?.querySelector<HTMLElement>(statusSelector)
      ?? form.querySelector<HTMLElement>(statusSelector)
    if (!input?.checkValidity()) {
      input?.reportValidity()
      return
    }
    if (status) {
      status.textContent = 'Thanks — you are on the list.'
    }
    form.reset()
  })
}

export function setupSoundConsent(): void {
  const dialog = document.querySelector<HTMLElement>('[data-sound-consent]')
  const allowBtn = document.querySelector<HTMLButtonElement>('.sound-consent-allow')
  const dismissBtn = document.querySelector<HTMLButtonElement>('.sound-consent-dismiss')
  if (!dialog || !allowBtn || !dismissBtn) return

  if (hasSoundPreference()) {
    if (isSoundEnabled()) initSiteAudio()
    return
  }

  dialog.hidden = false

  allowBtn.addEventListener('click', () => {
    void enableSoundFromGesture().then(() => {
      initSiteAudio()
    })
    dialog.hidden = true
  })

  dismissBtn.addEventListener('click', () => {
    setSoundPreference('denied')
    dialog.hidden = true
  })
}

function syncSiteHeaderOffset(header: HTMLElement): void {
  const hidden = header.classList.contains('is-nav-hidden')
  const height = header.getBoundingClientRect().height
  document.documentElement.style.setProperty(
    '--site-header-offset',
    hidden ? '0px' : `${Math.round(height)}px`,
  )
}

export function setupSiteHeaderScroll(): void {
  const header = document.querySelector<HTMLElement>('.site-header')
  if (!header) return
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    syncSiteHeaderOffset(header)
    return
  }

  let lastY = window.scrollY
  let ticking = false
  const revealAt = 48
  const deltaMin = 8

  const shouldPinHeader = (): boolean =>
    document.body.classList.contains('menu-open') ||
    document.body.classList.contains('game-player-open')

  const update = (): void => {
    ticking = false
    const y = window.scrollY

    if (shouldPinHeader()) {
      header.classList.remove('is-nav-hidden')
      syncSiteHeaderOffset(header)
      lastY = y
      return
    }

    if (y <= revealAt) {
      header.classList.remove('is-nav-hidden')
    } else if (y > lastY + deltaMin) {
      header.classList.add('is-nav-hidden')
    } else if (y < lastY - deltaMin) {
      header.classList.remove('is-nav-hidden')
    }

    syncSiteHeaderOffset(header)
    lastY = y
  }

  const onScroll = (): void => {
    if (!ticking) {
      ticking = true
      requestAnimationFrame(update)
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', () => syncSiteHeaderOffset(header), { passive: true })
  syncSiteHeaderOffset(header)
  update()
}

export function setupSiteMenu(): void {
  setupCustomCursor()
  setupSoundConsent()
  setupSiteHeaderScroll()

  const trigger = document.querySelector<HTMLButtonElement>('.menu-trigger')
  const panel = document.querySelector<HTMLElement>('#site-menu-panel')
  const backdrop = document.querySelector<HTMLElement>('[data-site-menu-backdrop]')
  const closeBtn = document.querySelector<HTMLButtonElement>('.menu-panel-close')
  if (!trigger || !panel || !backdrop) return

  let closeTimer: ReturnType<typeof setTimeout> | undefined

  const finishClose = (): void => {
    panel.hidden = true
    backdrop.hidden = true
  }

  const close = (): void => {
    backdrop.classList.remove('is-open')
    panel.classList.remove('is-open')
    trigger.setAttribute('aria-expanded', 'false')
    panel.setAttribute('aria-hidden', 'true')
    document.body.classList.remove('menu-open')
    clearTimeout(closeTimer)
    closeTimer = setTimeout(finishClose, 450)
  }

  const open = (): void => {
    clearTimeout(closeTimer)
    backdrop.hidden = false
    panel.hidden = false
    requestAnimationFrame(() => {
      backdrop.classList.add('is-open')
      panel.classList.add('is-open')
    })
    trigger.setAttribute('aria-expanded', 'true')
    panel.setAttribute('aria-hidden', 'false')
    document.body.classList.add('menu-open')
    const header = document.querySelector<HTMLElement>('.site-header')
    if (header) {
      header.classList.remove('is-nav-hidden')
      syncSiteHeaderOffset(header)
    }
  }

  trigger.addEventListener('click', () => {
    const isOpen = panel.classList.contains('is-open')
    if (isOpen) close()
    else open()
  })

  closeBtn?.addEventListener('click', (event) => {
    event.stopPropagation()
    close()
  })
  backdrop.addEventListener('click', close)

  panel.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((link) => {
    link.addEventListener('click', () => {
      if (panel.classList.contains('is-open')) close()
    })
  })

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && panel.classList.contains('is-open')) close()
  })

  const menuForm = document.querySelector<HTMLFormElement>('#menu-newsletter')
  bindNewsletterForm(menuForm, 'menu-email', '.menu-panel-subscribe-status')
}

export function setupFooter(): void {
  document.querySelector<HTMLButtonElement>('.footer-back-top')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })

  document.querySelector<HTMLAnchorElement>('[data-back-top]')?.addEventListener('click', (event) => {
    event.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })

  bindNewsletterForm(
    document.querySelector<HTMLFormElement>('#footer-newsletter'),
    'footer-email',
    '.footer-newsletter-status',
  )
}

export function setupResumeLink(): void {
  const link = document.querySelector<HTMLAnchorElement>('[data-resume-link]')
  if (!link || !resumePdfUrl) return

  link.addEventListener('click', (event) => {
    if (event.button !== 0) return
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

    event.preventDefault()
    window.open(resumePdfUrl, '_blank', 'noopener,noreferrer')

    const downloadLink = document.createElement('a')
    downloadLink.href = resumePdfUrl
    downloadLink.download = resumeFileName
    downloadLink.rel = 'noopener'
    downloadLink.hidden = true
    document.body.appendChild(downloadLink)
    downloadLink.click()
    downloadLink.remove()
  })
}

export function setupHeroTypewriter(): void {
  const delayed = document.querySelector<HTMLElement>('.hero-delayed')
  const typeEl = document.querySelector<HTMLElement>('#hero-typewriter')
  const actions = document.querySelector<HTMLElement>('.hero-delayed .hero-actions')
  if (!delayed || !typeEl) return

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
  const startDelayMs = reduceMotion ? 0 : 2000
  const charDelayMs = 36

  const revealActions = (): void => {
    if (!actions) return
    const actionDelayMs = reduceMotion ? 0 : 150
    setTimeout(() => actions.classList.add('is-visible'), actionDelayMs)
  }

  const startTyping = (): void => {
    delayed.classList.add('is-visible')
    delayed.removeAttribute('aria-hidden')

    if (reduceMotion) {
      typeEl.textContent = heroSubtext
      revealActions()
      return
    }

    typeEl.classList.add('is-typing')
    let index = 0

    const typeNext = (): void => {
      if (index < heroSubtext.length) {
        typeEl.textContent = heroSubtext.slice(0, index + 1)
        index += 1
        setTimeout(typeNext, charDelayMs)
        return
      }

      typeEl.classList.remove('is-typing')
      typeEl.classList.add('is-done')
      revealActions()
    }

    typeNext()
  }

  setTimeout(startTyping, startDelayMs)
}

export function setupScrollEffects(page: SitePage): void {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
  const heroCopy = document.querySelector<HTMLElement>('.hero-copy')
  const arcadeBg = document.querySelector<HTMLElement>('.arcade-bg')

  function updateScrollEffects(): void {
    const limit = Math.max(1, document.documentElement.scrollHeight - innerHeight)
    const scroll = Math.min(1, Math.max(0, scrollY / limit))

    if (arcadeBg) {
      const bgFade = 1 - Math.min(1, Math.max(0, scroll - 0.35) / 0.55)
      arcadeBg.style.opacity = String(bgFade)
    }

    if (!reduceMotion && heroCopy) {
      const heroProgress = Math.min(1, scrollY / Math.max(1, innerHeight))
      heroCopy.style.transform = `translate3d(0, ${heroProgress * 55}px, 0)`
      heroCopy.style.opacity = String(1 - heroProgress * 0.65)
    }
  }

  window.addEventListener('scroll', updateScrollEffects, { passive: true })

  const selector = REVEAL_BY_PAGE[page]
  const revealTargets = document.querySelectorAll(selector)
  revealTargets.forEach((element) => element.classList.add('scroll-reveal'))

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('has-entered')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.14, rootMargin: '0px 0px -8% 0px' },
  )
  revealTargets.forEach((element) => observer.observe(element))
  updateScrollEffects()
}
