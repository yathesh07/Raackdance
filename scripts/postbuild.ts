// Post-build: per-route HTML with correct <title>/meta/canonical/OG/JSON-LD (crawlers that don't run JS still get
// unique metadata), sitemap.xml, robots.txt and server redirect files for every old raackdance.com URL.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { buildSeed, PAGE_META } from '../src/lib/seed'
import redirects from '../src/content/redirects.json'

const SITE = (process.env.VITE_SITE_URL || 'https://raackdance.com').replace(/\/$/, '')
const dist = new URL('../dist/', import.meta.url)
const tpl = readFileSync(new URL('index.html', dist), 'utf8')
const seed = buildSeed()
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const meta = (slug: string) => PAGE_META.find((p) => p.slug === slug)!

type R = { path: string; title: string; desc: string; image?: string; ld?: object; body: string; priority: number }
const routes: R[] = []
const page = (path: string, slug: string, body: string, priority = 0.8, ld?: object) => routes.push({ path, title: meta(slug).title, desc: meta(slug).meta_description, body, priority, ld })

const org = { '@context': 'https://schema.org', '@type': 'DanceSchool', name: 'Raack Academy of Dance', url: SITE, logo: `${SITE}/media/logo.png`, telephone: '+919003024113',
  sameAs: (seed.site_settings.find((s) => s.key === 'socials')?.value ?? []).map((s: any) => s.href), slogan: 'The Amplifiers of Dance As a Way of Life in South India' }
page('/', 'home', '<h1>Raack Academy of Dance</h1><p>The Amplifiers of Dance As a Way of Life in South India.</p>', 1, org)
page('/about', 'about', '<h1>About Raack</h1>')
page('/programs', 'programs', '<h1>Dance programs</h1><ul>' + seed.programs.map((p) => `<li><a href="/programs/${p.slug}">${esc(p.name)} (${esc(p.age_group)})</a></li>`).join('') + '</ul>', 0.9)
page('/studios', 'studios', '<h1>Find a Raack studio</h1><ul>' + seed.studios.map((s) => `<li><a href="/studios/${s.slug}">Raack ${esc(s.name)}, ${esc(s.city)}</a></li>`).join('') + '</ul>', 0.9)
page('/events', 'events', '<h1>Events & Experiences</h1><ul>' + seed.events.map((e) => `<li><a href="/events/${e.slug}">${esc(e.name)}</a></li>`).join('') + '</ul>')
page('/faculty-academy', 'faculty-academy', '<h1>Faculties Training Academy</h1>', 0.6)
page('/gallery', 'gallery', '<h1>Gallery</h1>', 0.6)
page('/careers', 'careers', '<h1>Careers at Raack</h1>', 0.6)
page('/franchise', 'franchise', '<h1>Franchise opportunities</h1>', 0.6)
page('/contact', 'contact', '<h1>Contact Raack</h1><p>+91 90030 24113</p>', 0.7)
page('/book-a-free-trial', 'book-a-free-trial', '<h1>Book a free trial</h1>', 0.8)

for (const p of seed.programs) routes.push({ path: `/programs/${p.slug}`, title: `${p.name} — ${p.age_group} | Raack Dance Programs`, desc: `${p.tagline}. ${p.description.slice(0, 120)}…`, image: p.image ?? undefined, priority: 0.8,
  body: `<h1>${esc(p.name)}</h1><p>${esc(p.description)}</p>`, ld: { '@context': 'https://schema.org', '@type': 'Course', name: p.name, description: p.description, provider: { '@type': 'Organization', name: 'Raack Academy of Dance', sameAs: SITE } } })
for (const s of seed.studios) {
  const progs = [...new Set(seed.class_sessions.filter((c) => c.studio_id === s.id).map((c) => seed.programs.find((p) => p.slug === c.program_slug)?.name).filter(Boolean))]
  routes.push({ path: `/studios/${s.slug}`, title: `Dance Classes in ${s.name}, ${s.city} | Raack Academy of Dance`, image: s.hero ?? undefined, priority: 0.7,
    desc: `Raack ${s.name}: ${s.address}. Programs: ${progs.join(', ') || 'contact studio'}. Call ${s.phones[0] ? '+91 ' + s.phones[0] : '+91 90030 24113'} to book a free trial.`.slice(0, 300),
    body: `<h1>Raack ${esc(s.name)}</h1><p>${esc(s.address)}</p>`,
    ld: { '@context': 'https://schema.org', '@type': 'DanceSchool', name: `Raack Academy of Dance — ${s.name}`, url: `${SITE}/studios/${s.slug}`, address: { '@type': 'PostalAddress', streetAddress: s.address, addressLocality: s.city, addressCountry: 'IN' },
      ...(s.lat ? { geo: { '@type': 'GeoCoordinates', latitude: s.lat, longitude: s.lng } } : {}), ...(s.phones[0] ? { telephone: `+91${s.phones[0]}` } : {}) } })
}
for (const e of seed.events) routes.push({ path: `/events/${e.slug}`, title: `${e.name} ${e.edition} — ${e.subtitle} | Raack Events`, desc: e.summary, image: e.cover ?? undefined, priority: 0.7, body: `<h1>${esc(e.name)}</h1><p>${esc(e.summary)}</p>` })
routes.push({ path: '/privacy', title: 'Privacy Notice | Raack Academy of Dance', desc: 'How Raack Academy of Dance handles information submitted through this website.', body: '<h1>Privacy</h1>', priority: 0 })
routes.push({ path: '/terms', title: 'Terms of Use | Raack Academy of Dance', desc: 'Terms of use for raackdance.com.', body: '<h1>Terms</h1>', priority: 0 })

for (const r of routes) {
  const url = SITE + (r.path === '/' ? '' : r.path)
  const img = SITE + (r.image ?? '/og-image.jpg')
  const head = [
    `<title>${esc(r.title)}</title>`, `<meta name="description" content="${esc(r.desc)}" />`, `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`, `<meta property="og:site_name" content="Raack Academy of Dance" />`, `<meta property="og:title" content="${esc(r.title)}" />`,
    `<meta property="og:description" content="${esc(r.desc)}" />`, `<meta property="og:url" content="${url}" />`, `<meta property="og:image" content="${img}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`, r.priority === 0 ? '<meta name="robots" content="noindex" />' : '',
    r.ld ? `<script type="application/ld+json">${JSON.stringify(r.ld)}</script>` : '',
  ].filter(Boolean).join('\n    ')
  const html = tpl.replace(/<!--SEO-->[\s\S]*?<!--\/SEO-->/, head).replace('<div id="root"></div>', `<div id="root"></div><div id="seo-fallback" hidden>${r.body}</div>`)
  const dir = new URL('.' + (r.path === '/' ? '/' : r.path + '/'), dist)
  mkdirSync(dir, { recursive: true })
  writeFileSync(new URL('index.html', dir), html)
}

const today = new Date().toISOString().slice(0, 10)
writeFileSync(new URL('sitemap.xml', dist), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.filter((r) => r.priority > 0).map((r) => `  <url><loc>${SITE}${r.path === '/' ? '/' : r.path}</loc><lastmod>${today}</lastmod><priority>${r.priority.toFixed(1)}</priority></url>`).join('\n')}\n</urlset>\n`)
writeFileSync(new URL('robots.txt', dist), `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${SITE}/sitemap.xml\n`)

// Redirect files for each hosting option
const map = redirects as Record<string, string>
writeFileSync(new URL('_redirects', dist), Object.entries(map).map(([a, b]) => `${a} ${b} 301!`).join('\n') + '\n/* /index.html 200\n')
writeFileSync(new URL('.htaccess', dist), `# Generated by scripts/postbuild.ts
Options -MultiViews
DirectorySlash Off
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
RewriteCond %{HTTP_HOST} ^www\\.raackdance\\.com$ [NC]
RewriteRule ^ https://raackdance.com%{REQUEST_URI} [L,R=301]

# 301s from the old site
${Object.entries(map).map(([a, b]) => `RewriteRule ^${a.slice(1).replace(/\./g, '\\.')}$ ${b.replace('?', '\\?')} [R=301,L,NE]`).join('\n')}

# Prerendered routes: /studios/velachery → /studios/velachery/index.html (no trailing-slash redirect)
RewriteCond %{DOCUMENT_ROOT}/$1/index.html -f
RewriteRule ^(.+?)/?$ /$1/index.html [L]

# SPA fallback
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ /index.html [L]

<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set Permissions-Policy "geolocation=(self), camera=(), microphone=()"
  <FilesMatch "\\.(js|css|woff2|webp|jpg|png|mp4)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
  <FilesMatch "\\.html$">
    Header set Cache-Control "no-cache"
  </FilesMatch>
</IfModule>
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json image/svg+xml
</IfModule>
`)
writeFileSync(new URL('../vercel.json', import.meta.url), JSON.stringify({
  cleanUrls: true, trailingSlash: false,
  redirects: Object.entries(map).map(([source, destination]) => ({ source, destination, permanent: true })),
  rewrites: [{ source: '/((?!api|assets|media|.*\\..*).*)', destination: '/index.html' }],
  headers: [{ source: '/(assets|media)/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
    { source: '/(.*)', headers: [{ key: 'X-Content-Type-Options', value: 'nosniff' }, { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }, { key: 'X-Frame-Options', value: 'SAMEORIGIN' }] }],
}, null, 2))
console.log(`postbuild: ${routes.length} prerendered routes, sitemap (${routes.filter((r) => r.priority > 0).length} URLs), robots, _redirects, .htaccess, vercel.json`)
