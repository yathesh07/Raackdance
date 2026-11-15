import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from './supabase'
import { env, isSupabase } from './env'
import { localdb } from './localdb'
import { setDemoActor } from './repo'
import type { ProfileRow } from './types'

type AuthState = {
  profile: ProfileRow | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}
const Ctx = createContext<AuthState | null>(null)
const DEMO_KEY = 'raack-demo-session'
export const DEMO_PASSWORD = 'raack-demo'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileRow | null>(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(async (uid: string | undefined) => {
    if (!supabase || !uid) { setProfile(null); return }
    const { data } = await supabase.from('profiles').select('*').eq('id', uid).maybeSingle()
    if (data && data.active) setProfile(data as ProfileRow)
    else setProfile(null)
  }, [])

  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data }) => loadProfile(data.session?.user.id).finally(() => setLoading(false)))
      const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => { loadProfile(s?.user.id) })
      return () => sub.subscription.unsubscribe()
    }
    try {
      const id = sessionStorage.getItem(DEMO_KEY)
      const p = id ? localdb.all('profiles').find((x) => x.id === id) ?? null : null
      setProfile(p); setDemoActor(p ? { id: p.id, email: p.email } : null)
    } catch { /* */ }
    setLoading(false)
  }, [loadProfile])

  const signIn = async (email: string, password: string) => {
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw new Error(error.message)
      await loadProfile(data.user?.id)
      const { data: p } = await supabase.from('profiles').select('active').eq('id', data.user!.id).maybeSingle()
      if (!p?.active) { await supabase.auth.signOut(); throw new Error('Your account is not active. Contact a Super Admin.') }
      return
    }
    if (!env.allowDemo) throw new Error('Demo login disabled.')
    const p = localdb.all('profiles').find((x) => x.email.toLowerCase() === email.trim().toLowerCase())
    if (!p || password !== DEMO_PASSWORD) throw new Error('Invalid email or password.')
    if (!p.active) throw new Error('This account is deactivated.')
    sessionStorage.setItem(DEMO_KEY, p.id); setProfile(p); setDemoActor({ id: p.id, email: p.email })
  }
  const signOut = async () => {
    if (supabase) await supabase.auth.signOut()
    sessionStorage.removeItem(DEMO_KEY); setProfile(null); setDemoActor(null)
  }
  const resetPassword = async (email: string) => {
    if (!supabase) throw new Error('Password reset is available once Supabase is connected.')
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/admin/login` })
    if (error) throw new Error(error.message)
  }
  return <Ctx.Provider value={{ profile, loading, signIn, signOut, resetPassword }}>{children}</Ctx.Provider>
}

export function useAuth() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useAuth outside AuthProvider')
  return c
}
export { isSupabase }
