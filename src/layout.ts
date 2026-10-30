import {
  contactInfo,
  portfolioLinkAttrs,
  resumePdfUrl,
} from './site-config'
import { renderGamePlayerShell } from './game-player'
import { setupPageTransitions } from './page-transitions'
import { renderSocialLinks } from './social-links'

export type SitePage = 'home' | 'games' | 'about' | 'contact'

const NAV_ITEMS: { page: SitePage; label: string; href: string }[] = [
  { page: 'games', label: 'Games', href: '/games/' },
  { page: 'about', label: 'About', href: '/about/' },
  { page: 'contact', label: 'Contact', href: '/contact/' },
]

function navLink(item: { page: SitePage; label: string; href: string }, current: SitePage): string {
  const currentAttr = item.page === current ? ' aria-current="page"' : ''
  return `<a href="${item.href}"${currentAttr}>${item.label}</a>`
}

function renderHeader(current: SitePage): string {
  const resumeLink = resumePdfUrl
    ? `<a href="${resumePdfUrl}" target="_blank" rel="noopener noreferrer" data-resume-link>Resume</a>`
    : ''

  return `
  <header class="site-header">
    <a class="logo" href="/" aria-label="Rao Arcade home">
      <span class="logo-mark"><i></i><i></i></span>
      <span>RAO <b>ARCADE</b></span>
    </a>
    <div class="site-header-end">
      <nav aria-label="Main navigation">
        ${NAV_ITEMS.map((item) => navLink(item, current)).join('\n      ')}
        ${resumeLink}
        <a ${portfolioLinkAttrs}>Portfolio</a>
      </nav>
      <button
        type="button"
        class="menu-trigger"
        aria-label="Open menu"
        aria-expanded="false"
        aria-controls="site-menu-panel"
      >
        <span class="menu-trigger-icon" aria-hidden="true">
          <span class="menu-bar menu-bar-1"></span>
          <span class="menu-bar menu-bar-2"></span>
          <span class="menu-bar menu-bar-3"></span>
          <span class="menu-trigger-dot"></span>
        </span>
      </button>
    </div>
  </header>`
}

function menuSectionMark(): string {
  return `
          <div class="menu-panel-section-mark" aria-hidden="true">
            <span class="menu-panel-section-mark-gem"></span>
            <span class="menu-panel-section-mark-line"></span>
          </div>`
}

function renderSiteMenu(): string {
  return `
  <div class="site-menu-backdrop" data-site-menu-backdrop hidden></div>
  <aside
    id="site-menu-panel"
    class="site-menu-panel"
    aria-label="Site menu"
    aria-hidden="true"
    hidden
  >
    <div class="menu-panel-head">
      <a class="logo menu-panel-logo" href="/" aria-label="Rao Arcade home">
        <span class="logo-mark"><i></i><i></i></span>
        <span>RAO <b>ARCADE</b></span>
      </a>
      <button type="button" class="menu-panel-close" aria-label="Close menu">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.4 6.4 17.6 17.6M17.6 6.4 6.4 17.6"/></svg>
      </button>
    </div>
    <div class="menu-panel-body-wrap">
      <div class="menu-panel-body">
      <div class="menu-panel-stack menu-panel-stack--grow">
        <div class="menu-panel-promo">
          <p class="menu-panel-promo-line">New drops this month</p>
          <p class="menu-panel-promo-line">
            Play ideas for <span class="menu-panel-promo-accent">Rao Arcade</span>
          </p>
          ${menuSectionMark()}
        </div>
        <section class="menu-panel-contact-block" aria-labelledby="menu-contact-heading">
          <h2 id="menu-contact-heading" class="menu-panel-heading menu-panel-heading-primary">Contact us</h2>
          <ul class="menu-panel-contact">
            <li><a href="${contactInfo.phoneHref}">${contactInfo.phone}</a></li>
            <li><a href="${contactInfo.emailHref}">${contactInfo.email}</a></li>
            <li>${contactInfo.address}</li>
          </ul>
          ${menuSectionMark()}
        </section>
      </div>
      <div class="menu-panel-stack">
        <section class="menu-panel-subscribe-block" aria-labelledby="menu-subscribe-heading">
          <h2 id="menu-subscribe-heading" class="menu-panel-heading menu-panel-heading-accent">Subscribe</h2>
          <form id="menu-newsletter" class="menu-panel-subscribe" novalidate>
            <label class="visually-hidden" for="menu-email">Email address</label>
            <input id="menu-email" type="email" name="email" placeholder="Get news &amp; updates" autocomplete="email" required />
            <button type="submit" aria-label="Subscribe">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.4 20.6 21 12 3.4 3.4l1.8 7.2L16 12l-10.8 1.4 1.8 7.2Z"/></svg>
            </button>
          </form>
          <p class="menu-panel-subscribe-status" role="status" aria-live="polite"></p>
        </section>
        <p class="menu-panel-note">
          Original browser games — desktop, tablet, and phone. No install required.
        </p>
      </div>
      </div>
    </div>
    <footer class="menu-panel-foot">
      ${renderSocialLinks('menu-panel-social')}
      <div class="menu-panel-foot-line" aria-hidden="true"></div>
      <nav class="menu-panel-links" aria-label="Quick links">
        <a href="/games/">Games</a>
        <a href="/about/">About</a>
        <a href="/contact/">Contact</a>
      </nav>
    </footer>
  </aside>`
}

function renderFooter(_current: SitePage): string {
  return `
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-grid">
        <div class="footer-brand">
          <a class="logo footer-logo" href="/" aria-label="Rao Arcade home">
            <span class="logo-mark"><i></i><i></i></span>
            <span>RAO <b>ARCADE</b></span>
          </a>
          <p class="footer-tagline">
            Original browser games built for speed — play on desktop, tablet, or phone with no install.
          </p>
          <p class="footer-cta">STAY IN THE LOOP <span aria-hidden="true">▶▶</span></p>
          ${renderSocialLinks('footer-social')}
        </div>
        <div class="footer-col">
          <h3 class="footer-heading">Quick Link</h3>
          <ul class="footer-links">
            <li><a href="/games/">Game Floor</a></li>
            <li><a href="/about/">About</a></li>
            <li><a href="/contact/">Contact</a></li>
            ${resumePdfUrl ? `<li><a href="${resumePdfUrl}" target="_blank" rel="noopener noreferrer">Resume</a></li>` : ''}
            <li><a ${portfolioLinkAttrs}>Portfolio</a></li>
            <li><a href="#" data-back-top>Back to Top</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h3 class="footer-heading">Supports</h3>
          <ul class="footer-links">
            <li><a href="/games/">Play in Browser</a></li>
            <li><a href="/about/">Help &amp; Info</a></li>
            <li><a href="/games/">Live Games</a></li>
            <li><a href="/about/">Mobile Ready</a></li>
            <li><a href="/contact/">Contact</a></li>
          </ul>
        </div>
        <div class="footer-col footer-newsletter">
          <h3 class="footer-heading">Newsletter</h3>
          <p class="footer-newsletter-copy">
            Subscribe for new game drops, updates, and arcade news straight to your inbox.
          </p>
          <form id="footer-newsletter" class="footer-newsletter-form" novalidate>
            <label class="visually-hidden" for="footer-email">Email address</label>
            <input id="footer-email" type="email" name="email" placeholder="Your email address" autocomplete="email" required />
            <button type="submit" aria-label="Subscribe to newsletter">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.4 20.6 21 12 3.4 3.4l1.8 7.2L16 12l-10.8 1.4 1.8 7.2Z"/></svg>
            </button>
          </form>
          <p class="footer-newsletter-status" role="status" aria-live="polite"></p>
        </div>
      </div>
      <div class="footer-bottom">
        <p class="footer-copy">
          Copyright © ${new Date().getFullYear()} — All rights reserved by <strong>Rao Arcade</strong>
        </p>
        <ul class="footer-badges" aria-label="Platform support">
          <li>Web</li>
          <li>Mobile</li>
          <li>Tablet</li>
          <li>Instant Play</li>
        </ul>
      </div>
    </div>
    <button type="button" class="footer-back-top" aria-label="Back to top">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5.5 6 11.5l1.4 1.4 3.6-3.6V18h2V9.3l3.6 3.6 1.4-1.4-6-6Z"/></svg>
    </button>
  </footer>`
}

export function mountPage(current: SitePage, mainHtml: string): void {
  const root = document.querySelector<HTMLDivElement>('#app')
  if (!root) return

  root.innerHTML = `
  <div class="scanlines" aria-hidden="true"></div>
  <div class="arcade-bg" aria-hidden="true"></div>
  ${renderHeader(current)}
  <main id="top">${mainHtml}</main>
  ${renderFooter(current)}
  ${renderSiteMenu()}
  ${renderSoundConsent()}
  ${renderGamePlayerShell()}`

  setupPageTransitions()
}

function renderSoundConsent(): string {
  return `
  <div
    class="sound-consent"
    data-sound-consent
    role="dialog"
    aria-modal="true"
    aria-labelledby="sound-consent-title"
    hidden
  >
    <div class="sound-consent-card">
      <p id="sound-consent-title" class="sound-consent-title">Enable arcade sounds?</p>
      <p class="sound-consent-copy">
        Allow audio for menu clicks and UI feedback. You can change this anytime in your browser.
      </p>
      <div class="sound-consent-actions">
        <button type="button" class="sound-consent-allow">Allow sound</button>
        <button type="button" class="sound-consent-dismiss">Not now</button>
      </div>
    </div>
  </div>`
}
