import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, ArrowUpRight, CalendarClock, Inbox, TrendingUp, Users } from 'lucide-react'
import { repo } from '@/lib/repo'
import { supabase } from '@/lib/supabase'
import { canSeeEnquiry, canView } from '@/lib/rbac'
import { ENQUIRY_STATUSES, ENQUIRY_TYPES, type EnquiryRow, type ProfileRow, type StudioRow, type MediaRow, type TestimonialRow } from '@/lib/types'
import { PageTitle } from './ui'
import { sourceOf } from './Enquiries'
import { fmtDate } from '@/lib/utils'

type Stats = { total: number; last7: number; enrolled: number; byStatus: Record<string, number>; byType: Record<string, number>; bySource: Record<string, number>; byProgram: Record<string, number>; byStudio: Record<string, number>; byWeek: { label: string; n: number }[] }

function compute(rows: EnquiryRow[]): Stats {
  const tally = (f: (e: EnquiryRow) => string | null | undefined) => rows.reduce<Record<string, number>>((a, e) => { const k = f(e) || '—'; a[k] = (a[k] ?? 0) + 1; return a }, {})
  const now = Date.now(); const week = 7 * 864e5
  const byWeek = Array.from({ length: 8 }, (_, i) => {
    const end = now - (7 - i) * week, start = end - week
    return { label: new Date(end).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), n: rows.filter((e) => { const t = Date.parse(e.created_at ?? ''); return t > start && t <= end }).length }
  })
  return { total: rows.length, last7: rows.filter((e) => now - Date.parse(e.created_at ?? '') < week).length, enrolled: rows.filter((e) => e.status === 'enrolled').length,
    byStatus: tally((e) => e.status), byType: tally((e) => e.type), bySource: tally(sourceOf), byProgram: tally((e) => e.program_slug), byStudio: tally((e) => e.studio_slug), byWeek }
}

export default function Overview({ p }: { p: ProfileRow }) {
  const [rows, setRows] = useState<EnquiryRow[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [studios, setStudios] = useState<StudioRow[]>([])
  const [media, setMedia] = useState<MediaRow[]>([])
  const [tst, setTst] = useState<TestimonialRow[]>([])
  const [err, setErr] = useState('')
  const seesLeads = canView(p.role, 'enquiries')

  useEffect(() => {
    (async () => {
      try {
        const [s, m, t] = await Promise.all([repo.list('studios'), repo.list('media'), repo.list('testimonials')])
        setStudios(s); setMedia(m); setTst(t)
        const slugById = Object.fromEntries(s.map((x) => [x.id, x.slug]))
        if (seesLeads) {
          const e = (await repo.list('enquiries')).filter((x) => canSeeEnquiry(p, x, slugById))
          setRows(e); setStats(compute(e))
        } else if (supabase) {
          const { data, error } = await supabase.rpc('enquiry_stats'); if (error) throw error; setStats(data as Stats)
        } else setStats(compute(await repo.list('enquiries')))
      } catch (e: any) { setErr(e.message) }
    })()
  }, [p, seesLeads])

  const due = useMemo(() => rows.filter((e) => e.follow_up_at && !['enrolled', 'not_interested', 'invalid', 'archived'].includes(e.status) && (p.role !== 'counsellor' || e.assigned_to === p.id)).sort((a, b) => (a.follow_up_at! < b.follow_up_at! ? -1 : 1)).slice(0, 6), [rows, p])
  const studioName = (slug: string) => studios.find((s) => s.slug === slug)?.name ?? slug
  const unverified = studios.filter((s) => s.status === 'unverified').length
  const consentPending = media.filter((m) => m.consent_status === 'unknown' && m.published).length + tst.filter((t) => t.consent_status === 'unknown' && t.published).length

  return (
    <div>
      <PageTitle title={`Welcome, ${p.full_name.split(' ')[0]}`} sub="Overview of leads and website health" />
      {err && <p className="mb-4 rounded-xl bg-accent-soft p-3 text-sm text-accent-deep">{err}</p>}
      {stats && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Kpi icon={<Inbox />} label="Total enquiries" value={stats.total} />
            <Kpi icon={<TrendingUp />} label="Last 7 days" value={stats.last7} />
            <Kpi icon={<Users />} label="Enrolled" value={stats.enrolled} sub={stats.total ? `${Math.round((stats.enrolled / stats.total) * 100)}% conversion` : undefined} />
            <Kpi icon={<CalendarClock />} label="New (uncontacted)" value={stats.byStatus.new ?? 0} />
          </div>
          <div className="mt-6 grid gap-4 xl:grid-cols-3">
            <Card title="Enquiries per week" className="xl:col-span-2"><Bars data={stats.byWeek.map((w) => [w.label, w.n])} vertical /></Card>
            <Card title="Pipeline"><Bars data={ENQUIRY_STATUSES.map((s) => [s.label, stats.byStatus[s.value] ?? 0])} /></Card>
            <Card title="Lead sources"><Bars data={top(stats.bySource)} /></Card>
            <Card title="By enquiry type"><Bars data={ENQUIRY_TYPES.map((t) => [t.label, stats.byType[t.value] ?? 0] as [string, number]).filter(([, n]) => n)} /></Card>
            <Card title="Top studios"><Bars data={top(stats.byStudio).map(([k, n]) => [k === '—' ? 'Online / none' : studioName(k), n])} /></Card>
          </div>
        </>
      )}
      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {seesLeads && (
          <Card title="Upcoming follow-ups">
            {due.length ? <ul className="divide-y divide-line">{due.map((e) => <li key={e.id} className="flex justify-between gap-3 py-2 text-sm"><span><span className="font-semibold">{e.name}</span> <span className="text-muted">· {e.program_slug ?? e.type}</span></span><span className={e.follow_up_at! < new Date().toISOString() ? 'font-semibold text-accent' : 'text-muted'}>{fmtDate(e.follow_up_at)}</span></li>)}</ul> : <p className="text-sm text-muted">Nothing scheduled.</p>}
            <Link to="/admin/enquiries" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent">Open enquiries <ArrowUpRight className="h-4 w-4" /></Link>
          </Card>
        )}
        {['super_admin', 'content_editor'].includes(p.role) && (
          <Card title="Launch checklist">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" /><span><strong>{unverified}</strong> studios still unverified — confirm address, phone and status. <Link to="/admin/studios" className="text-accent">Review</Link></span></li>
              <li className="flex items-start gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" /><span><strong>{consentPending}</strong> published photos/testimonials have unknown consent. <Link to="/admin/gallery" className="text-accent">Review media</Link></span></li>
              <li className="flex items-start gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" /><span>Event dates are provisional until marked verified. <Link to="/admin/events" className="text-accent">Review events</Link></span></li>
            </ul>
          </Card>
        )}
      </div>
    </div>
  )
}
const top = (o: Record<string, number>, n = 6) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n) as [string, number][]
function Kpi({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: number; sub?: string }) {
  return <div className="rounded-2xl border border-line bg-white p-5"><div className="flex items-center justify-between text-muted"><span className="text-xs font-semibold uppercase tracking-wider">{label}</span><span className="[&>svg]:h-4 [&>svg]:w-4">{icon}</span></div><p className="mt-3 font-display text-4xl">{value.toLocaleString('en-IN')}</p>{sub && <p className="text-xs text-muted">{sub}</p>}</div>
}
function Card({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-line bg-white p-5 ${className ?? ''}`}><h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted">{title}</h2>{children}</section>
}
function Bars({ data, vertical }: { data: [string, number][]; vertical?: boolean }) {
  const max = Math.max(1, ...data.map((d) => d[1]))
  if (!data.length) return <p className="text-sm text-muted">No data yet.</p>
  if (vertical) return (
    <div className="flex h-44 items-end gap-2" role="img" aria-label={data.map(([k, n]) => `${k}: ${n}`).join(', ')}>
      {data.map(([k, n]) => <div key={k} className="flex flex-1 flex-col items-center gap-1"><span className="text-xs font-semibold">{n || ''}</span><div className="w-full rounded-t-md bg-accent/85" style={{ height: `${(n / max) * 120 + 2}px` }} /><span className="text-[0.65rem] text-muted">{k}</span></div>)}
    </div>
  )
  return (
    <ul className="space-y-2">
      {data.map(([k, n]) => <li key={k} className="text-sm"><div className="flex justify-between"><span className="truncate">{k}</span><span className="font-semibold">{n}</span></div><div className="mt-1 h-1.5 rounded-full bg-pearl"><div className="h-full rounded-full bg-ink" style={{ width: `${(n / max) * 100}%` }} /></div></li>)}
    </ul>
  )
}
