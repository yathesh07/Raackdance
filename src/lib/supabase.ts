import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { env, isSupabase } from './env'

export const supabase: SupabaseClient | null = isSupabase
  ? createClient(env.supabaseUrl, env.supabaseAnonKey, { auth: { persistSession: true, autoRefreshToken: true } })
  : null
