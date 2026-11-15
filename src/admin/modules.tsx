import { useEffect, useMemo, useState } from 'react'
import { ResourceManager, type FieldDef } from './ResourceManager'
import { Badge } from './ui'
import { canEdit, canEditStudio } from '@/lib/rbac'
import { repo } from '@/lib/repo'
import type { ProfileRow, StudioRow, ProgramRow } from '@/lib/types'
import { cn } from '@/lib/utils'

const CONSENT = [
  { value: 'unknown', label: 'Unknown — verify' }, { value: 'obtained', label: 'Consent obtained' },
  { value: 'not_required', label: 'Not required (adult / non-identifiable)' }, { value: 'withdrawn', label: 'Withdrawn — hide' },
]
const consentTone = (c: string) => (c === 'obtained' || c === 'not_required' ? 'bg-emerald-100 text-emerald-800' : c === 'withdrawn' ? 'bg-stone-200 text-stone-600' : 'bg-amber-100 text-amber-800')
const Thumb = ({ src }: { src?: string | null }) => (src ? <img src={src} alt="" className="h-10 w-10 rounded-lg bg-pearl object-contain" /> : <span className="block h-10 w-10 rounded-lg bg-pearl" />)

export function useLookups() {
  const [studios, setStudios] = useState<StudioRow[]>([])
  const [programs, setPrograms] = useState<ProgramRow[]>([])
  useEffect(() => { repo.list('studios').then(setStudios).catch(() => {}); repo.list('programs').then(setPrograms).catch(() => {}) }, [])
  return { studios, programs }
}

export function ProgramsAdmin({ p }: { p: ProfileRow }) {
  const fields: FieldDef[] = [
    { key: 'name', label: 'Name', required: true }, { key: 'slug', label: 'URL slug', required: true, readOnlyOnEdit: true, help: 'Used in /programs/<slug>' },
    { key: 'aka', label: 'Also known as' }, { key: 'age_group', label: 'Age group', required: true },
    { key: 'audience', label: 'Audience', type: 'select', options: ['kids', 'teens', 'adults', 'all'].map((v) => ({ value: v, label: v })) },
    { key: 'accent', label: 'Accent colour', type: 'color' }, { key: 'tagline', label: 'Tagline', full: true }, { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'outcomes', label: 'Learning outcomes (one per line)', type: 'list' }, { key: 'levels', label: 'Levels (one per line)', type: 'list' },
    { key: 'videos', label: 'YouTube video IDs (one per line)', type: 'list' }, { key: 'image', label: 'Card image', type: 'image' }, { key: 'logo', label: 'Logo', type: 'image' },
    { key: 'notice', label: 'Notice (optional)', full: true }, { key: 'sort', label: 'Sort order', type: 'number' }, { key: 'published', label: 'Published', type: 'boolean' },
  ]
  return <ResourceManager<ProgramRow> table="programs" title="Programs" fields={fields} canEdit={canEdit(p.role, 'programs')} searchKeys={['name', 'slug', 'age_group']}
    defaults={{ published: false, outcomes: [], levels: [], videos: [], accent: '#ec1d25', audience: 'kids', sort: 99 }}
    columns={[{ label: '', render: (r) => <Thumb src={r.logo} /> }, { label: 'Program', render: (r) => <><p className="font-semibold">{r.name}</p><p className="text-xs text-muted">/{r.slug}</p></> }, { label: 'Ages', render: (r) => r.age_group }, { label: 'Videos', render: (r) => r.videos.length }]} />
}

export function StudiosAdmin({ p }: { p: ProfileRow }) {
  const fields: FieldDef[] = [
    { key: 'name', label: 'Name', required: true }, { key: 'slug', label: 'URL slug', required: true, readOnlyOnEdit: true },
    { key: 'city', label: 'City', required: true }, { key: 'status', label: 'Verification status', type: 'select', options: [{ value: 'unverified', label: 'Unverified (migrated)' }, { value: 'active', label: 'Active — verified' }, { value: 'closed', label: 'Closed — hide from site' }] },
    { key: 'address', label: 'Address', type: 'textarea' }, { key: 'phones', label: 'Phone numbers (10 digits, one per line)', type: 'list' },
    { key: 'email', label: 'Email' }, { key: 'is_head_office', label: 'Head office studio', type: 'boolean' },
    { key: 'lat', label: 'Latitude', type: 'number' }, { key: 'lng', label: 'Longitude', type: 'number' },
    { key: 'maps_embed', label: 'Google Maps embed URL', full: true }, { key: 'hero', label: 'Studio photo', type: 'image' },
    { key: 'schedule_verified', label: 'Schedule verified', type: 'boolean' }, { key: 'notes', label: 'Internal notes / migration flags', type: 'textarea' },
    { key: 'sort', label: 'Sort order', type: 'number' }, { key: 'published', label: 'Published', type: 'boolean' },
  ]
  const isBM = p.role === 'branch_manager'
  return <ResourceManager<StudioRow> table="studios" title="Studios" fields={fields} canEdit={canEdit(p.role, 'studios')} canEditRow={(r) => canEditStudio(p, r.id)}
    rowFilter={isBM ? (r) => p.studio_ids.includes(r.id) : undefined} allowCreate={!isBM} allowDelete={!isBM} searchKeys={['name', 'city', 'address']}
    defaults={{ status: 'unverified', phones: [], published: false, is_head_office: false, schedule_verified: false, sort: 99, email: 'enquiry@raack.com' }}
    extraFilter={{ label: 'Status', options: [{ value: 'unverified', label: 'Unverified' }, { value: 'active', label: 'Active' }, { value: 'closed', label: 'Closed' }], test: (r, v) => r.status === v }}
    columns={[{ label: '', render: (r) => <Thumb src={r.hero} /> }, { label: 'Studio', render: (r) => <><p className="font-semibold">{r.name}</p><p className="text-xs text-muted">{r.city}</p></> },
      { label: 'Phone', render: (r) => r.phones[0] ?? '—', className: 'hidden md:table-cell' },
      { label: 'Verification', render: (r) => <Badge tone={r.status === 'active' ? 'bg-emerald-100 text-emerald-800' : r.status === 'closed' ? 'bg-stone-200' : 'bg-amber-100 text-amber-800'}>{r.status}</Badge> },
      { label: 'Flags', render: (r) => (r.notes ? <span title={r.notes} className="text-xs text-amber-700">{r.notes.split('\n').length} ⚑</span> : '—'), className: 'hidden lg:table-cell' }]} />
}

export function SchedulesAdmin({ p }: { p: ProfileRow }) {
  const { studios, programs } = useLookups()
  const mine = useMemo(() => (p.role === 'branch_manager' ? studios.filter((s) => p.studio_ids.includes(s.id)) : studios), [studios, p])
  const [studio, setStudio] = useState('')
  useEffect(() => { if (!studio && mine[0]) setStudio(mine[0].id) }, [mine, studio])
  const edit = canEdit(p.role, 'schedules') && (p.role !== 'branch_manager' || p.studio_ids.includes(studio))
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-white p-3">
        <label htmlFor="sch-studio" className="text-sm font-semibold">Studio</label>
        <select id="sch-studio" className="adm-input !w-auto" value={studio} onChange={(e) => setStudio(e.target.value)}>{mine.map((s) => <option key={s.id} value={s.id}>{s.name} · {s.city}</option>)}</select>
      </div>
      {studio && (
        <ResourceManager key={studio} table="class_sessions" title="Class schedule" publishToggle={false} canEdit={edit} searchKeys={['label', 'time_text', 'program_slug']}
          rowFilter={(r: any) => r.studio_id === studio}
          defaults={{ studio_id: studio, day: 0, sort: 0, program_slug: 'little-legends' } as any}
          extraFilter={{ label: 'Day', options: days.map((d, i) => ({ value: String(i), label: d })), test: (r: any, v) => String(r.day) === v }}
          fields={[
            { key: 'day', label: 'Day', type: 'select', options: days.map((d, i) => ({ value: String(i), label: d })), required: true },
            { key: 'program_slug', label: 'Program', type: 'select', options: [...programs.map((x) => ({ value: x.slug, label: x.name })), { value: 'other', label: 'Other' }], required: true },
            { key: 'label', label: 'Batch label (shown on site)', required: true }, { key: 'time_text', label: 'Time (e.g. 4PM - 5PM)', required: true }, { key: 'sort', label: 'Sort', type: 'number' },
          ]}
          columns={[{ label: 'Day', render: (r: any) => days[Number(r.day)] }, { label: 'Batch', render: (r: any) => <span className="font-semibold">{r.label}</span> }, { label: 'Program', render: (r: any) => r.program_slug }, { label: 'Time', render: (r: any) => r.time_text }]} />
      )}
    </div>
  )
}

export function InstructorsAdmin({ p }: { p: ProfileRow }) {
  const [tab, setTab] = useState<'team' | 'heads'>('team')
  const { studios } = useLookups()
  const can = canEdit(p.role, 'instructors')
  return (
    <div>
      <div className="mb-5 inline-flex rounded-xl border border-line bg-white p-1">
        {(['team', 'heads'] as const).map((t) => <button key={t} onClick={() => setTab(t)} className={cn('rounded-lg px-4 py-2 text-sm font-semibold', tab === t ? 'bg-ink text-white' : 'text-muted')}>{t === 'team' ? 'Core team' : 'Branch heads'}</button>)}
      </div>
      {tab === 'team' ? (
        <ResourceManager table="team_members" title="Core team & faculty" canEdit={can} searchKeys={['name', 'role']} defaults={{ published: false, sort: 99 } as any}
          fields={[{ key: 'name', label: 'Name', required: true }, { key: 'role', label: 'Designation', required: true }, { key: 'vision', label: 'Vision statement', type: 'textarea' }, { key: 'body', label: 'Biography', type: 'textarea' }, { key: 'photo', label: 'Photo', type: 'image' }, { key: 'sort', label: 'Sort', type: 'number' }, { key: 'published', label: 'Published', type: 'boolean' }]}
          columns={[{ label: '', render: (r: any) => <Thumb src={r.photo} /> }, { label: 'Name', render: (r: any) => <span className="font-semibold">{r.name}</span> }, { label: 'Designation', render: (r: any) => r.role }]} />
      ) : (
        <ResourceManager table="branch_heads" title="Branch heads" canEdit={can} publishToggle={false} searchKeys={['name', 'studio_id']} defaults={{ sort: 0 } as any}
          extraFilter={{ label: 'Studio', options: studios.map((s) => ({ value: s.id, label: s.name })), test: (r: any, v) => r.studio_id === v }}
          fields={[{ key: 'name', label: 'Name', required: true }, { key: 'studio_id', label: 'Studio', type: 'select', options: studios.map((s) => ({ value: s.id, label: s.name })), required: true }, { key: 'photo', label: 'Photo', type: 'image' }, { key: 'sort', label: 'Sort', type: 'number' }]}
          columns={[{ label: '', render: (r: any) => <Thumb src={r.photo} /> }, { label: 'Name', render: (r: any) => <span className="font-semibold">{r.name}</span> }, { label: 'Studio', render: (r: any) => studios.find((s) => s.id === r.studio_id)?.name ?? r.studio_id }]} />
      )}
    </div>
  )
}

export function EventsAdmin({ p }: { p: ProfileRow }) {
  return <ResourceManager table="events" title="Events" canEdit={canEdit(p.role, 'events')} searchKeys={['name', 'subtitle', 'edition']}
    defaults={{ status: 'announced', body: [], highlights: [], categories: [], judging: [], gallery: [], register: true, published: false, dates_verified: false, sort: 99 } as any}
    fields={[
      { key: 'name', label: 'Name', required: true }, { key: 'slug', label: 'URL slug', required: true, readOnlyOnEdit: true }, { key: 'subtitle', label: 'Subtitle' }, { key: 'edition', label: 'Edition / season' },
      { key: 'status', label: 'Status', type: 'select', options: [{ value: 'upcoming', label: 'Upcoming' }, { value: 'announced', label: 'Announced (dates TBA)' }, { value: 'past', label: 'Past' }] },
      { key: 'dates_verified', label: 'Dates & venue verified', type: 'boolean', help: 'Only verified events are emitted as Event structured data.' },
      { key: 'date_text', label: 'Date (display text)' }, { key: 'venue', label: 'Venue' }, { key: 'summary', label: 'Summary', type: 'textarea' }, { key: 'body', label: 'Body paragraphs (one per line)', type: 'list' },
      { key: 'highlights', label: 'Highlights (JSON: [{"title","body"}])', type: 'json' }, { key: 'categories', label: 'Competition categories (one per line)', type: 'list' }, { key: 'judging', label: 'Judging criteria (one per line)', type: 'list' },
      { key: 'stat', label: 'Headline stat (JSON: {"value","label"})', type: 'json' }, { key: 'cover', label: 'Cover / poster', type: 'image' }, { key: 'video', label: 'Video', type: 'image' }, { key: 'poster', label: 'Video poster', type: 'image' },
      { key: 'gallery', label: 'Gallery image URLs (one per line)', type: 'list' }, { key: 'tickets_url', label: 'Tickets URL', full: true }, { key: 'register', label: 'Show registration form', type: 'boolean' },
      { key: 'closing', label: 'Closing line', type: 'textarea' }, { key: 'sort', label: 'Sort', type: 'number' }, { key: 'published', label: 'Published', type: 'boolean' },
    ]}
    extraFilter={{ label: 'Status', options: [{ value: 'upcoming', label: 'Upcoming' }, { value: 'announced', label: 'Announced' }, { value: 'past', label: 'Past' }], test: (r: any, v) => r.status === v }}
    columns={[{ label: '', render: (r: any) => <Thumb src={r.cover} /> }, { label: 'Event', render: (r: any) => <><p className="font-semibold">{r.name}</p><p className="text-xs text-muted">{r.edition}</p></> }, { label: 'When', render: (r: any) => r.date_text }, { label: 'Status', render: (r: any) => <Badge>{r.status}</Badge> }, { label: 'Verified', render: (r: any) => (r.dates_verified ? '✓' : <span className="text-amber-700">pending</span>) }]} />
}

export function GalleryAdmin({ p }: { p: ProfileRow }) {
  const cats = ['programs', 'events', 'performances', 'studios', 'workshops', 'academy-life'].map((v) => ({ value: v, label: v }))
  return <ResourceManager table="media" title="Gallery & media" sub="Every item showing children must have consent recorded before publishing." canEdit={canEdit(p.role, 'gallery')} searchKeys={['alt', 'caption', 'category', 'url']}
    defaults={{ kind: 'image', category: 'academy-life', consent_status: 'unknown', published: false, sort: 999 } as any}
    extraFilter={{ label: 'Consent', options: CONSENT, test: (r: any, v) => r.consent_status === v }}
    fields={[{ key: 'url', label: 'File', type: 'image', required: true }, { key: 'kind', label: 'Type', type: 'select', options: [{ value: 'image', label: 'Image' }, { value: 'video', label: 'Video' }] },
      { key: 'category', label: 'Category', type: 'select', options: cats }, { key: 'alt', label: 'Alt text (describe the image)', required: true, full: true }, { key: 'caption', label: 'Caption', full: true },
      { key: 'event_slug', label: 'Event slug' }, { key: 'studio_slug', label: 'Studio slug' }, { key: 'consent_status', label: 'Parental / subject consent', type: 'select', options: CONSENT, required: true },
      { key: 'sort', label: 'Sort', type: 'number' }, { key: 'published', label: 'Published', type: 'boolean' }]}
    columns={[{ label: '', render: (r: any) => <Thumb src={r.kind === 'image' ? r.url : null} /> }, { label: 'Caption', render: (r: any) => <><p className="line-clamp-1 font-medium">{r.caption ?? r.alt}</p><p className="text-xs text-muted">{r.category}</p></> }, { label: 'Consent', render: (r: any) => <Badge tone={consentTone(r.consent_status)}>{r.consent_status}</Badge> }]} />
}

export function TestimonialsAdmin({ p }: { p: ProfileRow }) {
  return <ResourceManager table="testimonials" title="Testimonials" canEdit={canEdit(p.role, 'testimonials')} searchKeys={['name', 'quote', 'designation', 'studio']}
    defaults={{ kind: 'student', consent_status: 'unknown', published: false, sort: 99 } as any}
    extraFilter={{ label: 'Type', options: [{ value: 'student', label: 'Students & parents' }, { value: 'franchise', label: 'Franchise owners' }, { value: 'staff', label: 'Staff' }], test: (r: any, v) => r.kind === v }}
    fields={[{ key: 'name', label: 'Name', required: true }, { key: 'kind', label: 'Type', type: 'select', options: [{ value: 'student', label: 'Student / parent' }, { value: 'franchise', label: 'Franchise owner' }, { value: 'staff', label: 'Staff' }] },
      { key: 'designation', label: 'Designation' }, { key: 'studio', label: 'Studio' }, { key: 'program_slug', label: 'Program slug' }, { key: 'quote', label: 'Quote', type: 'textarea', required: true },
      { key: 'photo', label: 'Photo', type: 'image' }, { key: 'consent_status', label: 'Consent', type: 'select', options: CONSENT, required: true }, { key: 'sort', label: 'Sort', type: 'number' }, { key: 'published', label: 'Published', type: 'boolean' }]}
    columns={[{ label: '', render: (r: any) => <Thumb src={r.photo} /> }, { label: 'Name', render: (r: any) => <><p className="font-semibold">{r.name}</p><p className="text-xs text-muted">{r.kind}{r.studio ? ` · ${r.studio}` : ''}</p></> }, { label: 'Quote', render: (r: any) => <p className="line-clamp-2 max-w-md text-xs text-muted">{r.quote}</p>, className: 'hidden md:table-cell' }, { label: 'Consent', render: (r: any) => <Badge tone={consentTone(r.consent_status)}>{r.consent_status}</Badge> }]} />
}

export function CareersAdmin({ p }: { p: ProfileRow }) {
  return <ResourceManager table="careers" title="Career openings" canEdit={canEdit(p.role, 'careers')} searchKeys={['title', 'summary']} defaults={{ type: 'Full-time', requirements: [], published: false, sort: 99 } as any}
    fields={[{ key: 'title', label: 'Title', required: true }, { key: 'type', label: 'Type' }, { key: 'summary', label: 'Summary', type: 'textarea' }, { key: 'requirements', label: 'Requirements (one per line)', type: 'list' }, { key: 'apply', label: 'How to apply', full: true }, { key: 'sort', label: 'Sort', type: 'number' }, { key: 'published', label: 'Published', type: 'boolean' }]}
    columns={[{ label: 'Role', render: (r: any) => <span className="font-semibold">{r.title}</span> }, { label: 'Type', render: (r: any) => r.type }, { label: 'Requirements', render: (r: any) => r.requirements.length }]} />
}

export function PagesAdmin({ p }: { p: ProfileRow }) {
  return <ResourceManager table="pages" title="Pages & SEO" sub="Page titles and meta descriptions used for search engines and social sharing." canEdit={canEdit(p.role, 'pages')} allowDelete={false} searchKeys={['slug', 'title']} defaults={{ published: true } as any}
    fields={[{ key: 'slug', label: 'Page', required: true, readOnlyOnEdit: true }, { key: 'title', label: 'SEO title (≤ 60 chars ideal)', required: true, full: true }, { key: 'meta_description', label: 'Meta description (≤ 160 chars ideal)', type: 'textarea', required: true }, { key: 'published', label: 'Indexable by search engines', type: 'boolean' }]}
    columns={[{ label: 'Page', render: (r: any) => <span className="font-mono text-xs">/{r.slug === 'home' ? '' : r.slug}</span> }, { label: 'Title', render: (r: any) => <><p className="font-medium">{r.title}</p><p className={cn('text-xs', r.title.length > 65 ? 'text-amber-700' : 'text-muted')}>{r.title.length} chars</p></> }, { label: 'Description', render: (r: any) => <span className={cn('text-xs', r.meta_description.length > 165 ? 'text-amber-700' : 'text-muted')}>{r.meta_description.length} chars</span> }]} />
}
