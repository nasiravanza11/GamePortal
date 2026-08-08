export type Game = {
  title: string
  description: string
  genre: string
  url: string
  status: 'live' | 'coming-soon'
  accent: string
  visual: string
}

type GameRow = {
  title: string
  description: string | null
  genre: string | null
  url: string | null
  status: string | null
  accent: string | null
  visual: string | null
  sort_order?: number | null
  created_at?: string | null
}

type SupabaseConfig = {
  url: string
  key: string
}

type SupabaseConfigFile = {
  url?: string
  anonKey?: string
}

const FILTER_ORDER = ['Endless', 'Racing', 'Battle', 'Puzzle', 'Arcade']

let cachedConfig: SupabaseConfig | null = null

function envSupabaseConfig(): SupabaseConfig | null {
  const url = import.meta.env.VITE_SUPABASE_URL ?? import.meta.env.NEXT_PUBLIC_SUPABASE_URL
  const key =
    import.meta.env.VITE_SUPABASE_ANON_KEY ?? import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) return null

  return { url: url.replace(/\/$/, ''), key }
}

async function loadSupabaseConfig(): Promise<SupabaseConfig> {
  if (cachedConfig) return cachedConfig

  const fromEnv = envSupabaseConfig()
  if (fromEnv) {
    cachedConfig = fromEnv
    return fromEnv
  }

  const response = await fetch('/supabase.json')
  if (!response.ok) {
    throw new Error(
      'Missing Supabase config. Add public/supabase.json or set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env',
    )
  }

  const data = (await response.json()) as SupabaseConfigFile
  const url = data.url?.trim()
  const key = data.anonKey?.trim()

  if (!url || !key) {
    throw new Error('public/supabase.json must include "url" and "anonKey".')
  }

  cachedConfig = { url: url.replace(/\/$/, ''), key }
  return cachedConfig
}

function parseStatus(value: string | null): Game['status'] {
  const normalized = value?.trim().toLowerCase().replace(/_/g, '-')
  if (normalized === 'live') return 'live'
  return 'coming-soon'
}

function toVisualClass(visual: string | null, title: string): string {
  if (visual?.trim()) return visual.trim()
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return slug ? `${slug}-visual` : 'default-visual'
}

function mapRowToGame(row: GameRow): Game {
  const title = row.title?.trim() || 'Untitled game'

  return {
    title,
    description: row.description?.trim() || '',
    genre: row.genre?.trim() || 'Arcade',
    url: row.url?.trim() || '',
    status: parseStatus(row.status),
    accent: row.accent?.trim() || '#42e8d0',
    visual: toVisualClass(row.visual, title),
  }
}

export function gameMatchesFilter(game: Game, filter: string): boolean {
  if (filter.toLowerCase() === 'all') return true
  const needle = filter.toLowerCase()
  const blob = `${game.genre} ${game.title}`.toLowerCase()
  return blob.includes(needle)
}

export function buildFilterOptions(games: Game[]): string[] {
  const available = new Set<string>()
  games.forEach((game) => {
    FILTER_ORDER.forEach((filter) => {
      if (gameMatchesFilter(game, filter)) available.add(filter)
    })
  })

  const ordered = FILTER_ORDER.filter((filter) => available.has(filter))
  return ['All', ...ordered]
}

export async function fetchGames(): Promise<Game[]> {
  const { url, key } = await loadSupabaseConfig()
  const endpoint = `${url}/rest/v1/games?select=title,description,genre,url,status,accent,visual,sort_order,created_at&order=sort_order.asc.nullslast,created_at.asc`

  const response = await fetch(endpoint, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to load games (${response.status})`)
  }

  const data = (await response.json()) as GameRow[]
  if (!data.length) return []

  return data.map((row) => mapRowToGame(row))
}
