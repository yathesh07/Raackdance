export const cn = (...a: (string | false | null | undefined)[]) => a.filter(Boolean).join(' ')
export const fmtPhone = (n: string) => (n.length === 10 ? `+91 ${n.slice(0, 5)} ${n.slice(5)}` : n)
export const telHref = (n: string) => `tel:+91${n.replace(/\D/g, '').slice(-10)}`
export const waHref = (n: string, text = '') => `https://wa.me/${n.replace(/\D/g, '')}${text ? `?text=${encodeURIComponent(text)}` : ''}`
export const ytThumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
export const fmtNum = (n: number) => n.toLocaleString('en-IN')
export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371, dLat = ((b.lat - a.lat) * Math.PI) / 180, dLng = ((b.lng - a.lng) * Math.PI) / 180
  const x = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(x))
}
export const fmtDate = (s?: string | null) => (s ? new Date(s).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—')
