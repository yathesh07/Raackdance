import { useState } from 'react'
import { Navigate, NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import {
  BarChart3, CalendarDays, FileText, GraduationCap, Image, Inbox, LayoutGrid, Loader2, LogOut, MapPin, Menu, MessageSquareQuote, ScrollText, Settings as Cog, ShieldCheck, Sparkles, Briefcase, Users as UsersIcon, X, ExternalLink,
} from 'lucide-react'
import { AuthProvider, DEMO_PASSWORD, useAuth } from '@/lib/auth'
import { canView, type Module } from '@/lib/rbac'
import { isDemo } from '@/lib/env'
import { ROLES } from '@/lib/types'
import { Seo } from '@/components/Seo'
import { cn } from '@/lib/utils'
import Overview from './Overview'
import Enquiries from './Enquiries'
import Users from './Users'
import Settings from './Settings'
import Audit from './Audit'
import { CareersAdmin, EventsAdmin, GalleryAdmin, InstructorsAdmin, PagesAdmin, ProgramsAdmin, SchedulesAdmin, StudiosAdmin, TestimonialsAdmin } from './modules'

const NAV: { to: string; label: string; m: Module; icon: React.ElementType }[] = [
  { to: '', label: 'Overview', m: 'overview', icon: BarChart3 },
  { to: 'enquiries', label: 'Enquiries', m: 'enquiries', icon: Inbox },
  { to: 'programs', label: 'Programs', m: 'programs', icon: Sparkles },
  { to: 'studios', label: 'Studios', m: 'studios', icon: MapPin },
  { to: 'schedules', label: 'Class schedules', m: 'schedules', icon: CalendarDays },
  { to: 'instructors', label: 'Instructors', m: 'instructors', icon: GraduationCap },
  { to: 'events', label: 'Events', m: 'events', icon: LayoutGrid },
  { to: 'gallery', label: 'Gallery & media', m: 'gallery', icon: Image },
  { to: 'testimonials', label: 'Testimonials', m: 'testimonials', icon: MessageSquareQuote },
  { to: 'careers', label: 'Careers', m: 'careers', icon: Briefcase },
  { to: 'pages', label: 'Pages & SEO', m: 'pages', icon: FileText },
  { to: 'users', label: 'Users & roles', m: 'users', icon: UsersIcon },
  { to: 'settings', label: 'Settings', m: 'settings', icon: Cog },
  { to: 'audit', label: 'Audit log', m: 'audit', icon: ScrollText },
]

export default function AdminApp() {
  return (
    <AuthProvider>
      <Seo title="Raack Admin" noindex />
      <Gate />
    </AuthProvider>
  )
}

function Gate() {
  const { profile, loading } = useAuth()
  if (loading) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin text-accent" /></div>
  return (
    <Routes>
      <Route path="login" element={profile ? <Navigate to="/admin" replace /> : <Login />} />
      <Route path="*" element={profile ? <Shell /> : <Navigate to="/admin/login" replace />} />
    </Routes>
  )
}

function Login() {
  const { signIn, resetPassword } = useAuth()
  const [email, setEmail] = useState(isDemo ? 'admin@raack.demo' : '')
  const [pw, setPw] = useState(isDemo ? DEMO_PASSWORD : '')
  const [err, setErr] = useState('')
  const [info, setInfo] = useState('')
  const [busy, setBusy] = useState(false)
  const nav = useNavigate()
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(''); setBusy(true)
    try { await signIn(email, pw); nav('/admin') } catch (x: any) { setErr(x.message) } finally { setBusy(false) }
  }
  return (
    <div className="grid min-h-screen bg-pearl lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-night p-12 text-ivory lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -left-20 bottom-0 h-96 w-96 rounded-full bg-accent/30 blur-[120px]" />
        <img src="/media/logo.png" alt="Raack" className="relative h-14 w-14" />
        <div className="relative"><p className="font-display text-5xl leading-tight">Raack<br />Studio Console</p><p className="mt-4 max-w-sm text-ivory/60">Manage enquiries, studios, programs, events and media — securely, by role.</p></div>
      </div>
      <div className="flex items-center justify-center p-6">
        <form onSubmit={submit} className="w-full max-w-sm space-y-4" aria-label="Staff sign in">
          <div><ShieldCheck className="h-8 w-8 text-accent" /><h1 className="mt-4 font-display text-3xl">Staff sign in</h1></div>
          {isDemo && (
            <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
              <p className="font-semibold">Demo mode (no backend connected)</p>
              <p className="mt-1">Password <code>{DEMO_PASSWORD}</code> for: admin@ · editor@ · velachery@ · counsellor@ · viewer@raack.demo</p>
            </div>
          )}
          <label className="block text-sm font-medium">Email<input type="email" autoComplete="username" required className="adm-input mt-1 !py-3" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <label className="block text-sm font-medium">Password<input type="password" autoComplete="current-password" required className="adm-input mt-1 !py-3" value={pw} onChange={(e) => setPw(e.target.value)} /></label>
          {err && <p role="alert" className="rounded-lg bg-accent-soft p-3 text-sm text-accent-deep">{err}</p>}
          {info && <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{info}</p>}
          <button disabled={busy} className="btn-primary w-full">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign in'}</button>
          <button type="button" className="w-full text-center text-xs text-muted hover:text-ink" onClick={async () => { setErr(''); try { await resetPassword(email); setInfo('Password reset link sent if the account exists.') } catch (x: any) { setErr(x.message) } }}>Forgot password?</button>
          <a href="/" className="block text-center text-xs text-muted hover:text-ink">← Back to website</a>
        </form>
      </div>
    </div>
  )
}

function Shell() {
  const { profile, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const p = profile!
  const items = NAV.filter((n) => canView(p.role, n.m))
  const guard = (m: Module, el: React.ReactNode) => (canView(p.role, m) ? el : <Navigate to="/admin" replace />)
  return (
    <div className="min-h-screen bg-[#f6f3ee] text-ink">
      {isDemo && <div className="bg-amber-500 px-4 py-1.5 text-center text-xs font-semibold text-white">Demo mode — data is stored only in this browser. Connect Supabase for production.</div>}
      <aside className={cn('fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-line bg-white transition-transform lg:translate-x-0', isDemo && 'lg:top-7', open ? 'translate-x-0' : '-translate-x-full')}>
        <div className="flex items-center justify-between px-5 py-5">
          <a href="/" className="flex items-center gap-2"><img src="/media/logo.png" alt="" className="h-9 w-9" /><span className="font-display text-lg">Raack Admin</span></a>
          <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu"><X className="h-5 w-5" /></button>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3" aria-label="Admin">
          {items.map((n) => (
            <NavLink key={n.to} to={`/admin/${n.to}`} end={n.to === ''} onClick={() => setOpen(false)} className={({ isActive }) => cn('flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition', isActive ? 'bg-ink text-white' : 'text-charcoal hover:bg-pearl')}>
              <n.icon className="h-4 w-4" />{n.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-line p-4">
          <p className="truncate text-sm font-semibold">{p.full_name}</p>
          <p className="truncate text-xs text-muted">{ROLES.find((r) => r.value === p.role)?.label} · {p.email}</p>
          <div className="mt-3 flex gap-2">
            <a href="/" target="_blank" className="adm-btn flex-1 justify-center border border-line text-xs"><ExternalLink className="h-3.5 w-3.5" />Site</a>
            <button onClick={signOut} className="adm-btn flex-1 justify-center border border-line text-xs"><LogOut className="h-3.5 w-3.5" />Sign out</button>
          </div>
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-30 bg-ink/30 lg:hidden" onClick={() => setOpen(false)} />}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-white/80 px-4 py-3 backdrop-blur lg:hidden">
          <button onClick={() => setOpen(true)} aria-label="Open menu"><Menu className="h-5 w-5" /></button><span className="font-display">Raack Admin</span>
        </header>
        <main className="mx-auto max-w-7xl p-4 sm:p-8">
          <Routes>
            <Route index element={<Overview p={p} />} />
            <Route path="enquiries" element={guard('enquiries', <Enquiries p={p} />)} />
            <Route path="programs" element={guard('programs', <ProgramsAdmin p={p} />)} />
            <Route path="studios" element={guard('studios', <StudiosAdmin p={p} />)} />
            <Route path="schedules" element={guard('schedules', <SchedulesAdmin p={p} />)} />
            <Route path="instructors" element={guard('instructors', <InstructorsAdmin p={p} />)} />
            <Route path="events" element={guard('events', <EventsAdmin p={p} />)} />
            <Route path="gallery" element={guard('gallery', <GalleryAdmin p={p} />)} />
            <Route path="testimonials" element={guard('testimonials', <TestimonialsAdmin p={p} />)} />
            <Route path="careers" element={guard('careers', <CareersAdmin p={p} />)} />
            <Route path="pages" element={guard('pages', <PagesAdmin p={p} />)} />
            <Route path="users" element={guard('users', <Users p={p} />)} />
            <Route path="settings" element={guard('settings', <Settings p={p} />)} />
            <Route path="audit" element={guard('audit', <Audit />)} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
