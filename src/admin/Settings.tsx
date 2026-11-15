import { useEffect, useState } from 'react'
import { repo } from '@/lib/repo'
import { canEdit } from '@/lib/rbac'
import type { ProfileRow, SettingRow } from '@/lib/types'
import { PageTitle, Toast } from './ui'
import { localdb } from '@/lib/localdb'
import { isDemo } from '@/lib/env'

export default function Settings({ p }: { p: ProfileRow }) {
  const [rows, setRows] = useState<Record<string, any>>({})
  const [toast, setToast] = useState<{ text: string; err?: boolean } | null>(null)
  const can = canEdit(p.role, 'settings')
  useEffect(() => { repo.list('site_settings').then((r: SettingRow[]) => setRows(Object.fromEntries(r.map((x) => [x.key, x.value])))).catch((e) => setToast({ text: e.message, err: true })) }, [])
  const save = async (key: string, value: unknown) => {
    try { await repo.upsert('site_settings', { key, value } as SettingRow); setRows((r) => ({ ...r, [key]: value })); setToast({ text: 'Settings saved — live on the website' }) } catch (e: any) { setToast({ text: e.message, err: true }) }
  }
  const g = rows.general ?? {}, h = rows.home ?? {}
  return (
    <div className="space-y-6">
      <PageTitle title="Website settings" sub="Contact details, statistics, social links and homepage hero text." />
      <Section title="Contact & notices" onSave={() => save('general', g)} can={can}>
        {[['phone', 'Main phone'], ['email', 'Main email'], ['enquiryEmail', 'Enquiries email'], ['registrationNotice', 'Registration notice (homepage badge)'], ['ticketsUrl', 'Event tickets URL'], ['whatsapp', 'WhatsApp chat number (with country code, digits only — leave blank to hide button)']].map(([k, l]) => (
          <label key={k} className="block text-sm">{l}<input className="adm-input mt-1" disabled={!can} value={g[k] ?? ''} onChange={(e) => setRows({ ...rows, general: { ...g, [k]: e.target.value } })} /></label>
        ))}
      </Section>
      <Section title="Homepage hero" onSave={() => save('home', h)} can={can}>
        {[['heroLine1', 'Headline line 1'], ['heroLine2', 'Headline line 2 (accent)'], ['heroIntro', 'Intro sentence']].map(([k, l]) => (
          <label key={k} className="block text-sm">{l}<input className="adm-input mt-1" disabled={!can} value={h[k] ?? ''} onChange={(e) => setRows({ ...rows, home: { ...h, [k]: e.target.value } })} /></label>
        ))}
      </Section>
      <JsonSection title="Statistics" hint='[{"value":45,"suffix":"+","label":"Dance Studios"}]' value={rows.stats} can={can} onSave={(v) => save('stats', v)} />
      <JsonSection title="Social links" hint='[{"label":"Instagram","href":"https://…"}]' value={rows.socials} can={can} onSave={(v) => save('socials', v)} />
      {isDemo && p.role === 'super_admin' && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm">
          <p className="font-semibold">Demo data</p><p className="mt-1 text-amber-900">Reset this browser's demo database to the migrated content.</p>
          <button onClick={() => { localdb.reset(); location.reload() }} className="adm-btn mt-3 bg-amber-600 text-white">Reset demo data</button>
        </div>
      )}
      <Toast msg={toast} onDone={() => setToast(null)} />
    </div>
  )
}
function Section({ title, children, onSave, can }: { title: string; children: React.ReactNode; onSave: () => void; can: boolean }) {
  return <section className="rounded-2xl border border-line bg-white p-5"><h2 className="mb-4 font-display text-xl">{title}</h2><div className="grid gap-3 md:grid-cols-2">{children}</div>{can && <button onClick={onSave} className="adm-btn mt-4 bg-accent text-white">Save</button>}</section>
}
function JsonSection({ title, hint, value, can, onSave }: { title: string; hint: string; value: unknown; can: boolean; onSave: (v: unknown) => void }) {
  const [txt, setTxt] = useState('')
  const [err, setErr] = useState('')
  useEffect(() => { setTxt(JSON.stringify(value ?? [], null, 2)) }, [value])
  return (
    <section className="rounded-2xl border border-line bg-white p-5">
      <h2 className="font-display text-xl">{title}</h2><p className="mb-3 text-xs text-muted">Format: <code>{hint}</code></p>
      <textarea aria-label={title} rows={8} className="adm-input font-mono text-xs" value={txt} disabled={!can} onChange={(e) => setTxt(e.target.value)} />
      {err && <p className="mt-1 text-xs text-accent">{err}</p>}
      {can && <button onClick={() => { try { const v = JSON.parse(txt); if (!Array.isArray(v)) throw new Error(); setErr(''); onSave(v) } catch { setErr('Must be a valid JSON array') } }} className="adm-btn mt-3 bg-accent text-white">Save</button>}
    </section>
  )
}
