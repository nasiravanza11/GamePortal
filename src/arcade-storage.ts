export type StoredRecentGame = {
  key: string
  title: string
  url: string
  playedAt: number
}

export type LeaderboardEntry = {
  id: string
  gameKey: string
  gameTitle: string
  player: string
  score: number
  createdAt: number
}

const FAVORITES_KEY = 'rao-arcade-favorites'
const RECENT_KEY = 'rao-arcade-recent'
const LEADERBOARD_KEY = 'rao-arcade-leaderboard'
const RECENT_LIMIT = 12
const LEADERBOARD_LIMIT = 50

export function gameStorageKey(title: string, url: string): string {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return url.trim() || slug || 'game'
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getFavoriteKeys(): string[] {
  const list = readJson<string[]>(FAVORITES_KEY, [])
  return Array.isArray(list) ? list : []
}

export function isFavorite(key: string): boolean {
  return getFavoriteKeys().includes(key)
}

export function toggleFavorite(key: string): boolean {
  const set = new Set(getFavoriteKeys())
  if (set.has(key)) set.delete(key)
  else set.add(key)
  writeJson(FAVORITES_KEY, [...set])
  return set.has(key)
}

export function getRecentGames(): StoredRecentGame[] {
  const list = readJson<StoredRecentGame[]>(RECENT_KEY, [])
  return Array.isArray(list) ? list : []
}

export function pushRecentGame(entry: Omit<StoredRecentGame, 'playedAt'>): void {
  const now = Date.now()
  const next = [
    { ...entry, playedAt: now },
    ...getRecentGames().filter((item) => item.key !== entry.key),
  ].slice(0, RECENT_LIMIT)
  writeJson(RECENT_KEY, next)
}

export function getLeaderboard(): LeaderboardEntry[] {
  const list = readJson<LeaderboardEntry[]>(LEADERBOARD_KEY, [])
  if (!Array.isArray(list)) return []
  return [...list].sort((a, b) => b.score - a.score || a.createdAt - b.createdAt)
}

export function addLeaderboardEntry(
  entry: Omit<LeaderboardEntry, 'id' | 'createdAt'>,
): void {
  const row: LeaderboardEntry = {
    ...entry,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
  }
  const next = [...getLeaderboard(), row]
    .sort((a, b) => b.score - a.score || a.createdAt - b.createdAt)
    .slice(0, LEADERBOARD_LIMIT)
  writeJson(LEADERBOARD_KEY, next)
}
