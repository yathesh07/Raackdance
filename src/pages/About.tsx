import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useContent } from '@/lib/content'
import { about } from '@/content/site'
import { Seo } from '@/components/Seo'
import { PageHero, SectionHeading } from '@/components/Section'
import { Counter, Parallax, Reveal, RevealLines } from '@/components/Motion'
import { BigCTA } from '@/components/CTA'
import { Breadcrumbs } from '@/components/Breadcrumbs'

export default function About() {
  const { team, stats } = useContent()
  return (
    <>
      <Seo page="about" />
      <PageHero eyebrow="About Raack" title={['The Amplifiers', 'of Dance as a', <em key="w" className="text-accent">Way of Life.</em>]} intro={about.intro} image="/media/682x674.webp">
        <Link to="/programs" className="btn-dark">Explore programs</Link><Link to="/book-a-free-trial" className="btn-ghost">Book a free trial</Link>
      </PageHero>
      <div className="container-x pt-6"><Breadcrumbs items={[{ label: 'About Raack' }]} /></div>

      <section className="section">
        <div className="container-x grid gap-14 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] bg-night shadow-[var(--shadow-float)]">
              <video src={about.promoVideo} poster={about.promoPoster} controls preload="none" playsInline className="aspect-video w-full object-cover" aria-label="About Raack promo video" />
            </div>
          </Reveal>
          <div>
            <SectionHeading eyebrow="RAACK" title={['Rhythm. Body language.', 'Dynamics. Creativity.', 'Self expression.']} intro="Igniting passion, creativity, and the love for movement in every dancer." />
            <div className="mt-10 grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="card p-5"><p className="font-display text-4xl"><Counter to={s.value} suffix={s.suffix} /></p><p className="mt-1 text-sm text-muted">{s.label}</p></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-pearl section grain">
        <div className="container-x grid gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <Reveal><span className="eyebrow">{about.philosophyTitle}</span></Reveal>
            <RevealLines lines={['Dance is fluid', 'like water.', <em key="s" className="text-accent">Style is the vessel.</em>]} className="display-lg mt-5" />
            <Reveal delay={0.2}><p className="lead mt-7">{about.philosophy}</p></Reveal>
            <Reveal delay={0.3}><p className="mt-8 border-l-2 border-accent pl-5 font-display text-2xl italic">{about.philosophyLine}</p></Reveal>
          </div>
          <Parallax offset={60}><img src={about.philosophyImage} alt="Dance styles in vessels" loading="lazy" className="mx-auto max-w-md drop-shadow-2xl" /></Parallax>
        </div>
      </section>

      <section className="section" id="team">
        <div className="container-x">
          <SectionHeading eyebrow="The core team" title={['The people behind', 'the movement.']} />
          <div className="mt-16 space-y-24">
            {team.map((m, i) => (
              <div key={m.id} className={`grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] ${i % 2 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                <Reveal>
                  <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[2rem] bg-gradient-to-b from-pearl to-sand">
                    <img src={m.photo ?? ''} alt={`${m.name}, ${m.role}`} loading="lazy" className="absolute inset-x-0 bottom-0 mx-auto h-[92%] object-contain" />
                  </div>
                </Reveal>
                <div>
                  <Reveal><p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{m.role}</p></Reveal>
                  <RevealLines lines={[m.name]} className="display-md mt-3" />
                  <Reveal delay={0.15}><p className="mt-6 font-display text-xl leading-relaxed text-charcoal">“{m.vision}”</p></Reveal>
                  <Reveal delay={0.2}><p className="mt-5 leading-relaxed text-muted">{m.body}</p></Reveal>
                </div>
              </div>
            ))}
          </div>
          <Reveal><div className="mt-24 flex flex-wrap items-center justify-between gap-6 rounded-3xl border border-line p-8"><p className="font-display text-2xl">Want to teach the Raack way?</p><Link to="/faculty-academy" className="btn-dark">Faculty Training Academy <ArrowRight className="h-4 w-4" /></Link></div></Reveal>
        </div>
      </section>
      <BigCTA body={about.signUpCopy} />
    </>
  )
}
