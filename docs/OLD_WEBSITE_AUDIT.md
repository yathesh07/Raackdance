# Old Website Audit — raackdance.com

Crawled 15 Nov 2026 with a link-following crawler (homepage, `sitemap.xml`, jQuery-loaded `header.html` / `footer.html`, all internal links) plus probing of common paths (about, contact, gallery, faq, privacy, terms, programs, careers…). Raw HTML for every page is in `_audit/html/`, readable text in `_audit/text/`.

## 1. Technology

| Area | Finding |
|---|---|
| Stack | Static HTML pages, Bootstrap 4, jQuery 2/3 (both loaded), Owl Carousel, Slick, counter-up, lazyload. Header/footer injected client-side with `$.load()` → navigation invisible to crawlers that don't run JS. |
| Server | Apache on 103.14.122.193 (raackdance.com). Image directory is hotlink-protected (403 without Referer). |
| Forms | 5 PHP mail handlers (`mail/conmail.php`, `-studio`, `-careers`, `-event`, `mail.php`). Image CAPTCHA (`captcha.php`). No database, no lead tracking, no confirmation flow. |
| Map | Leaflet + OSM on `store-locator.html` with a hard-coded array of 52 studios (address, phone, lat/lng). |
| SEO | Identical `<title>` and keyword-stuffed meta description on every page. Keyword-based URLs that don't match content (`/dance-classes-for-adults.html` = Choreo Lab). Alt text on every image is a random "Dance classes in <area>" keyword. `sitemap.xml` last updated 2024-01-25 (28 URLs; misses 25 studio pages, FTA, careers, online, events). No canonical, no Open Graph, no structured data. |
| Performance | 124 MB of images (2400×2400 PNG program cards, 18 MB GIF banner), 150 MB of MP4. Two copies of jQuery and Bootstrap. |
| Accessibility | Headings used for styling (h4–h6 everywhere), duplicate decorative text in headings, no form labels on most forms, low-contrast red-on-white small text. |
| Analytics | None detected. |

## 2. Page inventory (89 URLs fetched, 81 HTML pages)

| Group | Count | Pages |
|---|---|---|
| Home | 1 | `/`, `/index.html` |
| Programs | 8 | listing + Little Legends, Level Up/Flow, RDEP, Choreo Lab, Film Covers, Dance Fitness, Just Dance (orphan) |
| Events | 5 | overview + Heal The World, Happy Feet, First Step, Choreo Camp |
| Studios | 54 | directory, store locator, 52 studio pages |
| Other | 6 | Online Academy, Online trial form, FTA, Careers, Franchise, Contact |
| Fragments | 2 | header.html, footer.html |
| Form handlers | 5 | mail/*.php |

Not found (404) despite probing: about, contact, gallery, faq, privacy-policy, terms, blog, programs, any per-program slug pages.

Duplicate / alternate URLs linked from nav that resolve to the same content type: `dance-academy-chennai.html` vs `dance-academy-in-chennai.html` (different content), `dance-schools.html` vs `dance-schools-in-chennai.html` vs `dance-schools-chennai.html` (three different pages) — confusing but each is mapped.

## 3. Navigation (old)

Header: Studio · Events & Galleries (Choreo Camp, Heal The World, Happy Feet, First Step) · Courses · FTA · Careers · Franchisee · Studio Locator · Contact · "Register for free Online Trial Class". Footer: Discover links, Upcoming events (Happy Feet 2026, First Step 2027, Camp Raack 2027 → `#`), 50 studio links, phone, email, socials.

## 4. Content summary

See `CONTENT_INVENTORY.md` for the full extraction. Highlights:
- 7 programs (6 in current course listing + orphan "Just Dance").
- 52 studios with address, coordinates, phones, map embeds, weekly class schedule, and branch-head names/photos (42 studios).
- 5 core-team members, 6 student testimonials, 4 franchise testimonials, 3 staff testimonials.
- 4 events, 5 career positions, FTA, Franchise and Online Academy pages.
- 21 YouTube shorts, 5 videos, ~190 images.

## 5. Key problems the rebuild fixes

1. No lead database → Supabase enquiries table with status pipeline, assignment, notes, UTM tracking.
2. Content edits require code → admin dashboard with role-based access.
3. Copy-pasted / placeholder content → flagged and hidden until verified (MISSING_INFORMATION.md).
4. SEO: unique titles/descriptions per page, canonical, OG, JSON-LD (Organization + verified studio LocalBusiness), current sitemap, 301 map for all 81 URLs.
5. Performance: images 124 MB → 8.4 MB (WebP), lazy 3D, code-split admin.
6. Child-safety: consent status on every media item and testimonial; nothing new is published without consent.

## 6. Limitations of this audit

- Old CAPTCHA-protected forms were not submitted (would send real emails).
- `raackdance.co.in` (ticketing) is a separate site and was not crawled.
- Studio "hours", "offer" and "status" fields in the store-locator data look like developer placeholders (e.g. "Beach batch" for 35 studios, "Military discount") and are **not** migrated to the public site.
- Whether each branch is still operating cannot be determined from the website; all studios are imported with `status = unverified`.
