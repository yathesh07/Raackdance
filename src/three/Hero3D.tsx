import { lazy, Suspense, useEffect, useState } from 'react'
import { hasWebGL, useMediaQuery, useReducedMotion } from '@/hooks/useMedia'

const HeroScene = lazy(() => import('./HeroScene'))

/** Static, zero-JS-cost fallback (also shown while the 3D chunk loads). */
export function RibbonFallback() {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="rf1" x1="0" x2="1"><stop offset="0" stopColor="#ec1d25" stopOpacity="0" /><stop offset=".4" stopColor="#ec1d25" /><stop offset=".7" stopColor="#b8121a" /><stop offset="1" stopColor="#ec1d25" stopOpacity="0" /></linearGradient>
        <linearGradient id="rf2" x1="0" x2="1"><stop offset="0" stopColor="#e9e0d2" stopOpacity="0" /><stop offset=".5" stopColor="#fffaf2" /><stop offset="1" stopColor="#e9e0d2" stopOpacity="0" /></linearGradient>
        <filter id="rfs"><feDropShadow dx="0" dy="18" stdDeviation="18" floodOpacity=".18" /></filter>
      </defs>
      <path filter="url(#rfs)" d="M-50 470 C 200 300, 380 620, 620 420 S 1000 200, 1260 360 L 1260 410 C 1000 260, 860 560, 620 480 S 220 380, -50 540 Z" fill="url(#rf2)" />
      <path filter="url(#rfs)" d="M-50 360 C 180 200, 420 520, 640 330 S 980 160, 1260 290 L 1260 330 C 1000 230, 860 480, 640 390 S 210 290, -50 420 Z" fill="url(#rf1)" />
    </svg>
  )
}

export default function Hero3D() {
  const reduced = useReducedMotion()
  const small = useMediaQuery('(max-width: 767px)')
  const [ok, setOk] = useState(false)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if (!hasWebGL()) return
    // Defer heavy 3D until the browser is idle so it never blocks first paint / LCP.
    const go = () => setOk(true)
    const w = window as any
    const id = w.requestIdleCallback ? w.requestIdleCallback(go, { timeout: 1200 }) : setTimeout(go, 600)
    return () => (w.cancelIdleCallback ? w.cancelIdleCallback(id) : clearTimeout(id))
  }, [])
  useEffect(() => { if (ok) { const t = setTimeout(() => setReady(true), 300); return () => clearTimeout(t) } }, [ok])
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? 'opacity-0' : 'opacity-100'}`}><RibbonFallback /></div>
      {ok && (
        <Suspense fallback={null}>
          <div className={`pointer-events-auto absolute inset-0 transition-opacity duration-[1500ms] ${ready ? 'opacity-100' : 'opacity-0'}`}>
            <HeroScene lite={small} still={reduced} />
          </div>
        </Suspense>
      )}
    </div>
  )
}
