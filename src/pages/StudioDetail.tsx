import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Clock, Mail, MapPin, Navigation, Phone } from 'lucide-react'
import { useContent } from '@/lib/content'
import { Seo } from '@/components/Seo'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Reveal, RevealLines } from '@/components/Motion'
import { EnquiryForm } from '@/components/EnquiryForm'
import { DAYS } from '@/lib/types'
import { cn, fmtPhone, telHref } from '@/lib/utils'
import { env } from '@/lib/env'
import NotFound from './NotFound'

export default function StudioDetail() {
  const { slug } = useParams()
  const { studios, programs } = useContent()
  const s = studios.find((x) => x.slug === slug)
  const [prog, setProg] = useState('')
  const byDay = useMemo(() => DAYS.map((_, d) => (s?.sessions ?? []).filter((c) => c.day === d && (!prog || c.program_slug === prog))), [s, prog])
  if (!s) return <NotFound />
  const offered = programs.filter((p) => s.sessions.some((c) => c.program_slug === p.slug))
  const directions = s.lat ? `https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Raack Academy of Dance ' + s.address)}`
  const ld = {
    '@context': 'https://schema.org', '@type': 'DanceSchool', name: `Raack Academy of Dance — ${s.name}`, url: `${env.siteUrl}/studios/${s.slug}`,
    parentOrganization: { '@type': 'Organization', name: 'Raack Academy of Dance', url: env.siteUrl },
    address: { '@type': 'PostalAddress', streetAddress: s.address, addressLocality: s.city, addressCountry: 'IN' },
    ...(s.lat ? { geo: { '@type': 'GeoCoordinates', latitude: s.lat, longitude: s.lng } } : {}),
    ...(s.phones[0] ? { telephone: `+91${s.phones[0]}` } : {}),
    ...(s.hero ? { image: env.siteUrl + s.hero } : {}),
  }
  return (
    <>
      <Seo title={`Dance Classes in ${s.name}, ${s.city} | Raack Academy of Dance`} description={`Raack ${s.name}: ${s.address}. Programs: ${offered.map((p) => p.name).join(', ') || 'contact studio'}. Call ${s.phones[0] ? fmtPhone(s.phones[0]) : '+91 90030 24113'} to book a free trial.`} image={s.hero ?? undefined} jsonLd={ld} />
      <section className="relative overflow-hidden bg-night pt-32 pb-16 text-ivory sm:pt-40">
        {s.hero && <img src={s.hero} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />}
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/70 to-night/30" />
        <div className="container-x relative">
          <div className="[&_*]:!text-white/70"><Breadcrumbs items={[{ label: 'Studios', to: '/studios' }, { label: s.name }]} /></div>
          <Reveal><span className="eyebrow mt-8">{s.city}{s.is_head_office && ' · Head office studio'}</span></Reveal>
          <RevealLines as="h1" lines={['Raack', s.name]} className="display-xl mt-4" />
          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-wrap gap-3">
              {s.phones[0] && <a href={telHref(s.phones[0])} className="btn-primary"><Phone className="h-4 w-4" />Call {fmtPhone(s.phones[0])}</a>}
              <a href={directions} target="_blank" rel="noreferrer" className="btn-light"><Navigation className="h-4 w-4" />Directions</a>
              <a href="#enquire" className="btn-light">Book a free trial</a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section !pt-14">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div className="space-y-5">
            <div className="card p-6">
              <h2 className="font-display text-2xl">Studio details</h2>
              <ul className="mt-5 space-y-4 text-sm">
                <li className="flex gap-3"><MapPin className="h-5 w-5 shrink-0 text-accent" /><span>{s.address}</span></li>
                {s.phones.map((p) => <li key={p} className="flex gap-3"><Phone className="h-5 w-5 shrink-0 text-accent" /><a href={telHref(p)} className="font-semibold hover:text-accent">{fmtPhone(p)}</a></li>)}
                {s.email && <li className="flex gap-3"><Mail className="h-5 w-5 shrink-0 text-accent" /><a href={`mailto:${s.email}`} className="hover:text-accent">{s.email}</a></li>}
              </ul>
              {s.status !== 'active' && <p className="mt-5 rounded-xl bg-pearl p-3 text-xs text-muted">Details migrated from our previous website and being re-verified — please call before visiting.</p>}
            </div>
            {s.heads.length > 0 && (
              <div className="card p-6">
                <h2 className="font-display text-2xl">Branch head{s.heads.length > 1 && 's'}</h2>
                <div className="mt-5 flex flex-wrap gap-5">
                  {s.heads.map((h) => (
                    <div key={h.id} className="flex items-center gap-3">
                      {h.photo && <img src={h.photo} alt={h.name} loading="lazy" className="h-16 w-16 rounded-full bg-pearl object-cover" />}
                      <p className="font-semibold">{h.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {offered.length > 0 && (
              <div className="card p-6">
                <h2 className="font-display text-2xl">Programs here</h2>
                <div className="mt-4 flex flex-wrap gap-2">{offered.map((p) => <Link key={p.slug} to={`/programs/${p.slug}`} className="chip hover:border-ink/40" style={{ borderColor: p.accent + '66' }}>{p.name}</Link>)}</div>
              </div>
            )}
          </div>
          <div className="overflow-hidden rounded-3xl border border-line bg-pearl shadow-[var(--shadow-soft)]">
            {s.maps_embed ? (
              <iframe title={`Map of Raack ${s.name}`} src={s.maps_embed} className="h-full min-h-[420px] w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            ) : s.lat ? (
              <iframe title={`Map of Raack ${s.name}`} className="h-full min-h-[420px] w-full" loading="lazy" src={`https://www.openstreetmap.org/export/embed.html?bbox=${s.lng! - 0.01}%2C${s.lat - 0.007}%2C${s.lng! + 0.01}%2C${s.lat + 0.007}&layer=mapnik&marker=${s.lat}%2C${s.lng}`} />
            ) : null}
          </div>
        </div>
      </section>

      {s.sessions.length > 0 && (
        <section className="bg-pearl section grain">
          <div className="container-x">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div><span className="eyebrow"><Clock className="h-3.5 w-3.5" />Class schedule</span><h2 className="display-lg mt-4">Weekly timetable</h2><p className="mt-2 text-sm text-muted">As listed on our previous website — please confirm with the studio.</p></div>
              <select aria-label="Filter by program" value={prog} onChange={(e) => setProg(e.target.value)} className="field !w-auto"><option value="">All programs</option>{offered.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}</select>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
              {DAYS.map((d, i) => (
                <div key={d} className="rounded-2xl border border-line bg-white p-4">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">{d}</h3>
                  <ul className="mt-3 space-y-2">
                    {byDay[i].length ? byDay[i].map((c) => {
                      const p = programs.find((x) => x.slug === c.program_slug)
                      return <li key={c.id} className={cn('rounded-xl border-l-4 bg-pearl/70 p-2.5')} style={{ borderColor: p?.accent ?? '#999' }}><p className="text-[0.8rem] font-semibold leading-tight">{c.label}</p><p className="text-xs text-muted">{c.time_text}</p></li>
                    }) : <li className="text-xs text-muted">—</li>}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section" id="enquire">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div><span className="eyebrow">Visit Raack {s.name}</span><h2 className="display-lg mt-5">Book a free trial at this studio.</h2><p className="lead mt-5">Our counsellor at {s.name} will call you back to fix a convenient slot.</p></div>
          <div className="card p-6 sm:p-10"><EnquiryForm type="trial" defaults={{ studio_slug: s.slug }} /></div>
        </div>
      </section>
    </>
  )
}
