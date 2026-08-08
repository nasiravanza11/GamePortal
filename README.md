# NextGen Arcade

Original browser games you can play instantly — no downloads, no installs.

This repo is the **Game Portal** front end: a Vite + TypeScript site that loads the game catalog from Supabase and deploys as a static SPA on Cloudflare Workers.

## Stack

- [Vite](https://vite.dev/) + TypeScript
- Supabase (REST) for the games catalog
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/) for Cloudflare deploy

## Setup

```bash
npm install
```

Supabase credentials live in `public/supabase.json` (used by Cloudflare Git deploys):

```json
{
  "url": "https://your-project.supabase.co",
  "anonKey": "your-anon-key"
}
```

Optional: override locally with `.env` (`NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`).

### Supabase `games` table

Expected columns (used by the portal):

| Column        | Notes                                      |
|---------------|--------------------------------------------|
| `title`       | Required                                   |
| `description` | Optional                                   |
| `genre`       | e.g. Endless, Racing, Battle, Puzzle, Arcade |
| `url`         | Play URL when `status` is live             |
| `status`      | `live` or `coming-soon`                    |
| `accent`      | CSS color for the card                     |
| `visual`      | Visual class name (e.g. `neon-rush-visual`) |
| `sort_order`  | Optional sort                              |
| `created_at`  | Optional fallback sort                     |

## Scripts

| Command           | Description                          |
|-------------------|--------------------------------------|
| `npm run dev`     | Local dev server                     |
| `npm run build`   | Typecheck + production build → `dist` |
| `npm run preview` | Preview the production build         |
| `npm run deploy`  | Build and deploy with Wrangler       |

## Deploy

Worker name and assets are configured in `wrangler.jsonc` (`nextgen-arcade`, SPA `not_found_handling`).

### Local deploy (uses your `.env`)

```bash
npm run deploy
```

### Git → Cloudflare Workers

Update `public/supabase.json` when you change Supabase projects, commit, and push. No Cloudflare build env vars required.

**Verify:** DevTools → **Network** → request to `...supabase.co/rest/v1/games` should use your project hostname.

## License

See [LICENSE](LICENSE).
