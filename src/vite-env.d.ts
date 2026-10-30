/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
  readonly NEXT_PUBLIC_SUPABASE_URL?: string
  readonly NEXT_PUBLIC_SUPABASE_ANON_KEY?: string
  readonly VITE_PORTFOLIO_URL?: string
  readonly NEXT_PUBLIC_PORTFOLIO_URL?: string
  readonly VITE_WHATSAPP_URL?: string
  readonly NEXT_PUBLIC_WHATSAPP_URL?: string
  readonly VITE_LINKEDIN_URL?: string
  readonly NEXT_PUBLIC_LINKEDIN_URL?: string
  readonly VITE_UPWORK_URL?: string
  readonly NEXT_PUBLIC_UPWORK_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
