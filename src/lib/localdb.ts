// Browser-only demo database (localStorage). Used when Supabase env vars are not set,
// so the full site + admin can be evaluated without a backend. Never used in production.
import type { TableName, Tables } from './types'
import { buildSeed } from './seed'

const KEY = 'raack-demo-db-v1'
type DB = { [K in TableName]: Tables[K][] }

let cache: DB | null = null
const listeners = new Set<() => void>()

function empty(): DB {
  return {
    programs: [], studios: [], branch_heads: [], class_sessions: [], team_members: [], events: [], testimonials: [], media: [],
    careers: [], site_settings: [], pages: [], enquiries: [], enquiry_notes: [], profiles: [], audit_logs: [],
  }
}

function demoProfiles() {
  const now = new Date().toISOString()
  return [
    { id: 'u-super', email: 'admin@raack.demo', full_name: 'Demo Super Admin', role: 'super_admin', active: true, studio_ids: [], created_at: now },
    { id: 'u-editor', email: 'editor@raack.demo', full_name: 'Demo Content Editor', role: 'content_editor', active: true, studio_ids: [], created_at: now },
    { id: 'u-branch', email: 'velachery@raack.demo', full_name: 'Demo Branch Manager (Velachery)', role: 'branch_manager', active: true, studio_ids: ['studio-velachery'], created_at: now },
    { id: 'u-counsellor', email: 'counsellor@raack.demo', full_name: 'Demo Counsellor', role: 'counsellor', active: true, studio_ids: [], created_at: now },
    { id: 'u-readonly', email: 'viewer@raack.demo', full_name: 'Demo Viewer', role: 'read_only', active: true, studio_ids: [], created_at: now },
  ] as Tables['profiles'][]
}

export function loadDB(): DB {
  if (cache) return cache
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(KEY) : null
    if (raw) { cache = { ...empty(), ...JSON.parse(raw) } as DB; return cache }
  } catch { /* ignore */ }
  const seed = buildSeed()
  cache = { ...empty(), ...(seed as unknown as Partial<DB>), profiles: demoProfiles() }
  persist()
  return cache
}

function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(cache)) } catch { /* quota / private mode */ }
  listeners.forEach((l) => l())
}

export const localdb = {
  all<T extends TableName>(t: T): Tables[T][] { return loadDB()[t] as Tables[T][] },
  upsert<T extends TableName>(t: T, row: Tables[T], keyField = 'id'): Tables[T] {
    const db = loadDB(); const list = db[t] as any[]
    const now = new Date().toISOString()
    const r: any = { ...row, updated_at: now }
    if (!r[keyField]) r[keyField] = crypto.randomUUID()
    const i = list.findIndex((x) => x[keyField] === r[keyField])
    if (i >= 0) list[i] = { ...list[i], ...r }
    else list.unshift({ created_at: now, ...r })
    persist(); return r
  },
  remove<T extends TableName>(t: T, id: string, keyField = 'id') {
    const db = loadDB(); (db as any)[t] = (db[t] as any[]).filter((x) => x[keyField] !== id); persist()
  },
  reset() { cache = null; try { localStorage.removeItem(KEY) } catch { /* */ } loadDB(); persist() },
  subscribe(fn: () => void) { listeners.add(fn); return () => listeners.delete(fn) },
}
