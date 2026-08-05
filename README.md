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

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

`NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` are also accepted.

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

### Git → Cloudflare Workers (important)

`.env` is **not** in git. When Cloudflare builds from your repo, it does **not** see your PC's `.env` file.

Vite embeds Supabase URL/key into `dist/` **during `npm run build`**. You must set the same variables in Cloudflare **build** settings:

1. [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **nextgen-arcade**
2. **Settings** → **Build** (or **Build configuration**)
3. Under **Build environment variables**, add:

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your anon key |

4. **Redeploy** — push a commit or click **Retry deployment**

Without these, the live site keeps an old baked-in URL or fails to load games.

**Verify:** open your live site → DevTools → **Network** → find the request to `...supabase.co/rest/v1/games`. The hostname must match your new project.

## License

See [LICENSE](LICENSE).
