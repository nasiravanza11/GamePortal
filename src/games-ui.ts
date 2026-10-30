import {
  buildFilterOptions,
  displayGenreLabel,
  fetchGames,
  gameMatchesFilter,
  type Game,
} from './games'
import { arrowIcon } from './site-config'

let games: Game[] = []

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

function picturePuzzleVisual(): string {
  const tiles = Array.from({ length: 16 }, (_, i) => {
    const col = i % 4
    const row = Math.floor(i / 4)
    if (i === 10) return `<span class="pp-tile pp-empty" style="--c:${col};--r:${row}"></span>`
    const slide = i === 9 ? ' pp-slide' : ''
    return `<span class="pp-tile${slide}" style="--c:${col};--r:${row}"></span>`
  }).join('')

  return `
    <div class="visual-aura"></div>
    <div class="visual-pp-stage" aria-hidden="true">
      <div class="visual-pp-brand"><i></i><b>SnapTiles</b></div>
      <div class="visual-pp-stats">
        <span class="pp-stat pp-ocean">Ocean</span>
        <span class="pp-stat">0:00</span>
        <span class="pp-stat">0</span>
        <span class="pp-stat pp-hint">3</span>
      </div>
      <div class="visual-pp-board">${tiles}</div>
      <div class="visual-pp-dock">
        <span class="pp-btn pp-y"></span>
        <span class="pp-btn pp-o"></span>
        <span class="pp-btn pp-b"></span>
        <span class="pp-btn pp-p"></span>
        <span class="pp-btn pp-g"></span>
      </div>
    </div>
  `
}

function proceduralVisual(visual: string): string {
  if (visual === 'neon-rush-visual') return neonRushVisual()
  if (visual === 'mind-sync-visual') return mindSyncVisual()
  if (visual === 'picture-puzzle-visual') return picturePuzzleVisual()
  return `<div class="visual-aura"></div><div class="visual-scan"></div>`
}

function gameCard(game: Game, index: number): string {
  const playable = game.status === 'live' && game.url
  const filterAttr = game.genre.toLowerCase()

  const comingSoonOverlay = playable
    ? ''
    : `
        <div class="coming-soon-overlay">
          <span class="coming-soon-badge">Coming soon</span>
        </div>`

  const inner = `
      <div class="game-visual ${game.visual}" aria-hidden="true">
        ${proceduralVisual(game.visual)}
        <div class="card-number">${String(index + 1).padStart(2, '0')}</div>
        ${comingSoonOverlay}
      </div>
      <div class="game-content">
        <div class="game-meta">
          <h3 class="game-title">${game.title}</h3>
          <span class="game-category">${displayGenreLabel(game.genre)}</span>
        </div>
        ${
          playable
            ? `<span class="play-button">▶ Play ${arrowIcon}</span>`
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
      style="--accent:${game.accent}"
    >${inner}</a>
  `
  }

  return `
    <article
      class="game-card reveal is-coming-soon"
      data-filters="${filterAttr}"
      aria-label="${game.title}, coming soon"
      style="--accent:${game.accent}"
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
    <article class="coming-card reveal">
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

export function showGamesLoading(): void {
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

export function updateLiveCount(): void {
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
  { threshold: 0.06, rootMargin: '0px 0px 14% 0px' },
)

function revealStaggerDelay(index: number): number {
  const column = index % 4
  const row = Math.floor(index / 4)
  return Math.min(column * 42 + row * 36, 220)
}

function bindRevealComplete(card: HTMLElement): void {
  card.addEventListener(
    'animationend',
    (event) => {
      if (event.target !== card) return
      if (event.animationName !== 'game-card-reveal' && event.animationName !== 'reveal-rise') {
        return
      }
      card.classList.add('has-revealed')
    },
    { once: true },
  )
}

function observeGameCards(): void {
  document.querySelectorAll('.games-grid .reveal').forEach((card, index) => {
    const el = card as HTMLElement
    el.classList.remove('has-revealed', 'is-visible')
    el.style.setProperty('--delay', `${revealStaggerDelay(index)}ms`)
    bindRevealComplete(el)
    cardObserver.observe(el)
  })
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
  let frame = 0
  let targetX = 0.5
  let targetY = 0.5
  let smoothX = 0.5
  let smoothY = 0.5
  let settling = false

  const applyTiltTo = (card: HTMLElement, x: number, y: number): void => {
    card.style.setProperty('--tilt-x', `${(0.5 - y) * 6}deg`)
    card.style.setProperty('--tilt-y', `${(x - 0.5) * 7}deg`)
    card.style.setProperty('--mouse-x', `${x * 100}%`)
    card.style.setProperty('--mouse-y', `${y * 100}%`)
  }

  const tickTilt = (): void => {
    frame = 0
    const card = activeCard
    if (!card) {
      settling = false
      return
    }

    smoothX += (targetX - smoothX) * 0.08
    smoothY += (targetY - smoothY) * 0.08
    applyTiltTo(card, smoothX, smoothY)

    const dx = Math.abs(targetX - smoothX)
    const dy = Math.abs(targetY - smoothY)
    const done = settling && dx < 0.002 && dy < 0.002

    if (done) {
      resetCard(card)
      activeCard = null
      settling = false
      return
    }

    frame = requestAnimationFrame(tickTilt)
  }

  const ensureTiltLoop = (): void => {
    if (!frame) frame = requestAnimationFrame(tickTilt)
  }

  const resetCard = (card: HTMLElement): void => {
    card.classList.remove('is-hovered')
    card.style.removeProperty('--tilt-x')
    card.style.removeProperty('--tilt-y')
    card.style.removeProperty('--mouse-x')
    card.style.removeProperty('--mouse-y')
  }

  const playableCardFromEvent = (event: PointerEvent): HTMLElement | null => {
    const target = event.target
    if (!(target instanceof Element)) return null
    return target.closest<HTMLElement>('.game-card.is-playable')
  }

  grid.addEventListener(
    'pointerover',
    (event) => {
      const card = playableCardFromEvent(event)
      if (!card) return
      const related = event.relatedTarget
      if (related instanceof Node && card.contains(related)) return

      if (activeCard && activeCard !== card) resetCard(activeCard)
      settling = false
      activeCard = card
      card.classList.add('is-hovered')
      targetX = 0.5
      targetY = 0.5
      smoothX = 0.5
      smoothY = 0.5
      applyTiltTo(card, smoothX, smoothY)
      ensureTiltLoop()
    },
    { passive: true },
  )

  grid.addEventListener(
    'pointerout',
    (event) => {
      const target = event.target
      if (!(target instanceof Element)) return
      const leftCard = target.closest<HTMLElement>('.game-card.is-playable')
      if (!leftCard) return
      const related = event.relatedTarget
      if (related instanceof Node && leftCard.contains(related)) return

      leftCard.classList.remove('is-hovered')
      if (activeCard !== leftCard) return
      targetX = 0.5
      targetY = 0.5
      settling = true
      ensureTiltLoop()
    },
    { passive: true },
  )

  grid.addEventListener(
    'pointermove',
    (event) => {
      if (!activeCard) return
      const rect = activeCard.getBoundingClientRect()
      targetX = (event.clientX - rect.left) / rect.width
      targetY = (event.clientY - rect.top) / rect.height
      settling = false
      ensureTiltLoop()
    },
    { passive: true },
  )

  grid.addEventListener(
    'pointerleave',
    () => {
      if (!activeCard) return
      activeCard.classList.remove('is-hovered')
      targetX = 0.5
      targetY = 0.5
      settling = true
      ensureTiltLoop()
    },
    { passive: true },
  )
}

export async function initGamesPage(): Promise<void> {
  showGamesLoading()

  try {
    games = await fetchGames()
    renderFilterBar(buildFilterOptions(games))
    setupFilters()
    setupCardInteractions()
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Could not load games. Please try again later.'
    showGamesError(message)
  }
}

export async function loadGamesForLiveCount(): Promise<void> {
  try {
    games = await fetchGames()
    updateLiveCount()
  } catch {
    /* home hero can keep 00 */
  }
}
