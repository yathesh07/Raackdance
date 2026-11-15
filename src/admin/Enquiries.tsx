import { useCallback, useEffect, useMemo, useState } from 'react'
import { CalendarClock, Download, Mail, MessageSquarePlus, Phone, RefreshCw, Search } from 'lucide-react'
import { repo } from '@/lib/repo'
import { canEdit, canSeeEnquiry } from '@/lib/rbac'
import { ENQUIRY_STATUSES, ENQUIRY_TYPES, type EnquiryNoteRow, type EnquiryRow, type ProfileRow, type StudioRow } from '@/lib/types'
import { Badge, Empty, Modal, PageTitle, Toast, downloadCsv } from './ui'
import { cn, fmtDate } from '@/lib/utils'

const statusTone = (s: string) => ENQUIRY_STATUSES.find((x) => x.value === s)?.tone ?? ''
const statusLabel = (s: string) => ENQUIRY_STATUSES.find((x) => x.value === s)?.label ?? s
const typeLabel = (s: string) => ENQUIRY_TYPES.find((x) => x.value === s)?.label ?? s
export const sourceOf = (e: EnquiryRow) => {
  if (e.utm?.utm_source) return e.utm.utm_source
  if (e.heard_from) return e.heard_from
  try { if (e.referrer) return new URL(e.referrer).hostname.replace('www.', '') } catch { /* */ }
  return 'Direct / website'
}

export default function Enquiries({ p }: { p: ProfileRow }) {
  const [rows, setRows] = useState<EnquiryRow[]>([])
  const [studios, setStudios] = useState<StudioRow[]>([])
  const [staff, setStaff] = useState<ProfileRow[]>([])
  const [loading, setLoading] = useState(true)
  const [f, setF] = useState({ q: '', status: '', type: '', studio: '', assigned: '', from: '', to: '' })
  const [open, setOpen] = useState<EnquiryRow | null>(null)
  const [toast, setToast] = useState<{ text: string; err?: boolean } | null>(null)
  const editable = canEdit(p.role, 'enquiries')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [e, s, u] = await Promise.all([repo.list('enquiries'), repo.list('studios'), repo.list('profiles').catch(() => [] as ProfileRow[])])
      setRows(e); setStudios(s); setStaff(u.filter((x) => x.active))
    } catch (err: any) { setToast({ text: err.message, err: true }) } finally { setLoading(false) }
  }, [])
  useEffect(() => { load() }, [load])

  const slugById = useMemo(() => Object.fromEntries(studios.map((s) => [s.id, s.slug])), [studios])
  const studioName = (slug: string | null) => studios.find((s) => s.slug === slug)?.name ?? (slug || '—')
  const visible = useMemo(() => rows.filter((e) => canSeeEnquiry(p, e, slugById)), [rows, p, slugById])
  const list = useMemo(() => {
    const t = f.q.trim().toLowerCase()
    return visible.filter((e) =>
      (!t || `${e.name} ${e.email} ${e.phone} ${e.message ?? ''}`.toLowerCase().includes(t)) && (!f.status || e.status === f.status) && (!f.type || e.type === f.type) &&
      (!f.studio || e.studio_slug === f.studio) && (!f.assigned || (f.assigned === 'none' ? !e.assigned_to : f.assigned === 'me' ? e.assigned_to === p.id : e.assigned_to === f.assigned)) &&
      (!f.from || (e.created_at ?? '') >= f.from) && (!f.to || (e.created_at ?? '') <= f.to + 'T23:59:59'))
  }, [visible, f, p.id])

  const counts = useMemo(() => Object.fromEntries(ENQUIRY_STATUSES.map((s) => [s.value, visible.filter((e) => e.status === s.value).length])), [visible])
  const set = (k: keyof typeof f, v: string) => setF((x) => ({ ...x, [k]: v }))

  const update = async (e: EnquiryRow, patch: Partial<EnquiryRow>) => {
    if (!editable) return
    try {
      const saved = await repo.upsert('enquiries', { id: e.id, ...patch })
      setRows((r) => r.map((x) => (x.id === e.id ? { ...x, ...saved } : x)))
      if (open?.id === e.id) setOpen({ ...e, ...saved })
      setToast({ text: 'Enquiry updated' })
    } catch (err: any) { setToast({ text: err.message, err: true }) }
  }

  const exportCsv = () => downloadCsv(`raack-enquiries-${new Date().toISOString().slice(0, 10)}.csv`, list.map((e) => ({
    created_at: e.created_at, status: statusLabel(e.status), type: typeLabel(e.type), name: e.name, phone: `${e.country_code} ${e.phone}`, email: e.email, program: e.program_slug,
    studio: studioName(e.studio_slug), child_age: e.child_age, source: sourceOf(e), utm_campaign: e.utm?.utm_campaign, assigned_to: staff.find((s) => s.id === e.assigned_to)?.full_name, follow_up_at: e.follow_up_at, message: e.message,
  })))

  return (
    <div>
      <PageTitle title="Enquiries" sub={`${list.length} shown · ${visible.length} you can access`}>
        <button onClick={load} className="adm-btn border border-line bg-white"><RefreshCw className="h-4 w-4" />Refresh</button>
        <button onClick={exportCsv} className="adm-btn bg-ink text-white"><Download className="h-4 w-4" />Export CSV</button>
      </PageTitle>
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        <button onClick={() => set('status', '')} className={cn('shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold', !f.status ? 'border-ink bg-ink text-white' : 'border-line bg-white')}>All {visible.length}</button>
        {ENQUIRY_STATUSES.map((s) => <button key={s.value} onClick={() => set('status', s.value)} className={cn('shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold', f.status === s.value ? 'border-ink bg-ink text-white' : 'border-line bg-white')}>{s.label} {counts[s.value]}</button>)}
      </div>
      <div className="mb-4 grid gap-2 rounded-2xl border border-line bg-white p-3 md:grid-cols-2 xl:grid-cols-6">
        <div className="flex items-center gap-2 rounded-lg border border-line px-3 md:col-span-2 xl:col-span-2"><Search className="h-4 w-4 text-muted" /><input aria-label="Search enquiries" value={f.q} onChange={(e) => set('q', e.target.value)} placeholder="Name, phone, email…" className="w-full py-2 text-sm outline-none" /></div>
        <select aria-label="Type" className="adm-input" value={f.type} onChange={(e) => set('type', e.target.value)}><option value="">All types</option>{ENQUIRY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}</select>
        <select aria-label="Studio" className="adm-input" value={f.studio} onChange={(e) => set('studio', e.target.value)}><option value="">All studios</option>{studios.map((s) => <option key={s.id} value={s.slug}>{s.name}</option>)}</select>
        <select aria-label="Assigned" className="adm-input" value={f.assigned} onChange={(e) => set('assigned', e.target.value)}><option value="">Anyone</option><option value="me">Assigned to me</option><option value="none">Unassigned</option>{staff.map((s) => <option key={s.id} value={s.id}>{s.full_name}</option>)}</select>
        <div className="flex gap-1 md:col-span-2 xl:col-span-6"><span className="self-center px-1 text-xs text-muted">Received</span><input aria-label="From date" type="date" className="adm-input" value={f.from} onChange={(e) => set('from', e.target.value)} /><input aria-label="To date" type="date" className="adm-input" value={f.to} onChange={(e) => set('to', e.target.value)} /></div>
      </div>

      {loading ? <div className="h-40 animate-pulse rounded-2xl bg-white" /> : list.length === 0 ? <Empty>No enquiries match these filters.</Empty> : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-pearl/60 text-xs uppercase tracking-wider text-muted"><tr><th className="px-4 py-3">Received</th><th className="px-4 py-3">Name</th><th className="px-4 py-3">Interest</th><th className="hidden px-4 py-3 lg:table-cell">Source</th><th className="px-4 py-3">Status</th><th className="hidden px-4 py-3 md:table-cell">Follow-up</th></tr></thead>
            <tbody>
              {list.map((e) => (
                <tr key={e.id} onClick={() => setOpen(e)} className="cursor-pointer border-b border-line/60 last:border-0 hover:bg-pearl/40">
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-muted">{fmtDate(e.created_at)}</td>
                  <td className="px-4 py-3"><p className="font-semibold">{e.name}</p><p className="text-xs text-muted">{e.country_code} {e.phone}</p></td>
                  <td className="px-4 py-3"><p>{typeLabel(e.type)}</p><p className="text-xs text-muted">{[e.program_slug, studioName(e.studio_slug)].filter((x) => x && x !== '—').join(' · ')}</p></td>
                  <td className="hidden px-4 py-3 text-xs lg:table-cell">{sourceOf(e)}</td>
                  <td className="px-4 py-3"><Badge tone={statusTone(e.status)}>{statusLabel(e.status)}</Badge></td>
                  <td className={cn('hidden px-4 py-3 text-xs md:table-cell', e.follow_up_at && e.follow_up_at < new Date().toISOString() && !['enrolled', 'not_interested', 'invalid', 'archived'].includes(e.status) && 'font-semibold text-accent')}>{e.follow_up_at ? fmtDate(e.follow_up_at) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!open} onClose={() => setOpen(null)} title={open ? open.name : ''} wide>
        {open && <Detail e={open} p={p} staff={staff} studioName={studioName} editable={editable} onUpdate={(patch) => update(open, patch)} onToast={setToast} />}
      </Modal>
      <Toast msg={toast} onDone={() => setToast(null)} />
    </div>
  )
}

function Detail({ e, p, staff, studioName, editable, onUpdate, onToast }: { e: EnquiryRow; p: ProfileRow; staff: ProfileRow[]; studioName: (s: string | null) => string; editable: boolean; onUpdate: (x: Partial<EnquiryRow>) => void; onToast: (t: { text: string; err?: boolean }) => void }) {
  const [notes, setNotes] = useState<EnquiryNoteRow[]>([])
  const [note, setNote] = useState('')
  const loadNotes = useCallback(async () => { try { setNotes((await repo.list('enquiry_notes')).filter((n) => n.enquiry_id === e.id)) } catch { /* */ } }, [e.id])
  useEffect(() => { loadNotes() }, [loadNotes])
  const add = async () => {
    if (!note.trim()) return
    try { await repo.upsert('enquiry_notes', { enquiry_id: e.id, author_id: p.id, author_name: p.full_name, body: note.trim() } as any); setNote(''); loadNotes() } catch (err: any) { onToast({ text: err.message, err: true }) }
  }
  const rows: [string, React.ReactNode][] = [
    ['Type', typeLabel(e.type)], ['Phone', <a href={`tel:${e.country_code}${e.phone}`} className="font-semibold text-accent">{e.country_code} {e.phone}</a>], ['Email', e.email ? <a href={`mailto:${e.email}`} className="text-accent">{e.email}</a> : '—'],
    ['Program', e.program_slug ?? '—'], ['Studio', studioName(e.studio_slug)], ['Student age', e.child_age ?? '—'], ['Position', e.position ?? '—'], ['Gender', e.gender ?? '—'], ['WhatsApp', e.whatsapp ?? '—'],
    ['Country / state', [e.country, e.state].filter(Boolean).join(', ') || '—'], ['Class type', e.class_type ?? '—'], ['Preferred timing', e.preferred_timing ?? '—'], ['Heard from', e.heard_from ?? '—'],
    ['Guardian/contact consent', e.guardian_consent ? 'Yes' : 'No'], ['Source', sourceOf(e)], ['UTM', Object.entries(e.utm ?? {}).map(([k, v]) => `${k}=${v}`).join(' · ') || '—'], ['Landing page', e.landing_page ?? '—'], ['Form page', e.source_page ?? '—'], ['Received', fmtDate(e.created_at)],
  ]
  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
      <div>
        <div className="mb-5 flex flex-wrap gap-2">
          <a href={`tel:${e.country_code}${e.phone}`} className="adm-btn bg-accent text-white"><Phone className="h-4 w-4" />Call</a>
          <a href={`https://wa.me/${(e.whatsapp || e.country_code + e.phone).replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="adm-btn border border-line">WhatsApp</a>
          {e.email && <a href={`mailto:${e.email}`} className="adm-btn border border-line"><Mail className="h-4 w-4" />Email</a>}
        </div>
        <dl className="divide-y divide-line rounded-xl border border-line text-sm">
          {rows.map(([k, v]) => <div key={k} className="grid grid-cols-[150px_1fr] gap-3 px-4 py-2.5"><dt className="text-muted">{k}</dt><dd className="break-words">{v}</dd></div>)}
        </dl>
        {e.message && <div className="mt-4 rounded-xl bg-pearl p-4 text-sm"><p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted">Message</p>{e.message}</div>}
      </div>
      <div className="space-y-5">
        <div className="space-y-3 rounded-xl border border-line p-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted" htmlFor="enq-status">Status</label>
          <select id="enq-status" className="adm-input" value={e.status} disabled={!editable} onChange={(x) => onUpdate({ status: x.target.value as any })}>{ENQUIRY_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</select>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted" htmlFor="enq-assign">Assigned to</label>
          <select id="enq-assign" className="adm-input" value={e.assigned_to ?? ''} disabled={!editable || p.role === 'counsellor'} onChange={(x) => onUpdate({ assigned_to: x.target.value || null })}>
            <option value="">Unassigned</option>{staff.filter((s) => ['super_admin', 'counsellor', 'branch_manager'].includes(s.role)).map((s) => <option key={s.id} value={s.id}>{s.full_name}</option>)}
          </select>
          {p.role === 'counsellor' && !e.assigned_to && editable && <button onClick={() => onUpdate({ assigned_to: p.id })} className="adm-btn w-full justify-center border border-line">Assign to me</button>}
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted" htmlFor="enq-fu"><CalendarClock className="h-3.5 w-3.5" />Follow-up</label>
          <input id="enq-fu" type="datetime-local" className="adm-input" disabled={!editable} value={e.follow_up_at ? e.follow_up_at.slice(0, 16) : ''} onChange={(x) => onUpdate({ follow_up_at: x.target.value ? new Date(x.target.value).toISOString() : null })} />
        </div>
        <div className="rounded-xl border border-line p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Internal notes</p>
          {editable && (
            <div className="mt-3 flex gap-2">
              <textarea aria-label="New note" rows={2} className="adm-input" value={note} onChange={(x) => setNote(x.target.value)} placeholder="Called — trial booked for Saturday 5pm…" />
              <button onClick={add} className="adm-btn shrink-0 self-start bg-ink text-white" aria-label="Add note"><MessageSquarePlus className="h-4 w-4" /></button>
            </div>
          )}
          <ul className="mt-4 space-y-3">
            {notes.map((n) => <li key={n.id} className="rounded-lg bg-pearl p-3 text-sm"><p>{n.body}</p><p className="mt-1 text-xs text-muted">{n.author_name ?? 'Staff'} · {fmtDate(n.created_at)}</p></li>)}
            {!notes.length && <li className="text-xs text-muted">No notes yet.</li>}
          </ul>
        </div>
      </div>
    </div>
  )
}
