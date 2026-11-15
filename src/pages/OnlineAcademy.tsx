import { Globe2, Laptop, Users, Sparkles, CalendarClock } from 'lucide-react'
import { onlineAcademy } from '@/content/site'
import { Seo } from '@/components/Seo'
import { PageHero, SectionHeading } from '@/components/Section'
import { Reveal, Tilt } from '@/components/Motion'
import { EnquiryForm } from '@/components/EnquiryForm'
import { Breadcrumbs } from '@/components/Breadcrumbs'

const ICONS = [Globe2, Sparkles, Users, Laptop, CalendarClock]

export default function OnlineAcademy() {
  return (
    <>
      <Seo page="online-academy" />
      <PageHero eyebrow="Online Academy" title={['Connecting Tamils', 'globally through', <em key="a" className="text-accent">the art of dance.</em>]} intro={onlineAcademy.intro} image="/media/courses/course-7.webp">
        <a href="#trial" className="btn-primary">Register for a free online trial</a>
      </PageHero>
      <div className="container-x pt-6"><Breadcrumbs items={[{ label: 'Online Academy' }]} /></div>
      <section className="section">
        <div className="container-x">
          <SectionHeading eyebrow="Now at your home" title={['Raack Academy of Dance —', 'wherever you are.']} intro="Why choose Raack Academy's online dance classes?" />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {onlineAcademy.features.map((f, i) => {
              const I = ICONS[i]
              return (
                <Reveal key={f.title} delay={i * 0.06}>
                  <Tilt className="h-full rounded-3xl"><div className="card h-full p-6"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent-soft text-accent"><I className="h-5 w-5" /></span><h3 className="mt-6 font-display text-xl">{f.title}</h3><p className="mt-2 text-sm text-muted">{f.body}</p></div></Tilt>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>
      <section className="dark-section section">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <Reveal><p className="font-display text-[clamp(1.6rem,3vw,2.6rem)] leading-tight">{onlineAcademy.belief}</p></Reveal>
          <div className="space-y-6">
            <Reveal delay={0.1}><p className="lead text-ivory/70">{onlineAcademy.closing}</p></Reveal>
            <Reveal delay={0.15}><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-ivory/50">Class formats</p><div className="mt-3 flex flex-wrap gap-2">{onlineAcademy.classTypes.map((c) => <span key={c} className="rounded-full border border-white/15 px-4 py-2 text-sm">{c}</span>)}</div></div></Reveal>
            <Reveal delay={0.2}><div className="rounded-2xl border border-white/10 p-6"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Event support</p><p className="mt-2 text-ivory/70">{onlineAcademy.eventSupport}</p></div></Reveal>
          </div>
        </div>
      </section>
      <section className="bg-pearl section grain" id="trial">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div><span className="eyebrow">Register for free trial class</span><h2 className="display-lg mt-5">Unlock your dance potential.</h2><p className="lead mt-5">{onlineAcademy.trialCopy}</p></div>
          <div className="card p-6 sm:p-10"><EnquiryForm type="online" lockType /></div>
        </div>
      </section>
    </>
  )
}
