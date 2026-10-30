import { addLeaderboardEntry, getLeaderboard, type LeaderboardEntry } from './arcade-storage'

function formatScore(score: number): string {
  return score.toLocaleString()
}

function renderLeaderboardRows(entries: LeaderboardEntry[]): string {
  if (!entries.length) {
    return `<tr><td colspan="4" class="leaderboard-empty">No scores yet.</td></tr>`
  }

  return entries
    .slice(0, 15)
    .map(
      (row, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${row.player}</td>
        <td>${row.gameTitle}</td>
        <td>${formatScore(row.score)}</td>
      </tr>`,
    )
    .join('')
}

export function refreshLeaderboardTable(): void {
  const body = document.querySelector<HTMLTableSectionElement>('#leaderboard-body')
  if (!body) return
  body.innerHTML = renderLeaderboardRows(getLeaderboard())
}

export function setupContactHub(): void {
  refreshLeaderboardTable()

  const scoreForm = document.querySelector<HTMLFormElement>('#leaderboard-form')
  scoreForm?.addEventListener('submit', (event) => {
    event.preventDefault()
    const status = scoreForm.querySelector<HTMLElement>('.leaderboard-form-status')
    const data = new FormData(scoreForm)
    const player = String(data.get('player') ?? '').trim()
    const gameTitle = String(data.get('gameTitle') ?? '').trim()
    const scoreRaw = String(data.get('score') ?? '').trim()
    const score = Number.parseInt(scoreRaw.replace(/,/g, ''), 10)

    if (!player || !gameTitle || !Number.isFinite(score) || score < 0) {
      scoreForm.reportValidity()
      return
    }

    addLeaderboardEntry({
      gameKey: gameTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      gameTitle,
      player,
      score,
    })

    refreshLeaderboardTable()
    if (status) status.textContent = 'Score saved.'
    scoreForm.reset()
  })

  const feedbackForm = document.querySelector<HTMLFormElement>('#feedback-form')
  feedbackForm?.addEventListener('submit', (event) => {
    event.preventDefault()
    const status = feedbackForm.querySelector<HTMLElement>('.feedback-form-status')
    if (!feedbackForm.checkValidity()) {
      feedbackForm.reportValidity()
      return
    }
    if (status) {
      status.textContent = 'Thanks for your feedback.'
    }
    feedbackForm.reset()
  })
}
