// Super-admin user management: invite staff, change roles/branches, deactivate. Requires caller JWT of an active super_admin.
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { cors, json } from '../_shared/cors.ts'

const ROLES = ['super_admin', 'content_editor', 'branch_manager', 'counsellor', 'read_only']

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors(req) })
  const url = Deno.env.get('SUPABASE_URL')!
  const admin = createClient(url, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } })
  const jwt = req.headers.get('Authorization')?.replace('Bearer ', '') ?? ''
  const { data: u } = await admin.auth.getUser(jwt)
  if (!u?.user) return json(req, { error: 'Not signed in' }, 401)
  const { data: me } = await admin.from('profiles').select('role, active').eq('id', u.user.id).single()
  if (!me || !me.active || me.role !== 'super_admin') return json(req, { error: 'Only Super Admins can manage users' }, 403)

  const b = await req.json().catch(() => ({}))
  if (!ROLES.includes(b.role)) return json(req, { error: 'Invalid role' }, 422)
  const profile = { full_name: String(b.full_name ?? '').slice(0, 120), role: b.role, active: b.active !== false, studio_ids: Array.isArray(b.studio_ids) ? b.studio_ids.map(String) : [] }

  if (b.action === 'invite') {
    const email = String(b.email ?? '').trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(req, { error: 'Invalid email' }, 422)
    const { data, error } = await admin.auth.admin.inviteUserByEmail(email, { redirectTo: `${Deno.env.get('SITE_URL') ?? 'https://raackdance.com'}/admin/login` })
    if (error) return json(req, { error: error.message }, 400)
    const { error: e2 } = await admin.from('profiles').upsert({ id: data.user.id, email, ...profile })
    if (e2) return json(req, { error: e2.message }, 400)
    await admin.from('audit_logs').insert({ actor_id: u.user.id, actor_email: u.user.email, action: 'invite', table_name: 'profiles', record_id: data.user.id, diff: { email, ...profile } })
    return json(req, { ok: true })
  }
  if (b.action === 'update') {
    if (!b.id) return json(req, { error: 'Missing user id' }, 422)
    if (b.id === u.user.id && (profile.role !== 'super_admin' || !profile.active)) return json(req, { error: "You can't remove your own Super Admin access" }, 422)
    const { error } = await admin.from('profiles').update(profile).eq('id', b.id)
    if (error) return json(req, { error: error.message }, 400)
    await admin.auth.admin.updateUserById(b.id, { ban_duration: profile.active ? 'none' : '876000h' })
    await admin.from('audit_logs').insert({ actor_id: u.user.id, actor_email: u.user.email, action: 'update', table_name: 'profiles', record_id: b.id, diff: profile })
    return json(req, { ok: true })
  }
  return json(req, { error: 'Unknown action' }, 400)
})
