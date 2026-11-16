import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowUpRight, Loader2, LocateFixed, MapPin, Phone, Search, X } from 'lucide-react'
import { useContent } from '@/lib/content'
import { Seo } from '@/components/Seo'
import { PageHero } from '@/components/Section'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { cities as cityImages } from '@/content/site'
import { cn, distanceKm, fmtPhone, telHref } from '@/lib/utils'

const StudioMap = lazy(() => import('@/components/StudioMap'))

type Place = { lat: number; lng: number; label: string }
const geoCache = new Map<string, Place | null>()
/** Free geocoding via OpenStreetMap Nominatim (India only, results cached, debounced by caller). */
async function geocode(q: string): Promise<Place | null> {
  const key = q.toLowerCase()
  if (geoCache.has(key)) return geoCache.get(key)!
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=in&q=${encodeURIComponent(q)}`, { headers: { 'Accept-Language': 'en' } })
    const d = await r.json()
    const p = d?.[0] ? { lat: +d[0].lat, lng: +d[0].lon, label: String(d[0].display_name).split(',')[0] } : null
    geoCache.set(key, p); return p
  } catch { return null }
}

export default function Studios() {
  const { studios } = useContent()
  const [sp, setSp] = useSearchParams()
  const [active, setActive] = useState<string | null>(null)
  const [me, setMe] = useState<{ lat: number; lng: number } | null>(null)
  const [geoErr, setGeoErr] = useState('')
  const q = sp.get('q') ?? ''
  const city = sp.get('city') ?? ''
  const [place, setPlace] = useState<Place | null>(null)
  const [geoBusy, setGeoBusy] = useState(false)
  const set = (k: string, v: string) => { const n = new URLSearchParams(sp); v ? n.set(k, v) : n.delete(k); setSp(n, { replace: true }) }

  useEffect(() => {
    const term = q.trim()
    setPlace(null)
    if (term.length < 3) return
    let alive = true
    setGeoBusy(true)
    const t = setTimeout(async () => {
      const p = await geocode(term)
      if (alive) { setPlace(p); setGeoBusy(false) }
    }, 650)
    return () => { alive = false; clearTimeout(t); setGeoBusy(false) }
  }, [q])

  const cities = useMemo(() => [...new Set(studios.map((s) => s.city))], [studios])
  const origin = place ?? me
  const list = useMemo(() => {
    const term = q.trim().toLowerCase()
    let r = studios.filter((s) => !city || s.city === city)
    const textHits = term ? r.filter((s) => `${s.name} ${s.city} ${s.address}`.toLowerCase().includes(term)) : r
    if (place) {
      // Typed a place: show studios nearest to it (exact name/address matches first)
      const d = (s: typeof r[number]) => (s.lat == null ? 1e9 : distanceKm(place, { lat: s.lat, lng: s.lng! }))
      const hits = new Set(textHits.map((s) => s.slug))
      r = [...r].sort((a, b) => (hits.has(b.slug) ? 1 : 0) - (hits.has(a.slug) ? 1 : 0) || d(a) - d(b)).filter((s) => hits.has(s.slug) || d(s) < 40).slice(0, Math.max(12, hits.size))
    } else {
      r = textHits
      if (me) r = [...r].sort((a, b) => distanceKm(me, { lat: a.lat ?? 0, lng: a.lng ?? 0 }) - distanceKm(me, { lat: b.lat ?? 0, lng: b.lng ?? 0 }))
    }
    return r
  }, [studios, q, city, me, place])
  const onSelect = useCallback((s: string) => { setActive(s); document.getElementById(`studio-${s}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }) }, [])

  const locate = () => {
    setGeoErr(''); set('q', '')
    if (!navigator.geolocation) return setGeoErr('Location is not available in this browser.')
    navigator.geolocation.getCurrentPosition((p) => setMe({ lat: p.coords.latitude, lng: p.coords.longitude }), () => setGeoErr('Could not get your location — try searching instead.'), { timeout: 8000 })
  }

  return (
    <>
      <Seo page="studios" />
      <PageHero eyebrow="Find your nearest" title={['Raack studios', <em key="n" className="text-accent">near you.</em>]} intro={`${studios.length} studio locations across Chennai, Puducherry, Cuddalore, Chidambaram, Thanjavur, Kumbakonam, Tiruchirappalli and Bengaluru.`} />
      <div className="container-x pt-6"><Breadcrumbs items={[{ label: 'Find a Studio' }]} /></div>

      <section className="py-10">
        <div className="container-x">
          <div className="grid gap-3 rounded-3xl border border-line bg-white p-3 shadow-[var(--shadow-soft)] md:grid-cols-[1.6fr_1fr_auto]">
            <div className="flex items-center gap-2 rounded-2xl bg-pearl px-4">
              <Search className="h-4 w-4 text-muted" /><label htmlFor="sq" className="sr-only">Search studios</label>
              <input id="sq" value={q} onChange={(e) => set('q', e.target.value)} placeholder="Type any area, landmark or pincode" className="w-full bg-transparent py-3.5 text-sm outline-none" />
              {geoBusy && <Loader2 className="h-4 w-4 animate-spin text-muted" />}{q && <button onClick={() => set('q', '')} aria-label="Clear search"><X className="h-4 w-4" /></button>}
            </div>
            <select aria-label="City" value={city} onChange={(e) => set('city', e.target.value)} className="field !rounded-2xl !border-0 !bg-pearl"><option value="">All cities</option>{cities.map((c) => <option key={c}>{c}</option>)}</select>
            <button onClick={locate} className="btn-dark !rounded-2xl"><LocateFixed className="h-4 w-4" />Near me</button>
          </div>
          {geoErr && <p className="mt-3 text-sm text-accent">{geoErr}</p>}
          <p className="mt-4 text-sm text-muted" aria-live="polite">{list.length} studio{list.length === 1 ? '' : 's'} found{place ? ` near ${place.label}` : me ? ' · sorted by distance from you' : ''}</p>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.15fr]">
            <ul className="order-2 grid max-h-none gap-3 overflow-y-auto pr-1 lg:order-1 lg:max-h-[720px]">
              {list.map((s) => (
                <li key={s.slug} id={`studio-${s.slug}`}>
                  <article onMouseEnter={() => setActive(s.slug)} className={cn('group card flex gap-4 p-4 transition', active === s.slug && 'border-ink/40 ring-4 ring-accent/10')}>
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-pearl sm:h-28 sm:w-32">
                      {s.hero ? <img src={s.hero} alt="" loading="lazy" className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center"><MapPin className="text-muted" /></div>}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h2 className="font-display text-xl leading-tight"><Link to={`/studios/${s.slug}`} className="hover:text-accent">Raack {s.name}</Link></h2>
                        {origin && s.lat && <span className="shrink-0 text-xs text-muted">{distanceKm(origin, { lat: s.lat, lng: s.lng! }).toFixed(1)} km</span>}
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-accent">{s.city}{s.is_head_office && ' · Head office studio'}</p>
                      <p className="mt-1 line-clamp-2 text-sm text-muted">{s.address}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                        {s.phones[0] && <a href={telHref(s.phones[0])} className="inline-flex items-center gap-1.5 font-semibold hover:text-accent"><Phone className="h-3.5 w-3.5" />{fmtPhone(s.phones[0])}</a>}
                        <Link to={`/studios/${s.slug}`} className="inline-flex items-center gap-1 text-charcoal hover:text-accent">Details <ArrowUpRight className="h-3.5 w-3.5" /></Link>
                      </div>
                    </div>
                  </article>
                </li>
              ))}
              {!list.length && <li className="card p-10 text-center text-muted">No studios match. Try another area or <Link className="text-accent underline" to="/contact">contact us</Link>.</li>}
            </ul>
            <div className="order-1 h-[380px] overflow-hidden rounded-3xl border border-line shadow-[var(--shadow-float)] lg:sticky lg:top-24 lg:order-2 lg:h-[720px]">
              <Suspense fallback={<div className="h-full animate-pulse bg-pearl" />}><StudioMap studios={list} active={active} onSelect={onSelect} /></Suspense>
            </div>
          </div>
        </div>
      </section>

      <section className="section !pt-10">
        <div className="container-x">
          <h2 className="display-md">Our locations</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
            {cityImages.map((c) => (
              <button key={c.name} onClick={() => { set('city', c.name); window.scrollTo({ top: 300, behavior: 'smooth' }) }} className="group relative aspect-[3/4] overflow-hidden rounded-2xl text-left">
                <img src={c.image} alt={c.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span className="absolute bottom-3 left-3 font-display text-lg text-white">{c.name}<span className="block font-sans text-xs text-white/70">{studios.filter((s) => s.city === c.name).length} studio(s)</span></span>
              </button>
            ))}
          </div>
          <p className="mt-10 rounded-2xl bg-pearl p-5 text-sm text-muted">Studio details were migrated from our previous website and are being re-verified. Please call the studio before visiting.</p>
        </div>
      </section>
    </>
  )
}
