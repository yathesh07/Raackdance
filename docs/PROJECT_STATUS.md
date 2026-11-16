# Project Status — 15 Nov 2026

## Done

| Area | Status |
|---|---|
| Old-site audit | 89 URLs crawled (incl. jQuery header/footer fragments, sitemap, orphan pages), 81 HTML pages, 52 studios, 199 media files, 21 YouTube embeds. 5 audit docs in `docs/` |
| Assets | Downloaded (hotlink-protected) → WebP/H.264: 274 MB → ~45 MB. Original files kept in `_audit/assets/` |
| Design system | Ivory/pearl + charcoal + Raack red `#EC1D25`, Fraunces + Manrope, motion primitives, cards, forms |
| 3D | Silk-ribbon hero (R3F, physical sheen material, pointer-reactive, intro sweep), idle-loaded, mobile-lite, reduced-motion still, SVG fallback for no-WebGL |
| Public pages | Home (12 sections), About, Programs + 7 program pages, Studio finder (search, city/program filter, near-me, map) + 52 studio pages with timetables, Online Academy, Events + 4 event pages, Faculty Academy, Gallery (filters + lightbox), Careers, Franchise, Contact, Book a Free Trial, Privacy/Terms (draft), 404 |
| Forms | One enquiry system for trial / program / studio / online / general / franchise / careers / faculty / event; guardian consent; UTM + referrer + landing page capture; honeypot + Turnstile |
| Backend | Supabase schema, RLS (tested on Postgres), audit triggers, storage bucket rules, stats RPC, rate limiter, `submit-enquiry` + `admin-users` edge functions, generated seed (all migrated content) |
| Admin | 14 modules: Overview, Enquiries (pipeline, assignment, notes, follow-ups, CSV), Programs, Studios, Class schedules, Instructors (core team + branch heads), Events, Gallery & media (consent), Testimonials (consent), Careers, Pages & SEO, Users & roles, Settings, Audit log |
| SEO | Unique titles/descriptions, canonical, OG, Breadcrumb/Course/DanceSchool JSON-LD, 77 prerendered route HTML files, sitemap (75 URLs), robots, 81 × 301 (.htaccess / _redirects / vercel.json + client fallback) |
| QA | Typecheck clean; production build; all 24 key routes × 2 viewports: 0 console errors, no horizontal overflow; end-to-end flows (submit → admin → status/notes → audit; role scoping for 5 roles; legacy redirects); CWV mobile-throttled LCP 1.5–2.6 s, CLS 0 |

## Pending — needs owner / external accounts

1. **Resolve MISSING_INFORMATION.md** — especially media/testimonial consent, studio verification (52 unverified), Level Up/Flow naming, event dates, contact e-mail domain.
2. Create Supabase project, Turnstile widget, (optional) Resend for lead e-mail alerts — then follow DEPLOYMENT.md.
3. Decide hosting (Netlify/Vercel recommended vs existing Apache) and set up `staging.raackdance.com`.
4. Legal review of the draft Privacy and Terms pages.
5. Real event photos for First Step / Happy Feet / Camp Raack galleries (old site reused 4 generic images).
6. Owner approval → production DNS switch (never done without approval).

## Known limitations

- Demo mode stores admin data in the browser only — for evaluation, not production.
- OpenStreetMap tiles are fine for launch-level traffic; switch `VITE_MAP_TILES_URL` to a keyed provider if traffic grows.
- Real-device testing (iOS Safari, low-end Android) and Lighthouse on the staging CDN should be run during staging.
- `three` chunk is ~930 kB (≈248 kB gzip) but loads only after first paint and is skipped when WebGL is unavailable.

## Changelog
- 16 Nov 2026 — Online classes removed (owner confirmed Raack is offline-only): Online Academy page, nav item, homepage section and online enquiry option removed; `/online-academy`, `/online-dance-classes.html` → `/studios`, `/enquiry-form.html` → `/book-a-free-trial`. Menu overlay switched to ivory. Studio finder: program filter removed; search now geocodes any typed area/landmark/pincode (OpenStreetMap Nominatim) and lists the nearest studios. Hero/heading descender clipping fixed. Phone removed from top nav; Careers & Franchise added.
