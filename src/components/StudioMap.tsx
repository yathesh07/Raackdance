import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { StudioVM } from '@/lib/content'

// Default: OpenStreetMap standard tiles (free, attribution required, fair-use policy).
// For production traffic set VITE_MAP_TILES_URL to a keyed provider (e.g. MapTiler / Stadia) — see docs/ARCHITECTURE.md.
const TILES = (import.meta.env.VITE_MAP_TILES_URL as string | undefined) || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
const ATTRIB = (import.meta.env.VITE_MAP_TILES_ATTRIBUTION as string | undefined) || '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

/** Leaflet studio map with brand-styled markers. */
export default function StudioMap({ studios, active, onSelect, className }: { studios: StudioVM[]; active?: string | null; onSelect?: (slug: string) => void; className?: string }) {
  const el = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const markers = useRef<Record<string, L.Marker>>({})

  useEffect(() => {
    if (!el.current || map.current) return
    const m = L.map(el.current, { zoomControl: false, scrollWheelZoom: false, attributionControl: true }).setView([12.95, 80.2], 10)
    L.control.zoom({ position: 'bottomright' }).addTo(m)
    L.tileLayer(TILES, { attribution: ATTRIB, maxZoom: 19 }).addTo(m)
    m.on('focus', () => m.scrollWheelZoom.enable()); m.on('blur', () => m.scrollWheelZoom.disable())
    map.current = m
    return () => { m.remove(); map.current = null; markers.current = {} }
  }, [])

  useEffect(() => {
    const m = map.current; if (!m) return
    Object.values(markers.current).forEach((mk) => mk.remove()); markers.current = {}
    const pts: L.LatLngExpression[] = []
    studios.forEach((s) => {
      if (s.lat == null || s.lng == null) return
      const icon = L.divIcon({ className: 'raack-pin', html: '<span></span>', iconSize: [18, 18], iconAnchor: [9, 9] })
      const mk = L.marker([s.lat, s.lng], { icon, title: `Raack ${s.name}`, keyboard: true, alt: `Raack ${s.name}` }).addTo(m)
      mk.bindPopup(`<strong style="font-family:var(--font-display);font-size:15px">Raack ${s.name}</strong><br/><span style="color:#6b645c;font-size:12px">${s.city}</span><br/><a href="/studios/${s.slug}" style="color:#ec1d25;font-weight:600;font-size:12px">View studio →</a>`)
      mk.on('click', () => onSelect?.(s.slug))
      markers.current[s.slug] = mk; pts.push([s.lat, s.lng])
    })
    if (pts.length > 1) m.fitBounds(L.latLngBounds(pts), { padding: [40, 40], maxZoom: 12 })
    else if (pts.length === 1) m.setView(pts[0], 14)
  }, [studios, onSelect])

  useEffect(() => {
    Object.entries(markers.current).forEach(([slug, mk]) => mk.getElement()?.classList.toggle('active', slug === active))
    if (active && markers.current[active] && map.current) {
      map.current.flyTo(markers.current[active].getLatLng(), 14, { duration: 0.8 }); markers.current[active].openPopup()
    }
  }, [active])

  return <div ref={el} className={className ?? 'h-full w-full'} role="region" aria-label="Map of Raack studios" />
}
