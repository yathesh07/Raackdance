import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { useContent } from '@/lib/content'
import { cn } from '@/lib/utils'
import { Magnetic } from './Motion'

export const NAV = [
  { to: '/', label: 'Home', preview: '/media/682x674.webp' },
  { to: '/about', label: 'About Raack', preview: '/media/Our-Philosophy.webp' },
  { to: '/programs', label: 'Programs', preview: '/media/courses/course-2.webp' },
  { to: '/studios', label: 'Find a Studio', preview: '/media/studio-bg-image/velachery.webp' },
  { to: '/online-academy', label: 'Online Academy', preview: '/media/courses/course-7.webp' },
  { to: '/events', label: 'Events & Experiences', preview: '/media/events/events.webp' },
  { to: '/faculty-academy', label: 'Faculty Academy', preview: '/media/faculties/header.webp' },
  { to: '/gallery', label: 'Gallery', preview: '/media/heal-world-images/dance-classes-in-chennai.webp' },
  { to: '/contact', label: 'Contact', preview: '/media/contact/header.webp' },
]
const SECONDARY = [
  { to: '/careers', label: 'Careers' }, { to: '/franchise', label: 'Franchise' }, { to: '/book-a-free-trial', label: 'Book a Free Trial' },
]
const BAR = [
  { to: '/programs', label: 'Programs' }, { to: '/studios', label: 'Studios' }, { to: '/online-academy', label: 'Online' },
  { to: '/events', label: 'Events' }, { to: '/about', label: 'About' }, { to: '/careers', label: 'Careers' }, { to: '/franchise', label: 'Franchise' },
]

export function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <Link to="/" className={cn('flex items-center gap-2.5', className)} aria-label="Raack Academy of Dance — home">
      <img src="/media/logo.png" alt="" width={44} height={44} className="h-11 w-11 object-contain" />
      <span className="leading-none">
        <span className={cn('block font-display text-[1.35rem] font-semibold tracking-tight', light ? 'text-white' : 'text-ink')}>Raack</span>
        <span className={cn('hidden text-[0.62rem] font-semibold uppercase tracking-[0.24em] min-[400px]:block', light ? 'text-white/60' : 'text-muted')}>Academy of Dance</span>
      </span>
    </Link>
  )
}

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [hover, setHover] = useState(0)
  const { pathname } = useLocation()
  const { socials } = useContent()

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on(); addEventListener('scroll', on, { passive: true }); return () => removeEventListener('scroll', on)
  }, [])
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : '' }, [open])

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2">Skip to content</a>
      <header className={cn('fixed inset-x-0 top-0 z-50 transition-all duration-500', scrolled ? 'py-2' : 'py-4')}>
        <div className="container-x">
          <div className={cn('flex items-center justify-between gap-4 rounded-full px-3 py-2 pl-4 transition-all duration-500 sm:pl-5',
            scrolled ? 'border border-line bg-ivory/90 shadow-[var(--shadow-soft)] backdrop-blur-xl' : 'border border-transparent bg-white/30 backdrop-blur-md')}>
            <Logo />
            <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
              {BAR.map((n) => (
                <NavLink key={n.to} to={n.to} className={({ isActive }) => cn('rounded-full px-3 py-2 text-sm font-medium transition xl:px-3.5', isActive ? 'bg-ink text-ivory' : 'text-charcoal hover:bg-ink/5')}>{n.label}</NavLink>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <Link to="/book-a-free-trial" className="btn-primary !px-4 !py-2.5 !text-xs sm:hidden">Free trial</Link>
              <Magnetic className="hidden sm:inline-block"><Link to="/book-a-free-trial" className="btn-primary whitespace-nowrap !px-5 !py-2.5">Book a Free Trial</Link></Magnetic>
              <button onClick={() => setOpen(true)} className="grid h-11 w-11 place-items-center rounded-full bg-ink text-ivory transition hover:bg-accent" aria-label="Open menu" aria-expanded={open}><Menu className="h-5 w-5" /></button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[60] overflow-y-auto bg-night text-ivory" role="dialog" aria-modal aria-label="Site menu"
            initial={{ clipPath: 'circle(0% at 95% 4%)' }} animate={{ clipPath: 'circle(150% at 95% 4%)' }} exit={{ clipPath: 'circle(0% at 95% 4%)' }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}>
            <div className="container-x flex min-h-full flex-col py-5">
              <div className="flex items-center justify-between">
                <Logo light />
                <button onClick={() => setOpen(false)} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 hover:bg-accent" aria-label="Close menu"><X /></button>
              </div>
              <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1.4fr_1fr]">
                <nav aria-label="Menu">
                  <ul>
                    {NAV.map((n, i) => (
                      <motion.li key={n.to} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
                        <NavLink to={n.to} onMouseEnter={() => setHover(i)} onFocus={() => setHover(i)}
                          className={({ isActive }) => cn('group flex items-baseline gap-4 border-b border-white/10 py-2 font-display text-[clamp(1.2rem,2.2vw,1.85rem)] leading-snug tracking-tight transition-colors', isActive ? 'text-accent' : 'text-ivory/85 hover:text-white')}>
                          <span className="font-sans text-xs tabular-nums text-white/40">0{i + 1}</span>
                          <span className="transition-transform duration-500 group-hover:translate-x-2">{n.label}</span>
                          <ArrowUpRight className="ml-auto h-4 w-4 opacity-0 transition group-hover:opacity-100" />
                        </NavLink>
                      </motion.li>
                    ))}
                  </ul>
                </nav>
                <div className="hidden lg:block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-white/5">
                    <AnimatePresence mode="popLayout">
                      <motion.img key={hover} src={NAV[hover].preview} alt="" className="absolute inset-0 h-full w-full object-contain p-8"
                        initial={{ opacity: 0, scale: 1.08, rotate: -2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.6 }} />
                    </AnimatePresence>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-6 border-t border-white/10 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-x-6 gap-y-2">{SECONDARY.map((s) => <Link key={s.to} to={s.to} className="text-white/70 hover:text-white">{s.label}</Link>)}</div>
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-white/50">{socials.map((s) => <a key={s.href} href={s.href} target="_blank" rel="noreferrer" className="hover:text-white">{s.label}</a>)}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
