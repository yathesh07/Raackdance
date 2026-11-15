import { Link } from 'react-router-dom'
import { ArrowUpRight, Ticket } from 'lucide-react'
import { useContent } from '@/lib/content'
import { eventsIntro } from '@/content/events'
import { Seo } from '@/components/Seo'
import { PageHero } from '@/components/Section'
import { Reveal, RevealLines } from '@/components/Motion'
import { Breadcrumbs } from '@/components/Breadcrumbs'

export default function Events() {
  const { events, general } = useContent()
  return (
    <>
      <Seo page="events" />
      <PageHero dark eyebrow="Events & experiences" title={['Get ready for a', 'dazzling showcase', <em key="t" className="text-accent">of talent & artistry.</em>]} intro={eventsIntro.frontRow}>
        <a href={general.ticketsUrl} target="_blank" rel="noreferrer" className="btn-primary"><Ticket className="h-4 w-4" />Book tickets</a>
      </PageHero>
      <div className="bg-night"><div className="container-x pb-6 [&_*]:!text-white/60"><Breadcrumbs items={[{ label: 'Events & Experiences' }]} /></div></div>
      <section className="bg-night pb-28 text-ivory">
        <div className="container-x space-y-6">
          {events.map((e, i) => (
            <Reveal key={e.slug}>
              <Link to={`/events/${e.slug}`} className="group grid overflow-hidden rounded-[2rem] border border-white/10 bg-night-2 transition hover:border-white/25 md:grid-cols-[1fr_1.2fr]">
                <div className={`relative aspect-[4/3] overflow-hidden bg-black md:aspect-auto ${i % 2 ? 'md:order-2' : ''}`}>
                  {e.video ? <video src={e.video} poster={e.poster ?? e.cover ?? undefined} muted loop playsInline autoPlay preload="none" className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-700 group-hover:opacity-100" />
                    : <img src={e.cover ?? ''} alt="" className="absolute inset-0 h-full w-full object-contain" />}
                </div>
                <div className="flex flex-col justify-between gap-10 p-8 sm:p-12">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className={`rounded-full px-3 py-1 font-semibold uppercase tracking-wider ${e.status === 'past' ? 'bg-white/10' : 'bg-accent'}`}>{e.status === 'past' ? 'Past event' : e.status === 'upcoming' ? 'Upcoming' : 'Announced'}</span>
                      <span className="text-white/60">{e.edition}</span>
                    </div>
                    <RevealLines lines={[e.name]} className="display-lg mt-5" />
                    <p className="mt-1 font-display text-xl italic text-white/60">{e.subtitle}</p>
                    <p className="mt-6 max-w-xl text-white/70">{e.summary}</p>
                  </div>
                  <div className="flex items-end justify-between gap-4 border-t border-white/10 pt-6 text-sm">
                    <div><p className="text-white/40">When</p><p className="font-semibold">{e.date_text}</p></div>
                    <div><p className="text-white/40">Where</p><p className="font-semibold">{e.venue}</p></div>
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-ink transition group-hover:bg-accent group-hover:text-white"><ArrowUpRight className="h-5 w-5" /></span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
