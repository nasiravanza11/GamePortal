import { arrowIcon, contactInfo } from './site-config'

export function heroSection(): string {
  return `
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
            <span class="game-count">
              <span class="game-count-dot" aria-hidden="true"></span>
              <span class="game-count-value"><b>00</b></span>
              <span class="game-count-label">Live games</span>
            </span>
          </div>
        </div>
      </div>
    </section>`
}

export function gamesSection(options?: {
  showFloorIndex?: boolean
  showLibraryTools?: boolean
}): string {
  const showFloorIndex = options?.showFloorIndex ?? true
  const heading = showFloorIndex
    ? `
      <div class="section-heading scroll-reveal">
        <div>
          <span class="section-index">◢ 01 / GAME FLOOR ◣</span>
        </div>
      </div>`
    : ''

  const filterBar = `
      <div
        class="filter-bar scroll-reveal"
        id="filter-bar"
        role="tablist"
        aria-label="Filter games by type"
      ></div>`

  const showLibraryTools = options?.showLibraryTools ?? false
  const libraryBar = showLibraryTools
    ? `
      <div
        class="games-library-bar"
        id="games-library-bar"
        role="tablist"
        aria-label="Your library"
      >
        <button type="button" class="library-chip" data-library="recent" role="tab" aria-selected="false">
          Recently played
        </button>
        <button type="button" class="library-chip" data-library="favorites" role="tab" aria-selected="false">
          Favorites
        </button>
        <a class="library-chip library-chip-link" href="/contact/#leaderboard">Leaderboard</a>
      </div>`
    : ''

  const filters = showFloorIndex
    ? filterBar
    : `<div class="games-toolbar-sentinel" aria-hidden="true"></div><div class="games-toolbar">${filterBar}${libraryBar}</div>`

  return `
    <section class="games-section page-section${showFloorIndex ? '' : ' games-page-layout'}" id="games">
      ${heading}
      ${filters}
      <p id="filter-empty" class="filter-empty" hidden></p>
      <div class="games-grid" id="games-grid"></div>
    </section>`
}

export function aboutSection(): string {
  return `
    <section class="about-section scroll-reveal page-section" id="about">
      <div class="about-copy">
        <span class="about-kicker">◢ SYSTEM ONLINE ◣</span>
        <h2>Pixel power.<br><span>Infinite play.</span></h2>
        <p>Original browser games built for speed — desktop, tablet, mobile. Tap in and play.</p>
      </div>
      <div class="about-stats-panel" aria-label="Platform highlights">
        <div class="about-stats">
          <div><strong>100%</strong><span>Browser based</span></div>
          <div><strong>0</strong><span>Downloads needed</span></div>
          <div><strong>∞</strong><span>More to come</span></div>
        </div>
      </div>
    </section>`
}

function arcadeHubSection(): string {
  return `
    <section class="arcade-hub scroll-reveal page-section" id="arcade-hub">
      <div class="arcade-hub-grid">
        <div class="leaderboard-panel" id="leaderboard">
          <span class="arcade-hub-kicker">◢ LEADERBOARD ◣</span>
          <h2>Top scores</h2>
          <p class="arcade-hub-lead">Local high scores from this browser. Submit yours after a run.</p>
          <div class="leaderboard-table-wrap">
            <table class="leaderboard-table" aria-label="Arcade leaderboard">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Player</th>
                  <th scope="col">Game</th>
                  <th scope="col">Score</th>
                </tr>
              </thead>
              <tbody id="leaderboard-body"></tbody>
            </table>
          </div>
          <form id="leaderboard-form" class="leaderboard-form" novalidate>
            <h3 class="leaderboard-form-title">Submit a score</h3>
            <div class="leaderboard-form-row">
              <label class="contact-field">
                <span>Player name *</span>
                <input type="text" name="player" autocomplete="nickname" placeholder="Arcade tag" required maxlength="24" />
              </label>
              <label class="contact-field">
                <span>Game *</span>
                <input type="text" name="gameTitle" placeholder="Game title" required maxlength="48" />
              </label>
              <label class="contact-field">
                <span>Score *</span>
                <input type="number" name="score" min="0" step="1" placeholder="0" required />
              </label>
            </div>
            <button type="submit" class="contact-submit">Add score</button>
            <p class="leaderboard-form-status" role="status" aria-live="polite"></p>
          </form>
        </div>
        <div class="feedback-panel" id="feedback">
          <span class="arcade-hub-kicker">◢ FEEDBACK ◣</span>
          <h2>Game feedback</h2>
          <p class="arcade-hub-lead">Bugs, balance, leaderboard issues, or ideas — we read every note.</p>
          <form id="feedback-form" class="feedback-form" novalidate>
            <label class="contact-field">
              <span>Name *</span>
              <input type="text" name="name" autocomplete="name" placeholder="Your name" required />
            </label>
            <label class="contact-field">
              <span>Email *</span>
              <input type="email" name="email" autocomplete="email" placeholder="Your email" required />
            </label>
            <label class="contact-field">
              <span>Topic *</span>
              <select name="topic" required>
                <option value="">Select topic</option>
                <option value="gameplay">Gameplay</option>
                <option value="leaderboard">Leaderboard</option>
                <option value="bug">Bug report</option>
                <option value="idea">New game idea</option>
              </select>
            </label>
            <label class="contact-field contact-field-full">
              <span>Message *</span>
              <textarea name="message" rows="4" placeholder="Tell us what happened" required></textarea>
            </label>
            <button type="submit" class="contact-submit">Send feedback</button>
            <p class="feedback-form-status" role="status" aria-live="polite"></p>
          </form>
        </div>
      </div>
    </section>`
}

export function contactSection(options?: { includeArcadeHub?: boolean }): string {
  const hub = options?.includeArcadeHub ? arcadeHubSection() : ''
  return `
    <section class="contact-section scroll-reveal page-section" id="contact">
      <div class="contact-shell">
        <div class="contact-info">
          <span class="contact-watermark" aria-hidden="true">JOIN US</span>
          <span class="contact-kicker">◢ CONTACT US ◣</span>
          <h2>Contact us and find your <span>Rao Arcade</span></h2>
          <p class="contact-lead">
            Questions, collabs, or custom game work — send a message and we will get back to you.
          </p>
          <div class="contact-info-block">
            <h3 class="contact-info-title">
              <span class="contact-info-icon" aria-hidden="true">◢</span>
              INFORMATION
            </h3>
            <ul class="contact-details">
              <li><a href="${contactInfo.phoneHref}">${contactInfo.phone}</a></li>
              <li><a href="${contactInfo.emailHref}">${contactInfo.email}</a></li>
              <li>${contactInfo.address}</li>
            </ul>
          </div>
        </div>
        <div class="contact-form-panel">
          <div class="contact-form-head">
            <span class="contact-form-dot" aria-hidden="true"></span>
            <span class="contact-form-head-title">Send message</span>
          </div>
          <form id="contact-form" class="contact-form" novalidate>
            <div class="contact-form-row">
              <label class="contact-field">
                <span>Name *</span>
                <input type="text" name="name" autocomplete="name" placeholder="Your name" required />
              </label>
              <label class="contact-field">
                <span>Email *</span>
                <input type="email" name="email" autocomplete="email" placeholder="Your email" required />
              </label>
            </div>
            <label class="contact-field contact-field-full">
              <span>Message *</span>
              <textarea name="message" rows="5" placeholder="Enter your message" required></textarea>
            </label>
            <button type="submit" class="contact-submit">Submit Now</button>
            <p class="contact-form-status" role="status" aria-live="polite"></p>
          </form>
        </div>
      </div>
    </section>
    ${hub}`
}
