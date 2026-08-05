import { defineConfig, type Plugin } from 'vite'

function requireSupabaseEnv(): Plugin {
  return {
    name: 'require-supabase-env',
    buildStart() {
      const url =
        process.env.VITE_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
      const key =
        process.env.VITE_SUPABASE_ANON_KEY ??
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!url || !key) {
        throw new Error(
          'Missing Supabase env vars at build time. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env (local) or Cloudflare Workers build settings (Git deploy).',
        )
      }
    },
  }
}

export default defineConfig({
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  plugins: [requireSupabaseEnv()],
})
