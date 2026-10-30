import { gameStorageKey, pushRecentGame } from './arcade-storage'

let bound = false

function resolveGameUrl(raw: string): string {
  try {
    return new URL(raw, location.href).href
  } catch {
    return raw
  }
}

export function renderGamePlayerShell(): string {
  return `
  <div class="game-player" data-game-player hidden>
    <div class="game-player-backdrop" data-game-player-close tabindex="-1" aria-hidden="true"></div>
    <div
      class="game-player-shell"
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-player-title"
    >
      <header class="game-player-head">
        <div class="game-player-head-copy">
          <p class="game-player-kicker">◢ NOW PLAYING ◣</p>
          <h2 id="game-player-title" class="game-player-title"></h2>
        </div>
        <button type="button" class="game-player-close" data-game-player-close aria-label="Close game">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.4 6.4 17.6 17.6M17.6 6.4 6.4 17.6"/></svg>
        </button>
      </header>
      <div class="game-player-frame-wrap">
        <iframe
          class="game-player-frame"
          title="Game"
          allow="fullscreen; gamepad"
          sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-popups allow-modals allow-downloads"
        ></iframe>
      </div>
    </div>
  </div>`
}

function getPlayer(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-game-player]')
}

function closePlayer(): void {
  const root = getPlayer()
  const frame = root?.querySelector<HTMLIFrameElement>('.game-player-frame')
  if (!root) return

  root.classList.remove('is-visible')
  document.body.classList.remove('game-player-open')

  window.setTimeout(() => {
    root.classList.remove('is-open')
    root.hidden = true
    if (frame) {
      frame.removeAttribute('src')
      frame.title = 'Game'
    }
  }, 320)
}

function openPlayer(url: string, title: string): void {
  const root = getPlayer()
  const titleEl = root?.querySelector<HTMLElement>('#game-player-title')
  const frame = root?.querySelector<HTMLIFrameElement>('.game-player-frame')
  const closeBtn = root?.querySelector<HTMLButtonElement>('.game-player-close')
  if (!root || !titleEl || !frame) return

  titleEl.textContent = title
  frame.title = title
  frame.src = resolveGameUrl(url)

  root.hidden = false
  document.body.classList.add('game-player-open')

  requestAnimationFrame(() => {
    root.classList.add('is-open')
    requestAnimationFrame(() => {
      root.classList.add('is-visible')
      closeBtn?.focus()
    })
  })
}

function cardFromTarget(target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof Element)) return null
  return target.closest<HTMLElement>('.game-card.is-playable[data-game-url]')
}

export function setupGamePlayer(): void {
  if (bound) return
  bound = true

  const grid = document.querySelector<HTMLElement>('#games-grid')
  if (!grid) return

  grid.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('[data-favorite-toggle]')) {
      return
    }

    const card = cardFromTarget(event.target)
    if (!card) return

    const url = card.dataset.gameUrl?.trim()
    const title = card.dataset.gameTitle?.trim() || 'Game'
    if (!url) return

    const key = card.dataset.gameKey?.trim() || gameStorageKey(title, url)
    event.preventDefault()
    event.stopPropagation()
    pushRecentGame({ key, title, url })
    openPlayer(url, title)
  })

  grid.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    const card = cardFromTarget(event.target)
    if (!card) return

    event.preventDefault()
    const url = card.dataset.gameUrl?.trim()
    const title = card.dataset.gameTitle?.trim() || 'Game'
    if (!url) return

    const key = card.dataset.gameKey?.trim() || gameStorageKey(title, url)
    pushRecentGame({ key, title, url })
    openPlayer(url, title)
  })

  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return
    if (!event.target.closest('[data-game-player-close]')) return
    if (!getPlayer()?.classList.contains('is-open')) return
    event.preventDefault()
    closePlayer()
  })

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return
    if (!getPlayer()?.classList.contains('is-open')) return
    closePlayer()
  })
}
