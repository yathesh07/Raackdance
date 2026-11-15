import { useEffect, useState } from 'react'
export function useMediaQuery(q: string) {
  const [m, set] = useState(() => (typeof window !== 'undefined' ? window.matchMedia(q).matches : false))
  useEffect(() => {
    const mq = window.matchMedia(q); const on = () => set(mq.matches)
    mq.addEventListener('change', on); on(); return () => mq.removeEventListener('change', on)
  }, [q])
  return m
}
export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')
export function hasWebGL() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')) } catch { return false }
}
