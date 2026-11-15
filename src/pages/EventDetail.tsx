import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { CalendarDays, MapPin, Ticket, Trophy } from 'lucide-react'
import { useContent } from '@/lib/content'
import { Seo } from '@/components/Seo'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Reveal, RevealLines } from '@/components/Motion'
import { Lightbox } from '@/components/Lightbox'
import { EnquiryForm } from '@/components/EnquiryForm'
import NotFound from './NotFound'

export default function EventDetail() {
  const { slug } = useParams()
  const { events } = useContent()
  const e = events.find((x) => x.slug === slug)
  const [lb, setLb] = useState<number | null>(null)
  if (!e) return <NotFound />
  const items = e.gallery.map((g, i) => ({ url: g, alt: `${e.name} photo ${i + 1}`, caption: `${e.name} — ${e.subtitle}` }))
  return (
    <>
      <Seo title={`${e.name} ${e.edition} — ${e.subtitle} | Raack Events`} description={e.summary} image={e.cover ?? undefined} />
      <section className="relative flex min-h-[90svh] items-end overflow-hidden bg-night text-ivory">
        {e.video ? <video src={e.video} poster={e.poster ?? undefined} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover opacity-35" aria-hidden />
          : <img src={e.cover ?? ''} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />}
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/75 to-night/30" />
        <div className="container-x relative pb-16 pt-40">
          <div className="[&_*]:!text-white/70"><Breadcrumbs items={[{ label: 'Events', to: '/events' }, { label: e.name }]} /></div>
          <Reveal><span className="eyebrow mt-8">{e.edition} · {e.status === 'past' ? 'Past event' : 'Upcoming'}</span></Reveal>
          <RevealLines as="h1" lines={[e.name]} className="display-xl mt-4" />
          <Reveal delay={0.15}><p className="mt-3 font-display text-2xl italic text-white/70">{e.subtitle}</p></Reveal>
          <Reveal delay={0.25}>
            <div className="mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
              <Fact icon={<CalendarDays className="h-4 w-4" />} k="Dates" v={e.date_text} />
              <Fact icon={<MapPin className="h-4 w-4" />} k="Venue" v={e.venue} />
              {e.stat && <Fact icon={<Trophy className="h-4 w-4" />} k={e.stat.label} v={e.stat.value} />}
            </div>
            {!e.dates_verified && e.status !== 'past' && <p className="mt-4 text-xs text-white/50">Dates and venue are provisional — stay tuned for confirmed details.</p>}
            <div className="mt-8 flex flex-wrap gap-3">
              {e.register && <a href="#register" className="btn-primary">Register</a>}
              {e.tickets_url && <a href={e.tickets_url} target="_blank" rel="noreferrer" className="btn-light"><Ticket className="h-4 w-4" />Book tickets</a>}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-5">{e.body.map((b, i) => <Reveal key={i} delay={i * 0.05}><p className={i === 0 ? 'font-display text-2xl leading-snug' : 'lead'}>{b}</p></Reveal>)}</div>
          <div className="space-y-6">
            {e.cover && <Reveal><img src={e.cover} alt={`${e.name} poster`} className="mx-auto max-h-[460px] w-auto rounded-3xl object-contain" loading="lazy" /></Reveal>}
          </div>
        </div>
      </section>

      {e.highlights.length > 0 && (
        <section className="bg-pearl section grain">
          <div className="container-x">
            <h2 className="display-lg">{e.slug === 'happy-feet' ? 'Why “Happy Feet”?' : 'Why attend?'}</h2>
            <div className="mt-12 grid gap-5 md:grid-cols-3">{e.highlights.map((h, i) => <Reveal key={h.title} delay={i * 0.08}><div className="card h-full p-8"><span className="font-display text-accent">0{i + 1}</span><h3 className="mt-4 font-display text-2xl">{h.title}</h3><p className="mt-3 text-muted">{h.body}</p></div></Reveal>)}</div>
          </div>
        </section>
      )}

      {(e.categories.length > 0 || e.judging.length > 0) && (
        <section className="section">
          <div className="container-x grid gap-10 md:grid-cols-2">
            {e.categories.length > 0 && <div className="card p-8"><p className="eyebrow">{e.categories.length} categories</p><h2 className="display-md mt-3">Competition categories</h2><ul className="mt-6 divide-y divide-line">{e.categories.map((c) => <li key={c} className="py-3 font-medium">{c}</li>)}</ul></div>}
            {e.judging.length > 0 && <div className="card p-8"><p className="eyebrow">Judging</p><h2 className="display-md mt-3">Our esteemed panel evaluates</h2><ul className="mt-6 divide-y divide-line">{e.judging.map((c) => <li key={c} className="py-3 font-medium">{c}</li>)}</ul></div>}
          </div>
        </section>
      )}

      {items.length > 0 && (
        <section className="dark-section section">
          <div className="container-x">
            <span className="eyebrow">Event gallery</span><h2 className="display-lg mt-4 text-ivory">Relive the exhilaration.</h2>
            <div className="mt-12 columns-2 gap-4 md:columns-3 lg:columns-4 [&>*]:mb-4">
              {items.map((it, i) => <button key={i} onClick={() => setLb(i)} className="block w-full overflow-hidden rounded-2xl" aria-label={`Open ${it.alt}`}><img src={it.url} alt={it.alt} loading="lazy" className="w-full transition duration-700 hover:scale-105" /></button>)}
            </div>
          </div>
          <Lightbox items={items} index={lb} onClose={() => setLb(null)} onIndex={setLb} />
        </section>
      )}

      {e.closing && <section className="section"><div className="container-x"><p className="mx-auto max-w-4xl text-center font-display text-[clamp(1.5rem,3vw,2.4rem)] leading-snug">{e.closing}</p></div></section>}

      {e.register && (
        <section className="bg-pearl section grain" id="register">
          <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.2fr]">
            <div><span className="eyebrow">Register</span><h2 className="display-lg mt-5">Register your interest for {e.name}.</h2><p className="lead mt-5">Share your details and our events team will get in touch with participation and ticket information.</p></div>
            <div className="card p-6 sm:p-10"><EnquiryForm type="event" lockType defaults={{ message: `I'm interested in ${e.name} ${e.edition}.` }} /></div>
          </div>
        </section>
      )}
    </>
  )
}
function Fact({ icon, k, v }: { icon: React.ReactNode; k: string; v: string }) {
  return <div className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur"><p className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/50">{icon}{k}</p><p className="mt-1 font-display text-xl">{v}</p></div>
}
