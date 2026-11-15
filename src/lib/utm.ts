// Captures UTM parameters, referrer and landing page on first visit (session-scoped) for lead source tracking.
const KEY = 'raack-attribution'
export type Attribution = { utm: Record<string, string>; referrer: string | null; landing_page: string | null }

export function captureAttribution() {
  try {
    if (sessionStorage.getItem(KEY)) return
    const params = new URLSearchParams(window.location.search)
    const utm: Record<string, string> = {}
    ;['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'].forEach((k) => {
      const v = params.get(k); if (v) utm[k] = v.slice(0, 200)
    })
    const ref = document.referrer && !document.referrer.includes(window.location.host) ? document.referrer : null
    sessionStorage.setItem(KEY, JSON.stringify({ utm, referrer: ref, landing_page: window.location.pathname + window.location.search }))
  } catch { /* */ }
}
export function getAttribution(): Attribution {
  try { return JSON.parse(sessionStorage.getItem(KEY) || '') } catch { return { utm: {}, referrer: null, landing_page: null } }
}
