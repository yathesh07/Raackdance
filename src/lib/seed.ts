// Converts the migrated content (src/content) into database rows.
// Used to seed demo LocalDB in the browser and by scripts/generate-seed.mjs for Supabase.
import { programs } from '@/content/programs'
import { events } from '@/content/events'
import studiosJson from '@/content/studios.json'
import { coreTeam, testimonials, careers, franchise, site } from '@/content/site'
import type {
  ProgramRow, StudioRow, BranchHeadRow, ClassSessionRow, TeamRow, EventRow, TestimonialRow, MediaRow, CareerRow, SettingRow, PageRow,
} from './types'

export type StudioSeed = {
  slug: string; legacySlug: string; name: string; city: string; address: string; phones: string[]; email: string; lat: number | null; lng: number | null
  mapsEmbed: string | null; hero: string | null; isHeadOffice: boolean; branchHeads: { name: string; photo: string }[]
  schedule: { day: number; program: string; label: string; time: string }[]; scheduleVerified: boolean; status: string; flags: string[]
}
export const studiosSeed = studiosJson as StudioSeed[]

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export function buildSeed() {
  const programRows: ProgramRow[] = programs.map((p) => ({
    id: `prog-${p.slug}`, slug: p.slug, name: p.name, aka: p.aka ?? null, age_group: p.ageGroup, audience: p.audience, tagline: p.tagline,
    description: p.description, outcomes: p.outcomes, levels: p.levels ?? [], videos: p.videos, logo: p.logo, logo_mono: p.logoMono ?? null,
    image: p.image, accent: p.accent, notice: p.notice ?? null, sort: p.sort, published: p.published,
  }))

  const studioRows: StudioRow[] = []
  const headRows: BranchHeadRow[] = []
  const sessionRows: ClassSessionRow[] = []
  studiosSeed.forEach((s, i) => {
    const id = `studio-${s.slug}`
    studioRows.push({
      id, slug: s.slug, legacy_slug: s.legacySlug, name: s.name, city: s.city, address: s.address, phones: s.phones, email: s.email,
      lat: s.lat, lng: s.lng, maps_embed: s.mapsEmbed, hero: s.hero, is_head_office: s.isHeadOffice, status: 'unverified',
      schedule_verified: false, notes: s.flags.join('\n') || null, published: true, sort: i,
    })
    s.branchHeads.forEach((h, j) => headRows.push({ id: `${id}-head-${j}`, studio_id: id, name: h.name, photo: h.photo, sort: j }))
    s.schedule.forEach((c, j) =>
      sessionRows.push({ id: `${id}-cls-${j}`, studio_id: id, day: c.day, program_slug: c.program, label: c.label, time_text: c.time, sort: j }),
    )
  })

  const teamRows: TeamRow[] = coreTeam.map((t, i) => ({ id: `team-${slugify(t.name)}`, ...t, sort: i, published: true }))

  const eventRows: EventRow[] = events.map((e, i) => ({
    id: `event-${e.slug}`, slug: e.slug, name: e.name, subtitle: e.subtitle, edition: e.edition, status: e.status, date_text: e.dateText,
    venue: e.venue, dates_verified: e.datesVerified, summary: e.summary, body: e.body, highlights: e.highlights ?? [], categories: e.categories ?? [],
    judging: e.judging ?? [], stat: e.stat ?? null, cover: e.cover, poster: e.poster ?? null, video: e.video ?? null, gallery: e.gallery,
    tickets_url: e.ticketsUrl ?? null, register: e.register, closing: e.closing ?? null, sort: i, published: true,
  }))

  const testimonialRows: TestimonialRow[] = [
    ...testimonials.map((t, i) => ({
      id: `t-student-${slugify(t.name)}`, kind: 'student' as const, name: t.name, designation: t.designation ?? null, studio: null,
      program_slug: t.program ?? null, quote: t.quote, photo: t.photo, consent_status: 'unknown' as const, published: true, sort: i,
    })),
    ...franchise.owners.map((o, i) => ({
      id: `t-franchise-${slugify(o.name)}`, kind: 'franchise' as const, name: o.name, designation: 'Franchise Partner', studio: o.studio,
      program_slug: null, quote: o.quote, photo: o.photo, consent_status: 'unknown' as const, published: true, sort: i,
    })),
    ...careers.teamVoices.map((o, i) => ({
      id: `t-staff-${slugify(o.name)}`, kind: 'staff' as const, name: o.name, designation: 'Raack Team', studio: null,
      program_slug: null, quote: o.quote, photo: o.photo, consent_status: 'unknown' as const, published: true, sort: i,
    })),
  ]

  const media: MediaRow[] = []
  const addMedia = (url: string, category: string, alt: string, extra: Partial<MediaRow> = {}) =>
    media.push({
      id: `media-${media.length + 1}`, url, kind: url.endsWith('.mp4') ? 'video' : 'image', alt, caption: extra.caption ?? null, category,
      event_slug: extra.event_slug ?? null, studio_slug: extra.studio_slug ?? null, consent_status: 'unknown', published: true, sort: media.length,
    })
  events.forEach((e) => {
    addMedia(e.cover, 'events', `${e.name} ${e.edition} poster`, { event_slug: e.slug, caption: `${e.name} — ${e.subtitle}` })
    if (e.slug === 'heal-the-world')
      e.gallery.forEach((g, i) => addMedia(g, 'performances', `Heal The World flash mob at VR Mall Chennai, photo ${i + 1}`, { event_slug: e.slug, caption: 'Heal The World — Tribute to Michael Jackson' }))
  })
  ;['dance-classes-in-chennai', 'dance-academy-in-chennai', 'dance-classes-for-kids-in-chennai', 'dance-classes-for-adults-in-chennai'].forEach((n, i) =>
    addMedia(`/media/gallery/${n}.webp`, 'performances', `Raack students performing on stage, highlight ${i + 1}`, { caption: 'Raack on stage' }),
  )
  programs.forEach((p) => addMedia(p.image, 'programs', `${p.name} program artwork`, { caption: `${p.name} · ${p.ageGroup}` }))
  addMedia('/media/faculties/header.webp', 'workshops', 'Raack instructor teaching young students in the studio', { caption: 'Faculty in action' })
  addMedia('/media/682x674.webp', 'academy-life', 'Raack dancers in colourful motion', { caption: 'Movement-based art' })
  addMedia('/media/gif/banner.webp', 'academy-life', 'Step into greatness — Raack kids dancing', { caption: 'Step into greatness' })
  studiosSeed.forEach((s) => s.hero && addMedia(s.hero, 'studios', `Raack ${s.name} studio`, { studio_slug: s.slug, caption: `Raack ${s.name}` }))

  const careerRows: CareerRow[] = careers.positions.map((c, i) => ({
    id: `career-${slugify(c.title)}`, title: c.title, type: c.type, summary: c.summary, requirements: c.requirements, apply: c.apply ?? null, published: true, sort: i,
  }))

  const settings: SettingRow[] = [
    { key: 'general', value: { phone: site.phone, email: site.email, enquiryEmail: site.enquiryEmail, registrationNotice: site.registrationNotice, ticketsUrl: site.ticketsUrl, whatsapp: '' } },
    { key: 'stats', value: site.stats },
    { key: 'socials', value: site.socials },
    { key: 'home', value: { heroLine1: 'Dance as a', heroLine2: 'way of life.', heroIntro: site.mission } },
  ]

  const pages: PageRow[] = PAGE_META.map((p) => ({ ...p, heading: null, intro: null, published: true }))

  return {
    programs: programRows, studios: studioRows, branch_heads: headRows, class_sessions: sessionRows, team_members: teamRows,
    events: eventRows, testimonials: testimonialRows, media, careers: careerRows, site_settings: settings, pages,
  }
}

export const PAGE_META: { slug: string; title: string; meta_description: string }[] = [
  { slug: 'home', title: 'Raack Academy of Dance — Dance Classes for Kids & Adults in Chennai and South India', meta_description: 'Raack Academy of Dance: 45+ studios across Chennai and South India. Programs for toddlers, kids, teens and adults — Little Legends, RDEP, Choreo Lab, Film Covers, Dance Fitness. Book a free trial.' },
  { slug: 'about', title: 'About Raack — The Amplifiers of Dance as a Way of Life', meta_description: 'Raack is an independent dance academy for kids and adults. Meet our founder Ramana Balaji and core team, and discover our philosophy of movement-based art.' },
  { slug: 'programs', title: 'Dance Programs for Toddlers, Kids, Teens & Adults | Raack', meta_description: 'Explore Raack dance programs: Little Legends (3–5.5 yrs), Level Up (5.5–7), RDEP (7–12), Choreo Lab, Film Covers and Dance Fitness for adults.' },
  { slug: 'studios', title: 'Find a Raack Dance Studio Near You | 45+ Studios', meta_description: 'Find your nearest Raack Academy of Dance studio in Chennai, Puducherry, Cuddalore, Chidambaram, Thanjavur, Kumbakonam, Trichy and Bengaluru. Addresses, phone numbers and class schedules.' },
  { slug: 'events', title: 'Events & Experiences — Happy Feet, First Step, Camp Raack | Raack', meta_description: "Raack's signature events: Happy Feet in-house contest, First Step annual recital, Camp Raack choreo camp and the Heal The World flash mob." },
  { slug: 'faculty-academy', title: 'Faculties Training Academy — Become a Dance Coach | Raack', meta_description: "Raack's Faculties Training Academy trains dance coaches and mentors in technique, teaching methodology, choreography and communication." },
  { slug: 'gallery', title: 'Gallery — Performances, Events & Studios | Raack Academy of Dance', meta_description: 'Photos and videos from Raack performances, events, programs and studios.' },
  { slug: 'careers', title: 'Careers at Raack — Instructor, Counsellor, Branch Manager & More', meta_description: 'Join the Raack Dance Academy team. Open roles: Instructor, Counsellor, Branch Manager, Designer and Video Editor.' },
  { slug: 'franchise', title: 'Open a Raack Dance Studio — Franchise Opportunities', meta_description: 'Start your own Raack dance studio at low investment, backed by an established brand, training, operations support and an exclusive territory.' },
  { slug: 'contact', title: 'Contact Raack Academy of Dance', meta_description: 'Call +91 90030 24113 or send an enquiry. Find your nearest Raack studio across Chennai and South India.' },
  { slug: 'book-a-free-trial', title: 'Book a Free Trial Dance Class | Raack', meta_description: 'Book a free trial class at your nearest Raack studio.' },
]
