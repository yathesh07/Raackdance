import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { ProgramRow } from '@/lib/types'
import { Tilt } from './Motion'

export function ProgramCard({ p, i = 0 }: { p: ProgramRow; i?: number }) {
  return (
    <Link to={`/programs/${p.slug}`} className="group block focus-visible:outline-none">
      <Tilt className="rounded-[1.6rem]" max={8}>
        <article className="relative flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-line bg-white shadow-[var(--shadow-soft)] transition-shadow duration-500 group-hover:shadow-[var(--shadow-float)] group-focus-visible:ring-4 group-focus-visible:ring-accent/30">
          <div className="relative aspect-square overflow-hidden" style={{ background: `radial-gradient(120% 90% at 50% 100%, ${p.accent}22, transparent 60%), #f6f1e9` }}>
            <span className="absolute left-5 top-5 z-10 font-display text-sm text-muted">0{i + 1}</span>
            {p.image && <img src={p.image} alt={`${p.name} — ${p.tagline}`} loading="lazy" className="absolute inset-0 h-full w-full object-contain p-6 transition-transform duration-700 ease-[var(--ease-out-expo)] [transform:translateZ(40px)] group-hover:scale-[1.06]" />}
            {p.logo && <img src={p.logo} alt="" loading="lazy" className="absolute bottom-4 right-4 h-12 w-auto max-w-[45%] object-contain drop-shadow-md [transform:translateZ(60px)]" />}
          </div>
          <div className="flex flex-1 flex-col gap-2 p-6 [transform:translateZ(20px)]">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-2xl tracking-tight">{p.name}</h3>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line transition group-hover:border-accent group-hover:bg-accent group-hover:text-white"><ArrowUpRight className="h-4 w-4" /></span>
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: p.accent }}>{p.age_group}</p>
            <p className="text-sm leading-relaxed text-muted">{p.tagline}</p>
          </div>
        </article>
      </Tilt>
    </Link>
  )
}
