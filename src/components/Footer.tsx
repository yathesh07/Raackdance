import { Link } from 'react-router-dom'
import { ArrowUpRight, Mail, Phone } from 'lucide-react'
import { useContent } from '@/lib/content'
import { telHref } from '@/lib/utils'
import { Logo } from './Header'

export function Footer() {
  const { general, socials, programs, events, studios } = useContent()
  const cities = [...new Set(studios.map((s) => s.city))]
  return (
    <footer className="relative overflow-hidden bg-night text-ivory">
      <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-accent/20 blur-[120px]" />
      <div className="container-x relative pt-20 pb-10">
        <div className="grid gap-12 border-b border-white/10 pb-16 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="font-display text-[clamp(2.2rem,5vw,4.4rem)] leading-[1] tracking-tight">Let your dance journey<br /><em className="text-accent not-italic">begin today.</em></p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/book-a-free-trial" className="btn-primary">Book a Free Trial <ArrowUpRight className="h-4 w-4" /></Link>
              <Link to="/studios" className="btn-light">Find a Studio</Link>
            </div>
          </div>
          <div className="grid content-end gap-4 text-sm">
            <a href={telHref(general.phone)} className="flex items-center gap-3 text-lg text-white/90 hover:text-white"><Phone className="h-5 w-5 text-accent" />{general.phone}</a>
            <a href={`mailto:${general.email}`} className="flex items-center gap-3 text-lg text-white/90 hover:text-white"><Mail className="h-5 w-5 text-accent" />{general.email}</a>
            <div className="mt-2 flex flex-wrap gap-2">{socials.map((s) => <a key={s.href} href={s.href} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 px-4 py-2 text-xs text-white/70 hover:border-white/40 hover:text-white">{s.label}</a>)}</div>
          </div>
        </div>
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1"><Logo light /><p className="mt-5 text-sm leading-relaxed text-white/50">The Amplifiers of Dance As a Way of Life in South India.</p></div>
          <FooterCol title="Discover" links={[['/about', 'About Raack'], ['/gallery', 'Gallery'], ['/faculty-academy', 'Faculty Academy'], ['/careers', 'Careers'], ['/franchise', 'Franchise'], ['/contact', 'Contact']]} />
          <FooterCol title="Programs" links={programs.map((p) => [`/programs/${p.slug}`, p.name])} />
          <FooterCol title="Events" links={events.map((e) => [`/events/${e.slug}`, `${e.name} ${e.edition.replace(/^Season \d+ · /, '')}`])} />
          <FooterCol title="Studios" links={[['/studios', `All ${studios.length} studios`], ...cities.map((c) => [`/studios?city=${encodeURIComponent(c)}`, c] as [string, string])]} />
        </div>
        <div className="flex flex-col gap-3 border-t border-white/10 pt-8 text-xs text-white/40 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Raack Academy of Dance. All rights reserved.</p>
          <div className="flex gap-5"><Link to="/privacy" className="hover:text-white">Privacy</Link><Link to="/terms" className="hover:text-white">Terms</Link><Link to="/admin" className="hover:text-white">Staff login</Link></div>
        </div>
      </div>
    </footer>
  )
}
function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">{title}</p>
      <ul className="mt-4 space-y-2.5 text-sm">{links.map(([to, l]) => <li key={to}><Link to={to} className="text-white/75 hover:text-white">{l}</Link></li>)}</ul>
    </div>
  )
}
