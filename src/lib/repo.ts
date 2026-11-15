import { supabase } from './supabase'
import { isSupabase } from './env'
import { localdb } from './localdb'
import type { EnquiryRow, TableName, Tables } from './types'

export const keyOf = (t: TableName) => (t === 'site_settings' ? 'key' : t === 'pages' ? 'slug' : 'id')

let demoActor: { id: string; email: string } | null = null
export const setDemoActor = (a: typeof demoActor) => { demoActor = a }

const ORDER: Partial<Record<TableName, [string, boolean]>> = {
  enquiries: ['created_at', false], enquiry_notes: ['created_at', true], audit_logs: ['created_at', false],
  site_settings: ['key', true], pages: ['slug', true], profiles: ['created_at', true],
}

function audit(action: string, table: TableName, id: string | null, diff: unknown) {
  if (table === 'audit_logs') return
  localdb.upsert('audit_logs', {
    id: crypto.randomUUID(), actor_id: demoActor?.id ?? null, actor_email: demoActor?.email ?? 'public', action, table_name: table,
    record_id: id, diff, created_at: new Date().toISOString(),
  } as Tables['audit_logs'])
}

export const repo = {
  mode: isSupabase ? 'supabase' : 'demo',

  async list<T extends TableName>(table: T, opts: { publishedOnly?: boolean } = {}): Promise<Tables[T][]> {
    const [col, asc] = ORDER[table] ?? ['sort', true]
    if (supabase) {
      let q = supabase.from(table).select('*').order(col, { ascending: asc }).limit(5000)
      if (opts.publishedOnly) q = q.eq('published', true)
      const { data, error } = await q
      if (error) throw error
      return (data ?? []) as Tables[T][]
    }
    let rows = [...localdb.all(table)] as any[]
    if (opts.publishedOnly) rows = rows.filter((r) => r.published !== false)
    rows.sort((a, b) => {
      const x = a[col], y = b[col]
      const c = x === y ? 0 : x > y ? 1 : -1
      return asc ? c : -c
    })
    return rows as Tables[T][]
  },

  async upsert<T extends TableName>(table: T, row: Partial<Tables[T]>): Promise<Tables[T]> {
    const key = keyOf(table)
    if (supabase) {
      const clean: any = { ...row }
      delete clean.created_at
      clean.updated_at = new Date().toISOString()
      if (table === 'site_settings' || table === 'pages') delete clean.updated_at
      const { data, error } = await supabase.from(table).upsert(clean, { onConflict: key }).select().single()
      if (error) throw error
      return data as Tables[T]
    }
    const r = localdb.upsert(table, row as Tables[T], key)
    audit((row as any)[key] ? 'update' : 'insert', table, (r as any)[key], row)
    return r
  },

  async remove(table: TableName, id: string) {
    const key = keyOf(table)
    if (supabase) {
      const { error } = await supabase.from(table).delete().eq(key, id)
      if (error) throw error
      return
    }
    localdb.remove(table, id, key)
    audit('delete', table, id, null)
  },

  async submitEnquiry(payload: Partial<EnquiryRow> & { captchaToken?: string; website?: string }) {
    if (supabase) {
      const { data, error } = await supabase.functions.invoke('submit-enquiry', { body: payload })
      if (error) {
        let msg = 'Could not submit your enquiry. Please try again or call +91 90030 24113.'
        try { const b = await (error as any).context?.json?.(); if (b?.error) msg = b.error } catch { /* */ }
        throw new Error(msg)
      }
      return data as { ok: true; id: string }
    }
    if (payload.website) return { ok: true, id: 'ignored' } // honeypot
    const { captchaToken: _c, website: _w, ...rest } = payload
    const row = localdb.upsert('enquiries', {
      ...(rest as EnquiryRow), id: crypto.randomUUID(), status: 'new', assigned_to: null, follow_up_at: null, created_at: new Date().toISOString(),
    })
    audit('insert', 'enquiries', row.id, { type: row.type })
    return { ok: true as const, id: row.id }
  },

  async upload(file: File, folder = 'uploads'): Promise<string> {
    const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'video/mp4', 'video/webm']
    if (!ALLOWED.includes(file.type)) throw new Error('Unsupported file type. Use JPG, PNG, WebP, AVIF, GIF, MP4 or WebM.')
    const max = file.type.startsWith('video/') ? 100 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > max) throw new Error(`File too large (max ${max / 1024 / 1024} MB).`)
    if (supabase) {
      const ext = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin'
      const path = `${folder}/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${ext}`
      const { error } = await supabase.storage.from('media').upload(path, file, { contentType: file.type, upsert: false })
      if (error) throw error
      return supabase.storage.from('media').getPublicUrl(path).data.publicUrl
    }
    if (file.size > 2 * 1024 * 1024) throw new Error('Demo mode stores uploads in your browser — keep files under 2 MB.')
    return await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.onerror = rej; r.readAsDataURL(file) })
  },
}
