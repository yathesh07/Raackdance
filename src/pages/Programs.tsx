import { useMemo, useState } from 'react'
import { useContent } from '@/lib/content'
import { Seo } from '@/components/Seo'
import { PageHero } from '@/components/Section'
import { ProgramCard } from '@/components/ProgramCard'
import { Reveal } from '@/components/Motion'
import { BigCTA } from '@/components/CTA'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { EnquiryForm } from '@/components/EnquiryForm'
import { cn } from '@/lib/utils'

const FILTERS = [
  { k: 'all', l: 'All ages' }, { k: 'kids', l: 'Toddlers & kids' }, { k: 'teens', l: 'Kids & teens' }, { k: 'adults', l: 'Adults' },
]

export default function Programs() {
  const { programs } = useContent()
  const [f, setF] = useState('all')
  const list = useMemo(() => programs.filter((p) => f === 'all' || p.audience === f || (f === 'adults' && p.audience === 'all') || (f === 'teens' && p.audience === 'all')), [programs, f])
  return (
    <>
      <Seo page="programs" />
      <PageHero eyebrow={`${programs.length} programs`} title={['Dance programs', <em key="t" className="text-accent">tailored to you.</em>]}
        intro="At Raack Academy, we offer a diverse range of dance programs tailored to meet the unique needs and aspirations of individuals at every stage of their dance journey. Whether you're a beginner taking your first steps or an experienced dancer looking to refine your skills, we have something for you." image="/media/courses/course-3.webp" />
      <div className="container-x pt-6"><Breadcrumbs items={[{ label: 'Programs' }]} /></div>
      <section className="section !pt-12">
        <div className="container-x">
          <div role="tablist" aria-label="Filter by age" className="flex flex-wrap gap-2">
            {FILTERS.map((x) => <button key={x.k} role="tab" aria-selected={f === x.k} onClick={() => setF(x.k)} className={cn('rounded-full border px-5 py-2.5 text-sm font-semibold transition', f === x.k ? 'border-ink bg-ink text-ivory' : 'border-line bg-white hover:border-ink/30')}>{x.l}</button>)}
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p, i) => <Reveal key={p.slug} delay={(i % 3) * 0.06}><ProgramCard p={p} i={programs.indexOf(p)} /></Reveal>)}
          </div>
          <div className="mt-20 overflow-hidden rounded-3xl border border-line">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Programs by age group</caption>
              <thead className="bg-pearl text-xs uppercase tracking-wider text-muted"><tr><th className="p-4">Program</th><th className="p-4">Age group</th><th className="hidden p-4 sm:table-cell">Focus</th></tr></thead>
              <tbody>{programs.map((p) => <tr key={p.slug} className="border-t border-line"><td className="p-4 font-semibold">{p.name}</td><td className="p-4">{p.age_group}</td><td className="hidden p-4 text-muted sm:table-cell">{p.tagline}</td></tr>)}</tbody>
            </table>
          </div>
        </div>
      </section>
      <section className="bg-pearl section grain" id="enquire">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div><span className="eyebrow">Register now</span><h2 className="display-lg mt-5">Not sure which program fits?</h2><p className="lead mt-5">Tell us the student's age and your nearest studio — our counsellors will guide you to the right course.</p></div>
          <div className="card p-6 sm:p-10"><EnquiryForm type="program" lockType /></div>
        </div>
      </section>
      <BigCTA />
    </>
  )
}
