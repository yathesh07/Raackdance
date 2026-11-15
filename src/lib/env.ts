export const env = {
  supabaseUrl: (import.meta.env.VITE_SUPABASE_URL as string | undefined) || '',
  supabaseAnonKey: (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || '',
  turnstileSiteKey: (import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined) || '',
  siteUrl: (import.meta.env.VITE_SITE_URL as string | undefined) || 'https://raackdance.com',
  allowDemo: (import.meta.env.VITE_ALLOW_DEMO as string | undefined) !== 'false',
}
export const isSupabase = Boolean(env.supabaseUrl && env.supabaseAnonKey)
export const isDemo = !isSupabase
