import { useState } from 'react'
import { ChevronDown, Briefcase } from 'lucide-react'
import { useContent } from '@/lib/content'
import { careers } from '@/content/site'
import { Seo } from '@/components/Seo'
import { PageHero, SectionHeading } from '@/components/Section'
import { Reveal } from '@/components/Motion'
import { EnquiryForm } from '@/components/EnquiryForm'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { cn } from '@/lib/utils'

export default function Careers() {
  const { careers: positions, testimonials } = useContent()
  const voices = testimonials.filter((t) => t.kind === 'staff')
  const [open, setOpen] = useState<string | null>(null)
  return (
    <>
      <Seo page="careers" />
      <PageHero eyebrow="Careers" title={['Start your', 'career at', <em key="r" className="text-accent">Raack.</em>]} intro={careers.intro.join(' ')}><a href="#apply" className="btn-primary">Apply now</a></PageHero>
      <div className="container-x pt-6"><Breadcrumbs items={[{ label: 'Careers' }]} /></div>
      <section className="section">
        <div className="container-x">
          <SectionHeading eyebrow="What does our team say?" title={['The heart and soul', 'of our organisation.']} />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {voices.map((v, i) => <Reveal key={v.id} delay={i * 0.08}><figure className="card h-full p-6"><img src={v.photo ?? ''} alt={v.name} loading="lazy" className="h-20 w-20 rounded-2xl object-cover" /><blockquote className="mt-5 text-charcoal">“{v.quote}”</blockquote><figcaption className="mt-4 font-display text-lg">{v.name}</figcaption></figure></Reveal>)}
          </div>
        </div>
      </section>
      <section className="bg-pearl section grain">
        <div className="container-x">
          <SectionHeading eyebrow={`${positions.length} positions available`} title={['Open roles']} />
          <div className="mt-10 space-y-3">
            {positions.map((p) => (
              <div key={p.id} className="card overflow-hidden">
                <button onClick={() => setOpen(open === p.id ? null : p.id)} aria-expanded={open === p.id} className="flex w-full items-center justify-between gap-4 p-6 text-left">
                  <span className="flex items-center gap-4"><span className="grid h-11 w-11 place-items-center rounded-xl bg-accent-soft text-accent"><Briefcase className="h-5 w-5" /></span><span><span className="block font-display text-2xl">{p.title}</span><span className="text-sm text-muted">{p.type}</span></span></span>
                  <ChevronDown className={cn('h-5 w-5 transition', open === p.id && 'rotate-180')} />
                </button>
                {open === p.id && (
                  <div className="border-t border-line p-6 pt-5">
                    <p className="text-charcoal">{p.summary}</p>
                    <h3 className="mt-6 text-xs font-semibold uppercase tracking-wider text-muted">Requirements</h3>
                    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">{p.requirements.map((r) => <li key={r}>{r}</li>)}</ul>
                    {p.apply && <p className="mt-5 text-sm font-medium">{p.apply}</p>}
                    <a href="#apply" className="btn-dark mt-6">Apply for {p.title}</a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container-x">
          <SectionHeading eyebrow="Your career at Raack" title={['Combine your passion', 'with purpose.']} />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">{careers.why.map((w, i) => <Reveal key={w.title} delay={i * 0.05}><div className="card h-full p-6"><span className="font-display text-accent">0{i + 1}</span><h3 className="mt-3 font-display text-xl">{w.title}</h3><p className="mt-2 text-sm text-muted">{w.body}</p></div></Reveal>)}</div>
        </div>
      </section>
      <section className="dark-section section" id="apply">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div><span className="eyebrow">Apply today</span><h2 className="display-lg mt-5 text-ivory">We can't wait to hear from you.</h2><p className="lead mt-5 text-ivory/70">{careers.apply}</p></div>
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 sm:p-10"><EnquiryForm type="careers" lockType dark /></div>
        </div>
      </section>
    </>
  )
}
