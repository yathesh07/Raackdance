import { Link, useParams } from 'react-router-dom'
import { ArrowRight, Check, Info } from 'lucide-react'
import { useContent, useProgram } from '@/lib/content'
import { Seo } from '@/components/Seo'
import { Reveal, RevealLines, Tilt } from '@/components/Motion'
import { YouTube } from '@/components/YouTube'
import { EnquiryForm } from '@/components/EnquiryForm'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ProgramCard } from '@/components/ProgramCard'
import { DAYS } from '@/lib/types'
import NotFound from './NotFound'

export default function ProgramDetail() {
  const { slug } = useParams()
  const p = useProgram(slug)
  const { programs, studios, testimonials } = useContent()
  if (!p) return <NotFound />
  const offering = studios.filter((s) => s.sessions.some((c) => c.program_slug === p.slug))
  const quote = testimonials.find((t) => t.program_slug === p.slug)
  const others = programs.filter((x) => x.slug !== p.slug).slice(0, 3)
  return (
    <>
      <Seo title={`${p.name} — ${p.age_group} | Raack Dance Programs`} description={`${p.tagline}. ${p.description.slice(0, 120)}…`} image={p.image ?? undefined}
        jsonLd={{ '@context': 'https://schema.org', '@type': 'Course', name: p.name, description: p.description, provider: { '@type': 'Organization', name: 'Raack Academy of Dance', sameAs: 'https://raackdance.com' } }} />
      <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40" style={{ background: `radial-gradient(70% 60% at 80% 40%, ${p.accent}26, transparent 70%), var(--color-pearl)` }}>
        <div className="container-x grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <Breadcrumbs items={[{ label: 'Programs', to: '/programs' }, { label: p.name }]} />
            {p.logo && <Reveal><img src={p.logo} alt={`${p.name} logo`} className="mt-8 h-20 w-auto object-contain sm:h-24" /></Reveal>}
            <RevealLines as="h1" lines={[p.name]} className="display-xl mt-6" />
            {p.aka && <p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-muted">{p.aka}</p>}
            <Reveal delay={0.1}><div className="mt-6 flex flex-wrap gap-2"><span className="chip" style={{ borderColor: p.accent, color: p.accent }}>Age: {p.age_group}</span>{p.levels.map((l) => <span key={l} className="chip">{l}</span>)}</div></Reveal>
            <Reveal delay={0.15}><p className="mt-6 font-display text-2xl italic text-charcoal">{p.tagline}</p></Reveal>
            <Reveal delay={0.2}><p className="lead mt-5 max-w-xl">{p.description}</p></Reveal>
            {p.notice && <Reveal delay={0.25}><p className="mt-5 flex max-w-xl items-start gap-2 rounded-xl bg-white/70 p-4 text-sm text-charcoal"><Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{p.notice}</p></Reveal>}
            <Reveal delay={0.3}><div className="mt-8 flex flex-wrap gap-3"><a href="#register" className="btn-primary">Register now</a><Link to={`/studios?program=${p.slug}`} className="btn-ghost">Studios offering {p.name}</Link></div></Reveal>
          </div>
          <Reveal delay={0.1}>
            <Tilt className="mx-auto max-w-lg rounded-[2rem]" max={6}>
              <img src={p.image ?? ''} alt={`${p.name} — ${p.tagline}`} className="w-full object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,.2)] [transform:translateZ(50px)]" />
            </Tilt>
          </Reveal>
        </div>
      </section>

      {p.outcomes.length > 0 && (
        <section className="section">
          <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div><span className="eyebrow">Learning outcomes</span><h2 className="display-lg mt-5">What to expect from this program</h2></div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {p.outcomes.map((o, i) => (
                <Reveal as="li" key={o} delay={i * 0.05} className="card flex items-start gap-4 p-5"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-white" style={{ background: p.accent }}><Check className="h-4 w-4" /></span><span className="pt-1 font-medium">{o}</span></Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {p.videos.length > 0 && (
        <section className="dark-section section">
          <div className="container-x">
            <span className="eyebrow">Watch shorts</span><h2 className="display-lg mt-5 text-ivory">{p.name} in motion</h2>
            <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
              {p.videos.map((v, i) => <Reveal key={v} delay={i * 0.08} className={i === 2 ? 'hidden md:block' : ''}><YouTube id={v} title={`${p.name} short ${i + 1}`} /></Reveal>)}
            </div>
          </div>
        </section>
      )}

      {quote && (
        <section className="section !pb-0">
          <div className="container-x"><figure className="card mx-auto max-w-4xl p-10 text-center"><blockquote className="font-display text-2xl leading-snug">“{quote.quote}”</blockquote><figcaption className="mt-6 text-sm text-muted"><strong className="text-ink">{quote.name}</strong>{quote.designation && ` · ${quote.designation}`}</figcaption></figure></div>
        </section>
      )}

      {offering.length > 0 && (
        <section className="section">
          <div className="container-x">
            <span className="eyebrow">Where to learn</span>
            <h2 className="display-md mt-4">{offering.length} studios list {p.name} classes</h2>
            <p className="mt-2 text-sm text-muted">Schedules as listed on our previous website — please confirm timings with the studio.</p>
            <div className="mt-8 flex flex-wrap gap-2">
              {offering.map((s) => {
                const days = [...new Set(s.sessions.filter((c) => c.program_slug === p.slug).map((c) => DAYS[c.day].slice(0, 3)))]
                return <Link key={s.slug} to={`/studios/${s.slug}`} className="chip hover:border-ink/40">{s.name}<span className="text-muted">{days.join(' · ')}</span></Link>
              })}
            </div>
          </div>
        </section>
      )}

      <section className="bg-pearl section grain" id="register">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div><span className="eyebrow">Register now</span><h2 className="display-lg mt-5">Start {p.name} with a free trial.</h2><p className="lead mt-5">Embark on your dance journey with Raack and let your dance story unfold.</p></div>
          <div className="card p-6 sm:p-10"><EnquiryForm type="trial" defaults={{ program_slug: p.slug }} /></div>
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <div className="flex items-end justify-between gap-6"><h2 className="display-md">Explore other programs</h2><Link to="/programs" className="btn-ghost hidden sm:inline-flex">All programs <ArrowRight className="h-4 w-4" /></Link></div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{others.map((o) => <ProgramCard key={o.slug} p={o} i={programs.indexOf(o)} />)}</div>
        </div>
      </section>
    </>
  )
}
