import { buildFilterOptions, fetchGames, gameMatchesFilter, type Game } from './games'
import { initPortraitLock } from './orientation'
import './style.css'

let games: Game[] = []

const heroSubtext =
  'Credits loaded. No install. No wait. Hit play and chase the high score.'

const arrowIcon = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6"/>
  </svg>
`

function neonRushVisual(): string {
  return `
    <div class="visual-grid"></div>
    <div class="visual-moon"></div>
    <div class="visual-rocket"><span></span></div>
    <div class="visual-runner"></div>
    <div class="visual-ground"></div>
    <span class="visual-orb orb-one"></span>
    <span class="visual-orb orb-two"></span>
    <span class="visual-block block-one"></span>
    <span class="visual-block block-two"></span>
  `
}

function mindSyncVisual(): string {
  return `
    <div class="visual-aura"></div>
    <div class="visual-puzzle-wrap">
      <div class="visual-puzzle-board">
        <span class="visual-tile ms-t1">1</span>
        <span class="visual-tile ms-t2">2</span>
        <span class="visual-tile ms-t3">3</span>
        <span class="visual-tile ms-t4">4</span>
        <span class="visual-tile ms-t5">5</span>
        <span class="visual-tile ms-t6">6</span>
        <span class="visual-tile ms-t7">7</span>
        <span class="visual-tile ms-t8 ms-slide">8</span>
        <span class="visual-tile ms-empty"></span>
      </div>
    </div>
    <span class="visual-ms-sparkle sparkle-a"></span>
    <span class="visual-ms-sparkle sparkle-b"></span>
    <span class="visual-ms-fox" aria-hidden="true">🦊</span>
  `
}

function proceduralVisual(visual: string): string {
  if (visual === 'neon-rush-visual') return neonRushVisual()
  if (visual === 'mind-sync-visual') return mindSyncVisual()
  return `<div class="visual-aura"></div><div class="visual-scan"></div>`
}

function gameCard(game: Game, index: number): string {
  const playable = game.status === 'live' && game.url
  const filterAttr = game.genre.toLowerCase()

  const inner = `
      <div class="game-visual ${game.visual}" aria-hidden="true">
        ${proceduralVisual(game.visual)}
        <div class="card-number">${String(index + 1).padStart(2, '0')}</div>
      </div>
      <div class="game-content">
        <div class="game-meta">
          <span class="status ${playable ? 'is-live' : ''}">
            <i></i>${playable ? 'Play now' : 'Coming soon'}
          </span>
          <span>${game.genre}</span>
        </div>
        <h3>${game.title}</h3>
        ${
          playable
            ? `<span class="play-button">Launch game ${arrowIcon}</span>`
            : `<span class="play-button is-disabled">In development</span>`
        }
      </div>
  `

  if (playable) {
    return `
    <a
      class="game-card reveal is-playable"
      href="${game.url}"
      target="_blank"
      rel="noopener"
      data-filters="${filterAttr}"
      aria-label="Play ${game.title}"
      style="--accent:${game.accent}; --delay:${index * 90}ms"
    >${inner}</a>
  `
  }

  return `
    <article
      class="game-card reveal"
      data-filters="${filterAttr}"
      style="--accent:${game.accent}; --delay:${index * 90}ms"
    >${inner}</article>
  `
}

function renderGames(filter: string): void {
  const grid = document.querySelector<HTMLDivElement>('#games-grid')
  const empty = document.querySelector<HTMLParagraphElement>('#filter-empty')
  if (!grid || !empty) return

  const active = filter.toLowerCase()
  const filtered =
    active === 'all' ? games : games.filter((game) => gameMatchesFilter(game, filter))

  if (!games.length) {
    grid.innerHTML = `<p class="games-empty">No games in the arcade yet. Check back soon.</p>`
    empty.hidden = true
    return
  }

  grid.innerHTML =
    filtered.map(gameCard).join('') +
    `
    <article class="coming-card reveal" style="--delay:${filtered.length * 90}ms">
      <div class="plus">+</div>
      <h3>Next game loading</h3>
      <p>A new world is already being imagined.</p>
    </article>
  `

  empty.hidden = filtered.length > 0
  empty.textContent =
    filtered.length === 0 ? `No ${filter} games yet. More are coming soon.` : ''

  observeGameCards()
}

function renderFilterBar(filterOptions: string[]): void {
  const bar = document.querySelector<HTMLDivElement>('#filter-bar')
  if (!bar) return

  bar.innerHTML = filterOptions
    .map(
      (option, i) => `
      <button
        type="button"
        class="filter-chip${i === 0 ? ' is-active' : ''}"
        data-filter="${option}"
        role="tab"
        aria-selected="${i === 0 ? 'true' : 'false'}"
      >${option}</button>
    `,
    )
    .join('')
}

function showGamesLoading(): void {
  const grid = document.querySelector<HTMLDivElement>('#games-grid')
  if (grid) {
    grid.innerHTML = `<p class="games-loading" aria-live="polite">Loading games...</p>`
  }
}

function showGamesError(message: string): void {
  const grid = document.querySelector<HTMLDivElement>('#games-grid')
  if (grid) {
    grid.innerHTML = `<p class="games-error" role="alert">${message}</p>`
  }
}

function updateLiveCount(): void {
  const liveEl = document.querySelector<HTMLElement>('.game-count b')
  if (!liveEl) return
  const liveCount = games.filter((game) => game.status === 'live').length
  liveEl.textContent = liveCount.toString().padStart(2, '0')
}

const cardObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        cardObserver.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.16, rootMargin: '0px 0px -5% 0px' },
)

function observeGameCards(): void {
  document.querySelectorAll('.games-grid .reveal').forEach((card, index) => {
    ;(card as HTMLElement).style.setProperty('--delay', `${index * 120}ms`)
    cardObserver.observe(card)
  })
}

function renderLayout(): void {
  document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="scanlines" aria-hidden="true"></div>
  <div class="arcade-bg" aria-hidden="true"></div>

  <header class="site-header">
    <a class="logo" href="#top" aria-label="NextGen Arcade home">
      <span class="logo-mark"><i></i><i></i></span>
      <span>NEXTGEN <b>ARCADE</b></span>
    </a>
    <nav aria-label="Main navigation">
      <a href="#games">Games</a>
      <a href="#about">About</a>
    </nav>
  </header>

  <main id="top">
    <section class="hero">
      <div class="hero-copy">
        <div class="hero-title-stage">
          <h1 class="glitch-title" data-text="YOUR NEXT">YOUR NEXT<br><em>ADVENTURE</em><br>STARTS HERE.</h1>
        </div>
        <div class="hero-delayed" aria-hidden="true">
          <div class="typewriter-line">
            <p id="hero-typewriter" class="typewriter-text" aria-live="polite"></p>
          </div>
          <div class="hero-actions">
            <a class="primary-button arcade-btn" href="#games">▶ PLAY NOW ${arrowIcon}</a>
            <span class="game-count"><b>00</b> LIVE</span>
          </div>
        </div>
      </div>
    </section>

    <section class="games-section" id="games">
      <div class="section-heading scroll-reveal">
        <div>
          <span class="section-index">◢ 01 / GAME FLOOR ◣</span>
          <h2>SELECT YOUR GAME</h2>
        </div>
      </div>

      <div
        class="filter-bar scroll-reveal"
        id="filter-bar"
        role="tablist"
        aria-label="Filter games by type"
      ></div>

      <p id="filter-empty" class="filter-empty" hidden></p>
      <div class="games-grid" id="games-grid"></div>
    </section>

    <section class="about-section scroll-reveal" id="about">
      <div class="about-label">◢ SYSTEM ONLINE ◣</div>
      <div>
        <h2>PIXEL POWER.<br><span>INFINITE PLAY.</span></h2>
        <p>Original browser games built for speed — desktop, tablet, mobile. Tap in and play.</p>
      </div>
      <div class="about-stats">
        <div><strong>100%</strong><span>Browser based</span></div>
        <div><strong>0</strong><span>Downloads needed</span></div>
        <div><strong>∞</strong><span>More to come</span></div>
      </div>
    </section>
  </main>

  <footer>
    <a class="logo" href="#top"><span class="logo-mark"><i></i><i></i></span><span>NEXTGEN <b>ARCADE</b></span></a>
    <p>◢ KEEP PLAYING ◣</p>
    <span>© ${new Date().getFullYear()} NextGen Arcade</span>
  </footer>
`
}

function setupFilters(): void {
  const bar = document.querySelector('#filter-bar')
  if (!bar) return

  renderGames('All')

  bar.addEventListener('click', (event) => {
    const target = event.target
    if (!(target instanceof HTMLButtonElement)) return
    const filter = target.dataset.filter
    if (!filter) return

    bar.querySelectorAll('.filter-chip').forEach((chip) => {
      chip.classList.toggle('is-active', chip === target)
      chip.setAttribute('aria-selected', chip === target ? 'true' : 'false')
    })

    renderGames(filter)
  })
}

function setupCardInteractions(): void {
  const grid = document.querySelector<HTMLElement>('#games-grid')
  if (!grid || !matchMedia('(hover: hover)').matches) return

  let activeCard: HTMLElement | null = null
  grid.addEventListener('pointermove', (event) => {
    const target = event.target
    if (!(target instanceof Element)) return
    const card = target.closest<HTMLElement>('.game-card')
    if (!card) return

    if (activeCard && activeCard !== card) {
      activeCard.style.setProperty('--tilt-x', '0deg')
      activeCard.style.setProperty('--tilt-y', '0deg')
    }
    activeCard = card

    const rect = card.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    card.style.setProperty('--tilt-x', `${(0.5 - y) * 7}deg`)
    card.style.setProperty('--tilt-y', `${(x - 0.5) * 8}deg`)
    card.style.setProperty('--mouse-x', `${x * 100}%`)
    card.style.setProperty('--mouse-y', `${y * 100}%`)
  })

  grid.addEventListener('pointerleave', () => {
    if (!activeCard) return
    activeCard.style.setProperty('--tilt-x', '0deg')
    activeCard.style.setProperty('--tilt-y', '0deg')
    activeCard = null
  })
}

function setupHeroTypewriter(): void {
  const delayed = document.querySelector<HTMLElement>('.hero-delayed')
  const typeEl = document.querySelector<HTMLElement>('#hero-typewriter')
  const actions = document.querySelector<HTMLElement>('.hero-delayed .hero-actions')
  const typeLine = document.querySelector<HTMLElement>('.typewriter-line')
  if (!delayed || !typeEl) return

  if (typeLine) {
    typeLine.style.setProperty('--type-ch', `${heroSubtext.length + 1}ch`)
  }

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

function setupScrollEffects(): void {
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

  const revealTargets = document.querySelectorAll(
    '.section-heading, .filter-bar, .about-section',
  )
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

async function bootstrap(): Promise<void> {
  initPortraitLock()
  renderLayout()
  showGamesLoading()
  setupHeroTypewriter()
  setupScrollEffects()

  try {
    games = await fetchGames()
    updateLiveCount()
    renderFilterBar(buildFilterOptions(games))
    setupFilters()
    setupCardInteractions()
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Could not load games. Please try again later.'
    showGamesError(message)
  }
}

bootstrap()
