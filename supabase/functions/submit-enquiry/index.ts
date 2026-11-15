// Public enquiry intake: validation → bot check (Turnstile + honeypot) → rate limit → insert (service role) → optional email alert.
// Secrets: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (auto), TURNSTILE_SECRET, IP_HASH_SALT, ALLOWED_ORIGINS, RESEND_API_KEY?, NOTIFY_EMAIL?
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { cors, json } from '../_shared/cors.ts'

const TYPES = ['trial', 'general', 'program', 'studio', 'online', 'franchise', 'careers', 'event', 'faculty']
const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : null) || null

async function sha256(s: string) {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors(req) })
  if (req.method !== 'POST') return json(req, { error: 'Method not allowed' }, 405)
  let b: Record<string, any>
  try { b = await req.json() } catch { return json(req, { error: 'Invalid request' }, 400) }

  if (b.website) return json(req, { ok: true, id: 'ok' }) // honeypot: pretend success

  // ── validation (mirrors the client zod schema) ──
  const errors: string[] = []
  const type = TYPES.includes(b.type) ? b.type : 'general'
  const name = str(b.name, 120); if (!name || name.length < 2) errors.push('name')
  const phone = String(b.phone ?? '').replace(/\D/g, ''); if (!/^\d{6,15}$/.test(phone)) errors.push('phone')
  const cc = String(b.country_code ?? '+91'); if (!/^\+\d{1,4}$/.test(cc)) errors.push('country_code')
  const email = str(b.email, 200); if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('email')
  if (b.guardian_consent !== true) errors.push('guardian_consent')
  if (errors.length) return json(req, { error: `Please check: ${errors.join(', ')}` }, 422)

  // ── bot protection ──
  const secret = Deno.env.get('TURNSTILE_SECRET')
  const ip = req.headers.get('cf-connecting-ip') ?? req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (secret) {
    const form = new FormData(); form.append('secret', secret); form.append('response', String(b.captchaToken ?? '')); form.append('remoteip', ip)
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form }).then((x) => x.json()).catch(() => ({ success: false }))
    if (!r.success) return json(req, { error: 'Verification failed. Please try again.' }, 400)
  }

  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } })
  const ipHash = await sha256(ip + (Deno.env.get('IP_HASH_SALT') ?? 'raack'))
  const [{ data: okShort }, { data: okDay }, { data: okPhone }] = await Promise.all([
    db.rpc('hit_rate_limit', { p_bucket: `ip:${ipHash}`, p_max: 5, p_window_seconds: 600 }),
    db.rpc('hit_rate_limit', { p_bucket: `ipday:${ipHash}`, p_max: 30, p_window_seconds: 86400 }),
    db.rpc('hit_rate_limit', { p_bucket: `phone:${phone}`, p_max: 3, p_window_seconds: 3600 }),
  ])
  if (okShort === false || okDay === false || okPhone === false) return json(req, { error: 'Too many submissions. Please call +91 90030 24113.' }, 429)

  const utm: Record<string, string> = {}
  if (b.utm && typeof b.utm === 'object') for (const [k, v] of Object.entries(b.utm)) if (/^(utm_[a-z]+|gclid|fbclid)$/.test(k)) utm[k] = String(v).slice(0, 200)

  const row = {
    type, name, email, phone, country_code: cc, guardian_consent: true,
    whatsapp: str(b.whatsapp, 20), gender: str(b.gender, 20), program_slug: str(b.program_slug, 60), studio_slug: str(b.studio_slug, 60),
    position: str(b.position, 60), country: str(b.country, 80), state: str(b.state, 80), class_type: str(b.class_type, 60),
    preferred_timing: str(b.preferred_timing, 120), heard_from: str(b.heard_from, 60), message: str(b.message, 2000), child_age: str(b.child_age, 40),
    utm, referrer: str(b.referrer, 500), landing_page: str(b.landing_page, 500), source_page: str(b.source_page, 200), ip_hash: ipHash,
  }
  const { data, error } = await db.from('enquiries').insert(row).select('id').single()
  if (error) { console.error(error); return json(req, { error: 'Could not save your enquiry. Please call +91 90030 24113.' }, 500) }

  // Optional e-mail alert to the counselling desk
  const resend = Deno.env.get('RESEND_API_KEY'), to = Deno.env.get('NOTIFY_EMAIL')
  if (resend && to) {
    fetch('https://api.resend.com/emails', {
      method: 'POST', headers: { Authorization: `Bearer ${resend}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: Deno.env.get('NOTIFY_FROM') ?? 'Raack Website <noreply@raackdance.com>', to: to.split(','), subject: `New ${type} enquiry — ${name}`,
        text: `${name}\n${cc} ${phone}\n${email}\nProgram: ${row.program_slug ?? '-'}\nStudio: ${row.studio_slug ?? '-'}\n\n${row.message ?? ''}\n\nOpen the admin dashboard to respond.` }),
    }).catch((e) => console.error('notify failed', e))
  }
  return json(req, { ok: true, id: data.id })
})
