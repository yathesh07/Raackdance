import { lazy, Suspense, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, MapPin, Quote, Search, Sparkles } from 'lucide-react'
import Hero3D from '@/three/Hero3D'
import { useContent } from '@/lib/content'
import { about } from '@/content/site'
import { Seo } from '@/components/Seo'
import { Counter, Magnetic, Parallax, Reveal, RevealLines, Tilt } from '@/components/Motion'
import { SectionHeading } from '@/components/Section'
import { ProgramCard } from '@/components/ProgramCard'
import { LazyEnquiryForm as EnquiryForm } from '@/components/LazyEnquiryForm'
import { env } from '@/lib/env'

const StudioMap = lazy(() => import('@/components/StudioMap'))

export default function Home() {
  const c = useContent()
  return (
    <>
      <Seo page="home" jsonLd={orgLd(c.socials.map((s) => s.href), c.general.phone)} />
      <Hero />
      <Intro />
      <Philosophy />
      <Programs />
      <WhyRaack />
      <StudioFinder />
      <Leadership />
      <Events />
      <GalleryStrip />
      <Testimonials />
      <Trial />
    </>
  )
}

function orgLd(sameAs: string[], phone: string) {
  return {
    '@context': 'https://schema.org', '@type': 'DanceSchool', name: 'Raack Academy of Dance', alternateName: 'Raack',
    url: env.siteUrl, logo: `${env.siteUrl}/media/logo.png`, telephone: phone.replace(/\s/g, ''), sameAs,
    slogan: 'The Amplifiers of Dance As a Way of Life in South India',
  }
}

function Hero() {
  const { home, general, events } = useContent()
  const next = events.find((e) => e.status === 'upcoming')
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ivory grain">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_70%_30%,#fff_0%,transparent_60%),radial-gradient(60%_50%_at_10%_90%,#f3e3d8_0%,transparent_70%)]" />
      <Hero3D />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-full bg-[linear-gradient(90deg,rgba(250,247,242,.92)_0%,rgba(250,247,242,.75)_38%,rgba(250,247,242,0)_65%)] max-md:bg-[linear-gradient(180deg,rgba(250,247,242,.6)_0%,rgba(250,247,242,.85)_55%,rgba(250,247,242,.4)_100%)]" />
      <div className="container-x relative flex flex-1 flex-col justify-center pt-32 pb-10 sm:pt-36">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.8 }}>
          <span className="chip border-accent/20 bg-white/70 backdrop-blur"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />{general.registrationNotice}</span>
        </motion.div>
        <h1 className="mt-7 max-w-5xl font-display text-[clamp(3.3rem,10vw,9.5rem)] font-[380] leading-[0.88] tracking-[-0.045em]" style={{ perspective: 1000 }}>
          {[home.heroLine1, home.heroLine2].map((l, i) => (
            <span key={i} className="-mb-[0.16em] block overflow-hidden pb-[0.22em] pr-[0.08em]">
              <motion.span className={`block origin-bottom ${i === 1 ? 'italic text-accent' : ''}`}
                initial={{ y: '110%', rotateX: -80 }} animate={{ y: '0%', rotateX: 0 }} transition={{ delay: 0.25 + i * 0.15, duration: 1.3, ease: [0.16, 1, 0.3, 1] }}>
                {l}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.div className="mt-8 grid max-w-xl gap-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, duration: 1 }}>
          <p className="text-lg leading-relaxed text-charcoal sm:text-xl">{home.heroIntro} <span className="text-muted">The Amplifiers of Dance as a way of life in South India.</span></p>
          <div className="flex flex-wrap gap-3">
            <Magnetic><Link to="/book-a-free-trial" className="btn-primary !px-7 !py-4 text-base">Book a Free Trial <ArrowUpRight className="h-5 w-5" /></Link></Magnetic>
            <Magnetic><Link to="/studios" className="btn-ghost !px-7 !py-4 text-base"><MapPin className="h-4 w-4" />Find a Studio</Link></Magnetic>
          </div>
        </motion.div>
      </div>

      {next && (
        <motion.div className="absolute bottom-28 right-6 hidden w-64 lg:block xl:right-12" initial={{ opacity: 0, y: 40, rotate: 4 }} animate={{ opacity: 1, y: 0, rotate: -2 }} transition={{ delay: 1.1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}>
          <Tilt className="rounded-2xl">
            <Link to={`/events/${next.slug}`} className="group block overflow-hidden rounded-2xl border border-white/60 bg-white/70 p-2 shadow-[var(--shadow-float)] backdrop-blur-xl">
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-night">
                {next.video ? <video src={next.video} poster={next.poster ?? undefined} muted autoPlay loop playsInline preload="metadata" className="h-full w-full object-cover" /> : <img src={next.cover ?? ''} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="flex items-center justify-between px-2 pb-1 pt-3">
                <div><p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-accent">Up next · {next.date_text}</p><p className="font-display text-lg">{next.name}</p></div>
                <ArrowUpRight className="h-5 w-5 transition group-hover:rotate-45" />
              </div>
            </Link>
          </Tilt>
        </motion.div>
      )}

      <div className="relative border-t border-ink/10 bg-white/40 backdrop-blur-md">
        <div className="container-x flex items-center justify-between gap-6 overflow-x-auto py-5 text-sm">
          {['Rhythm-frenzy', 'Body language', 'Dynamics', 'Creativity', 'Self expression'].map((w, i) => (
            <motion.span key={w} className="flex shrink-0 items-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 + i * 0.1 }}>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-ink font-display text-base text-ivory">{'RAACK'[i]}</span>
              <span className="font-medium text-charcoal">{w}</span>
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  )
}

function Intro() {
  const { stats } = useContent()
  return (
    <section className="section">
      <div className="container-x">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div className="relative">
            <Parallax offset={50} className="relative aspect-square">
              <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle,#ec1d2522,transparent_70%)]" />
              <img src={about.introImage} alt="Raack dancers expressing movement in colour" loading="lazy" className="relative h-full w-full object-contain" />
            </Parallax>
          </div>
          <div>
            <SectionHeading eyebrow="About Raack" title={['The Amplifiers of Dance', 'as a Way of Life', 'in South India']} intro={about.intro} />
            <Reveal delay={0.2}><Link to="/about" className="btn-dark mt-9">Our story <ArrowRight className="h-4 w-4" /></Link></Reveal>
          </div>
        </div>
        <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="bg-ivory p-7 sm:p-10">
              <p className="font-display text-[clamp(1.9rem,3.6vw,3.5rem)] leading-none tracking-tight"><Counter to={s.value} suffix={s.suffix} /></p>
              <p className="mt-3 text-sm text-muted">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Philosophy() {
  return (
    <section className="relative overflow-hidden bg-pearl section grain">
      <div className="container-x grid items-center gap-14 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          <Reveal><span className="eyebrow">Our philosophy</span></Reveal>
          <RevealLines lines={['Think of dance as', <em key="w" className="text-accent">fluid like water</em>, 'and style as its vessel.']} className="display-lg mt-5" />
          <Reveal delay={0.2}><p className="lead mt-7 max-w-xl">{about.philosophy}</p></Reveal>
          <Reveal delay={0.3}><p className="mt-8 border-l-2 border-accent pl-5 font-display text-2xl italic text-charcoal">{about.philosophyLine}</p></Reveal>
        </div>
        <div className="order-1 lg:order-2">
          <Parallax offset={70}><img src={about.philosophyImage} alt="Dance styles as vessels — hip hop, salsa, ballet, Bharatanatyam, contemporary, kathak" loading="lazy" className="mx-auto w-full max-w-lg object-contain drop-shadow-[0_40px_50px_rgba(0,0,0,.15)]" /></Parallax>
        </div>
      </div>
    </section>
  )
}

function Programs() {
  const { programs } = useContent()
  return (
    <section className="section" id="programs">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading eyebrow={`${programs.length} programs`} title={['Tailored to every', 'stage of your journey']} intro="Whether you're a beginner taking your first steps or an experienced dancer looking to refine your skills, we have something for you." />
          <Reveal><Link to="/programs" className="btn-ghost">All programs <ArrowRight className="h-4 w-4" /></Link></Reveal>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programs.slice(0, 6).map((p, i) => <Reveal key={p.slug} delay={(i % 3) * 0.08}><ProgramCard p={p} i={i} /></Reveal>)}
        </div>
      </div>
    </section>
  )
}

function WhyRaack() {
  const { stats } = useContent()
  const studios = stats.find((s) => /studio/i.test(s.label))
  const items = [
    { k: '01', t: 'A curriculum built on self-expression', b: 'Every program is designed to unlock the innate potential within each dancer — elevating skills to international standards while honouring our cultural roots.' },
    { k: '02', t: 'Uniquely curated levels & original music', b: "RDEP's curated levels and Raack's copyrighted music take dancers from rhythm and body language to the meaning behind every movement." },
    { k: '03', t: 'Coaches trained in-house', b: 'Our Faculties Training Academy equips instructors with versatile teaching methods, expert technique and tailored creativity for every age group.' },
    { k: '04', t: 'A stage for every dancer', b: 'From Happy Feet to the First Step annual recital, students perform, compete and grow in confidence on real stages.' },
    { k: '05', t: 'Safe, welcoming studios', b: 'Our counsellors guide families to the right course, in a secure and welcoming environment for parents and students alike.' },
    { k: '06', t: `${studios ? studios.value + studios.suffix : '45+'} studios near you`, b: 'Studios across Chennai, Puducherry, Cuddalore, Chidambaram, Thanjavur, Kumbakonam, Tiruchirappalli and Bengaluru.' },
  ]
  return (
    <section className="dark-section section relative overflow-hidden">
      <div className="pointer-events-none absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-accent/15 blur-[140px]" />
      <div className="container-x relative">
        <SectionHeading dark eyebrow="Why Raack" title={['The magic behind', 'the movement.']} />
        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <Reveal key={it.k} delay={(i % 3) * 0.08} className="group bg-night p-8 transition-colors duration-500 hover:bg-night-2 sm:p-10">
              <span className="font-display text-sm text-accent">{it.k}</span>
              <h3 className="mt-6 font-display text-2xl leading-tight text-ivory">{it.t}</h3>
              <p className="mt-4 text-sm leading-relaxed text-ivory/60">{it.b}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function StudioFinder() {
  const { studios } = useContent()
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const cities = useMemo(() => {
    const m = new Map<string, number>(); studios.forEach((s) => m.set(s.city, (m.get(s.city) ?? 0) + 1)); return [...m.entries()]
  }, [studios])
  return (
    <section className="section">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-center">
        <div>
          <SectionHeading eyebrow="Find a studio" title={["We're probably", 'near you.']} intro={`${studios.length} studio locations listed across South India. Search by area to find your nearest Raack.`} />
          <Reveal delay={0.2}>
            <form className="mt-8 flex gap-2 rounded-full border border-line bg-white p-1.5 shadow-[var(--shadow-soft)]" onSubmit={(e) => { e.preventDefault(); nav(`/studios?q=${encodeURIComponent(q)}`) }} role="search">
              <Search className="ml-4 h-5 w-5 self-center text-muted" />
              <label htmlFor="home-studio-q" className="sr-only">Search area</label>
              <input id="home-studio-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Velachery, Tambaram, Puducherry…" className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none" />
              <button className="btn-primary !py-3">Search</button>
            </form>
            <div className="mt-6 flex flex-wrap gap-2">
              {cities.map(([c, n]) => <Link key={c} to={`/studios?city=${encodeURIComponent(c)}`} className="chip hover:border-ink/30">{c} <span className="text-muted">{n}</span></Link>)}
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <div className="relative h-[420px] overflow-hidden rounded-[2rem] border border-line shadow-[var(--shadow-float)] sm:h-[520px]">
            <Suspense fallback={<div className="h-full w-full animate-pulse bg-pearl" />}><StudioMap studios={studios} onSelect={(s) => nav(`/studios/${s}`)} /></Suspense>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Leadership() {
  const { team } = useContent()
  const [founder, ...rest] = team
  if (!founder) return null
  return (
    <section className="section">
      <div className="container-x">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <div className="relative mx-auto aspect-[4/5] max-w-md overflow-hidden rounded-[2rem] bg-gradient-to-b from-pearl to-sand">
              <img src={founder.photo ?? ''} alt={`${founder.name}, ${founder.role} of Raack`} loading="lazy" className="absolute inset-x-0 bottom-0 mx-auto h-[92%] object-contain" />
              <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/80 p-4 backdrop-blur"><p className="font-display text-xl">{founder.name}</p><p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{founder.role}</p></div>
            </div>
          </Reveal>
          <div>
            <Reveal><span className="eyebrow">Founder & leadership</span></Reveal>
            <Reveal delay={0.1}><Quote className="mt-6 h-10 w-10 text-accent" /></Reveal>
            <RevealLines lines={['“Your thoughts', 'create your reality.”']} className="display-lg mt-4" />
            <Reveal delay={0.2}><p className="lead mt-6">{founder.vision}</p></Reveal>
            <Reveal delay={0.25}><p className="mt-4 font-display text-xl italic text-charcoal">{founder.body}</p></Reveal>
          </div>
        </div>
        <div className="mt-20 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {rest.map((m, i) => (
            <Reveal key={m.id} delay={i * 0.08}>
              <Link to="/about#team" className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-gradient-to-b from-pearl to-sand">
                  <img src={m.photo ?? ''} alt={`${m.name}, ${m.role}`} loading="lazy" className="absolute inset-x-0 bottom-0 mx-auto h-[90%] object-contain grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0" />
                </div>
                <p className="mt-4 font-display text-lg">{m.name}</p><p className="text-xs uppercase tracking-[0.16em] text-muted">{m.role}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Events() {
  const { events } = useContent()
  const feature = events.find((e) => e.slug === 'heal-the-world') ?? events[0]
  return (
    <section className="relative overflow-hidden bg-night text-ivory">
      {feature?.video && (
        <video className="absolute inset-0 h-full w-full object-cover opacity-30" src={feature.video} poster={feature.poster ?? undefined} muted autoPlay loop playsInline preload="none" aria-hidden />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-night via-night/70 to-night" />
      <div className="container-x relative section">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading dark eyebrow="Events & experiences" title={['A dazzling showcase', 'of talent & artistry.']} />
          <Reveal><Link to="/events" className="btn-light">All events <ArrowRight className="h-4 w-4" /></Link></Reveal>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {events.map((e, i) => (
            <Reveal key={e.slug} delay={i * 0.08}>
              <Link to={`/events/${e.slug}`} className="group block">
                <Tilt className="rounded-3xl">
                  <article className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-white/10 bg-night-2">
                    <img src={e.cover ?? ''} alt={`${e.name} ${e.edition}`} loading="lazy" className="absolute inset-0 h-full w-full object-contain p-6 transition duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <span className={`rounded-full px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider ${e.status === 'past' ? 'bg-white/15' : 'bg-accent'}`}>{e.status === 'past' ? 'Past' : e.status === 'upcoming' ? 'Upcoming' : 'Announced'}</span>
                      <h3 className="mt-3 font-display text-2xl">{e.name}</h3>
                      <p className="text-sm text-white/60">{e.subtitle} · {e.date_text}</p>
                    </div>
                  </article>
                </Tilt>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function GalleryStrip() {
  const { media } = useContent()
  const imgs = media.filter((m) => m.kind === 'image' && (m.category === 'performances' || m.category === 'workshops')).slice(0, 14)
  if (!imgs.length) return null
  const row = [...imgs, ...imgs]
  return (
    <section className="overflow-hidden py-20 sm:py-28">
      <div className="container-x mb-12 flex flex-wrap items-end justify-between gap-6">
        <SectionHeading eyebrow="Gallery" title={['Moments in motion.']} />
        <Reveal><Link to="/gallery" className="btn-ghost">Open gallery <ArrowRight className="h-4 w-4" /></Link></Reveal>
      </div>
      <div className="flex w-max gap-4 animate-marquee hover:[animation-play-state:paused]">
        {row.map((m, i) => (
          <Link to="/gallery" key={i} className="block h-56 w-80 shrink-0 overflow-hidden rounded-2xl bg-pearl sm:h-64 sm:w-96" tabIndex={i >= imgs.length ? -1 : 0}>
            <img src={m.url} alt={i >= imgs.length ? '' : m.alt} loading="lazy" className="h-full w-full object-cover transition duration-700 hover:scale-105" />
          </Link>
        ))}
      </div>
    </section>
  )
}

function Testimonials() {
  const { testimonials } = useContent()
  const list = testimonials.filter((t) => t.kind === 'student')
  const [i, setI] = useState(0)
  if (!list.length) return null
  const t = list[i % list.length]
  return (
    <section className="bg-pearl section grain">
      <div className="container-x">
        <SectionHeading eyebrow="Happy stories" title={['What our dancers', '& parents say.']} />
        <div className="mt-14 grid gap-10 lg:grid-cols-[auto_1fr] lg:items-center">
          <div className="flex gap-3 lg:flex-col">
            {list.map((x, k) => (
              <button key={x.id} onClick={() => setI(k)} aria-label={`Show testimonial from ${x.name}`} className={`h-14 w-14 overflow-hidden rounded-full border-2 transition sm:h-16 sm:w-16 ${k === i % list.length ? 'scale-110 border-accent' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                <img src={x.photo ?? ''} alt="" className="h-full w-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
          <div className="card relative min-h-[320px] overflow-hidden p-8 sm:p-12">
            <Quote className="absolute right-8 top-8 h-16 w-16 text-accent/10" />
            <AnimatePresence mode="wait">
              <motion.figure key={t.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
                <blockquote className="font-display text-[clamp(1.25rem,2.2vw,1.85rem)] leading-snug text-ink">“{t.quote}”</blockquote>
                <figcaption className="mt-8 flex items-center gap-4"><span className="h-px w-10 bg-accent" /><span><span className="block font-semibold">{t.name}</span>{t.designation && <span className="text-sm text-muted">{t.designation}</span>}</span></figcaption>
              </motion.figure>
            </AnimatePresence>
            <div className="mt-10 flex gap-2">
              <button onClick={() => setI((i - 1 + list.length) % list.length)} className="grid h-11 w-11 place-items-center rounded-full border border-line hover:bg-ink hover:text-white" aria-label="Previous testimonial"><ChevronLeft className="h-5 w-5" /></button>
              <button onClick={() => setI((i + 1) % list.length)} className="grid h-11 w-11 place-items-center rounded-full border border-line hover:bg-ink hover:text-white" aria-label="Next testimonial"><ChevronRight className="h-5 w-5" /></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Trial() {
  return (
    <section className="relative overflow-hidden bg-night text-ivory section" id="trial">
      <div className="pointer-events-none absolute -left-32 bottom-0 h-[500px] w-[500px] rounded-full bg-accent/25 blur-[140px]" />
      <div className="container-x relative grid gap-14 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <Reveal><span className="eyebrow"><Sparkles className="h-3.5 w-3.5" />Free trial class</span></Reveal>
          <RevealLines lines={['Unlock your', 'dancing potential', <em key="n" className="text-accent">now.</em>]} className="display-lg mt-5" />
          <Reveal delay={0.2}><p className="lead mt-6 text-ivory/70">{about.joinCopy}</p></Reveal>
        </div>
        <Reveal delay={0.1}><div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur sm:p-10"><EnquiryForm dark /></div></Reveal>
      </div>
    </section>
  )
}
