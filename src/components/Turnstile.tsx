import { useEffect, useRef } from 'react'
import { env } from '@/lib/env'

declare global { interface Window { turnstile?: any; __tsLoading?: Promise<void> } }

function load() {
  if (window.turnstile) return Promise.resolve()
  if (!window.__tsLoading)
    window.__tsLoading = new Promise((res, rej) => {
      const s = document.createElement('script')
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'; s.async = true
      s.onload = () => res(); s.onerror = rej; document.head.appendChild(s)
    })
  return window.__tsLoading
}

/** Cloudflare Turnstile (privacy-friendly CAPTCHA). Renders nothing when no site key is configured. */
export function Turnstile({ onToken }: { onToken: (t: string) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!env.turnstileSiteKey) return
    let id: string | undefined
    load().then(() => {
      if (!ref.current) return
      id = window.turnstile.render(ref.current, { sitekey: env.turnstileSiteKey, callback: onToken, 'expired-callback': () => onToken(''), theme: 'light' })
    }).catch(() => {})
    return () => { if (id && window.turnstile) window.turnstile.remove(id) }
  }, [onToken])
  if (!env.turnstileSiteKey) return null
  return <div ref={ref} className="min-h-[65px]" />
}
