import { Link } from 'react-router-dom'
import { useContent } from '@/lib/content'
import { franchise } from '@/content/site'
import { Seo } from '@/components/Seo'
import { PageHero, SectionHeading } from '@/components/Section'
import { Counter, Reveal } from '@/components/Motion'
import { EnquiryForm } from '@/components/EnquiryForm'
import { Breadcrumbs } from '@/components/Breadcrumbs'

export default function Franchise() {
  const { testimonials, stats } = useContent()
  const owners = testimonials.filter((t) => t.kind === 'franchise')
  return (
    <>
      <Seo page="franchise" />
      <PageHero eyebrow={franchise.title} title={['Passionate about', 'dance &', <em key="e" className="text-accent">entrepreneurship?</em>]} intro={franchise.intro.join(' ')}>
        <a href="#enquire" className="btn-primary">Franchise enquiry</a><Link to="/studios" className="btn-ghost">Browse our locations</Link>
      </PageHero>
      <div className="container-x pt-6"><Breadcrumbs items={[{ label: 'Franchise' }]} /></div>
      <section className="section">
        <div className="container-x">
          <SectionHeading eyebrow="Hear from our franchisee owners" title={['Success stories', 'across the network.']} intro={franchise.ownersIntro} />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {owners.map((o, i) => <Reveal key={o.id} delay={(i % 2) * 0.08}><figure className="card flex h-full gap-5 p-6 sm:p-8"><img src={o.photo ?? ''} alt={o.name} loading="lazy" className="h-20 w-20 shrink-0 rounded-full bg-pearl object-cover" /><div><blockquote className="text-charcoal">“{o.quote}”</blockquote><figcaption className="mt-4"><span className="font-display text-lg">{o.name}</span> <span className="text-sm text-muted">· {o.studio}</span></figcaption></div></figure></Reveal>)}
          </div>
        </div>
      </section>
      <section className="dark-section section">
        <div className="container-x">
          <SectionHeading dark eyebrow="Why choose Raack Academy?" title={['A proven model', 'for success.']} intro={franchise.why} />
          <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-white/10 lg:grid-cols-4">
            {stats.map((s) => <div key={s.label} className="bg-night p-8"><p className="font-display text-5xl"><Counter to={s.value} suffix={s.suffix} /></p><p className="mt-2 text-sm text-white/60">{s.label}</p></div>)}
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            {franchise.benefits.map((b, i) => <Reveal key={b.title} delay={i * 0.05}><div className="h-full rounded-3xl border border-white/10 p-6"><span className="font-display text-accent">0{i + 1}</span><h3 className="mt-3 font-display text-xl">{b.title}</h3><p className="mt-2 text-sm text-white/60">{b.body}</p></div></Reveal>)}
          </div>
        </div>
      </section>
      <section className="bg-pearl section grain" id="enquire">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div><span className="eyebrow">Join us on this exciting journey</span><h2 className="display-lg mt-5">Open your own Raack studio.</h2>{franchise.closing.map((c) => <p key={c} className="lead mt-5">{c}</p>)}</div>
          <div className="card p-6 sm:p-10"><EnquiryForm type="franchise" lockType /></div>
        </div>
      </section>
    </>
  )
}
