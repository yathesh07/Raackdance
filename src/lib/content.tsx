import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { buildSeed } from './seed'
import { repo } from './repo'
import { isSupabase } from './env'
import { localdb } from './localdb'
import type {
  BranchHeadRow, CareerRow, ClassSessionRow, EventRow, MediaRow, PageRow, ProgramRow, SettingRow, StudioRow, TeamRow, TestimonialRow,
} from './types'

export type StudioVM = StudioRow & { heads: BranchHeadRow[]; sessions: ClassSessionRow[] }
export type General = { phone: string; email: string; enquiryEmail: string; registrationNotice: string; ticketsUrl: string; whatsapp: string }
export type Content = {
  programs: ProgramRow[]; studios: StudioVM[]; events: EventRow[]; team: TeamRow[]; testimonials: TestimonialRow[]; media: MediaRow[]
  careers: CareerRow[]; general: General; stats: { value: number; suffix: string; label: string }[]; socials: { label: string; href: string }[]
  home: { heroLine1: string; heroLine2: string; heroIntro: string }; pages: Record<string, PageRow>; source: 'bundled' | 'live'
}

type Raw = {
  programs: ProgramRow[]; studios: StudioRow[]; branch_heads: BranchHeadRow[]; class_sessions: ClassSessionRow[]; team_members: TeamRow[]
  events: EventRow[]; testimonials: TestimonialRow[]; media: MediaRow[]; careers: CareerRow[]; site_settings: SettingRow[]; pages: PageRow[]
}

const pub = <T extends { published?: boolean }>(a: T[]) => a.filter((x) => x.published !== false)
const bySort = <T extends { sort?: number }>(a: T[]) => [...a].sort((x, y) => (x.sort ?? 0) - (y.sort ?? 0))

function build(raw: Raw, source: Content['source']): Content {
  const set = Object.fromEntries(raw.site_settings.map((s) => [s.key, s.value]))
  const heads = bySort(raw.branch_heads)
  const sessions = bySort(raw.class_sessions)
  return {
    programs: bySort(pub(raw.programs)),
    studios: bySort(pub(raw.studios))
      .filter((s) => s.status !== 'closed')
      .map((s) => ({ ...s, heads: heads.filter((h) => h.studio_id === s.id), sessions: sessions.filter((c) => c.studio_id === s.id) })),
    events: bySort(pub(raw.events)),
    team: bySort(pub(raw.team_members)),
    testimonials: bySort(pub(raw.testimonials)).filter((t) => t.consent_status !== 'withdrawn'),
    media: bySort(pub(raw.media)).filter((m) => m.consent_status !== 'withdrawn'),
    careers: bySort(pub(raw.careers)),
    general: set.general,
    stats: set.stats ?? [],
    socials: set.socials ?? [],
    home: set.home ?? { heroLine1: 'Dance as a', heroLine2: 'way of life.', heroIntro: '' },
    pages: Object.fromEntries(raw.pages.map((p) => [p.slug, p])),
    source,
  }
}

const seedContent = () => build(buildSeed() as unknown as Raw, 'bundled')
const Ctx = createContext<Content | null>(null)

async function fetchAll(): Promise<Raw> {
  const tables = ['programs', 'studios', 'branch_heads', 'class_sessions', 'team_members', 'events', 'testimonials', 'media', 'careers', 'site_settings', 'pages'] as const
  const res = await Promise.all(tables.map((t) => repo.list(t as any)))
  return Object.fromEntries(tables.map((t, i) => [t, res[i]])) as unknown as Raw
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<Content>(() => (isSupabase ? seedContent() : build(localRaw(), 'live')))
  useEffect(() => {
    if (isSupabase) {
      let alive = true
      fetchAll()
        .then((raw) => {
          if (!alive) return
          // Fall back to bundled content for any table that is empty (e.g. before seeding)
          const seed = buildSeed() as unknown as Raw
          const merged = Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, (v as unknown[]).length ? v : (seed as any)[k]])) as Raw
          setContent(build(merged, 'live'))
        })
        .catch((e) => console.warn('[content] using bundled content:', e?.message))
      return () => { alive = false }
    }
    return localdb.subscribe(() => setContent(build(localRaw(), 'live'))) as unknown as () => void
  }, [])
  return <Ctx.Provider value={content}>{children}</Ctx.Provider>
}

function localRaw(): Raw {
  return {
    programs: localdb.all('programs'), studios: localdb.all('studios'), branch_heads: localdb.all('branch_heads'),
    class_sessions: localdb.all('class_sessions'), team_members: localdb.all('team_members'), events: localdb.all('events'),
    testimonials: localdb.all('testimonials'), media: localdb.all('media'), careers: localdb.all('careers'),
    site_settings: localdb.all('site_settings'), pages: localdb.all('pages'),
  }
}

export function useContent() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useContent outside ContentProvider')
  return c
}

export function useProgram(slug?: string) {
  const { programs } = useContent()
  return useMemo(() => programs.find((p) => p.slug === slug), [programs, slug])
}
