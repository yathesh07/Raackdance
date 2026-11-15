import map from '@/content/redirects.json'
const m = map as Record<string, string>
/** Client-side fallback for old .html URLs (server 301s are primary — see public/.htaccess). */
export function legacyTarget(pathname: string): string | null {
  const p = pathname.replace(/\/+$/, '') || '/'
  return m[p] ?? m[p.toLowerCase()] ?? null
}
