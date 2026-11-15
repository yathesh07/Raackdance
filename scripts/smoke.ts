// Post-build smoke checks: prerendered routes have unique titles, sitemap/robots/redirects exist and cover every old URL.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import redirects from '../src/content/redirects.json'

const dist = new URL('../dist/', import.meta.url).pathname
let fail = 0
const ok = (c: boolean, m: string) => { console.log(`${c ? '✓' : '✗'} ${m}`); if (!c) fail++ }
const htmls: string[] = []
const walk = (d: string) => readdirSync(d).forEach((f) => { const p = join(d, f); if (statSync(p).isDirectory()) { if (!p.includes('/assets') && !p.includes('/media')) walk(p) } else if (f === 'index.html') htmls.push(p) })
ok(existsSync(dist), 'dist exists (run npm run build first)')
walk(dist)
const titles = htmls.map((h) => readFileSync(h, 'utf8').match(/<title>([^<]*)/)?.[1] ?? '')
ok(htmls.length >= 70, `${htmls.length} prerendered HTML files`)
ok(new Set(titles).size === titles.length, 'all page titles unique')
ok(htmls.every((h) => /rel="canonical"/.test(readFileSync(h, 'utf8'))), 'every page has a canonical URL')
const sm = readFileSync(join(dist, 'sitemap.xml'), 'utf8')
ok((sm.match(/<loc>/g) ?? []).length >= 70, 'sitemap lists all public routes')
ok(!sm.includes('/admin'), 'sitemap excludes admin')
ok(readFileSync(join(dist, 'robots.txt'), 'utf8').includes('Disallow: /admin'), 'robots disallows /admin')
const old = Object.keys(redirects)
const ht = readFileSync(join(dist, '.htaccess'), 'utf8'), nf = readFileSync(join(dist, '_redirects'), 'utf8')
ok(old.every((u) => ht.includes(u.slice(1).replace(/\./g, '\\.'))), `.htaccess covers all ${old.length} old URLs`)
ok(old.every((u) => nf.includes(u + ' ')), `_redirects covers all ${old.length} old URLs`)
ok(!readdirSync(join(dist, 'assets')).some((f) => readFileSync(join(dist, 'assets', f), 'utf8').includes('service_role')), 'no service-role secret in bundle')
process.exit(fail ? 1 : 0)
