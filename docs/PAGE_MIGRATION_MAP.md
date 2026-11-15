# Page Migration Map

Every URL discovered on raackdance.com (crawl of navigation, header/footer fragments, sitemap.xml and internal links on 15 Nov 2026) mapped to its new route. All old URLs return **301** to the new route via `public/.htaccess` (Apache — current host), `public/_redirects` (Netlify) and `vercel.json`, plus a client-side fallback in `src/lib/legacyRedirects.ts`.

Old URL slugs were keyword-based and did not match their content (e.g. `/dance-classes-for-adults.html` was the Choreo Lab page), so descriptive routes are used instead.

## Old → new

| Old URL | Content | HTTP | New URL |
|---|---|---|---|
| `/` | Homepage | 200 | `/` |
| `/index.html` | Homepage | 200 | `/` (301) |
| `/header.html` | Shared header fragment (jQuery .load) | 200 | `/` (301) |
| `/footer.html` | Shared footer fragment (jQuery .load) | 200 | `/` (301) |
| `/dance-studios-in-chennai.html` | Studio directory (52 links) | 200 | `/studios` (301) |
| `/store-locator.html` | Leaflet store locator (52 studios w/ coordinates) | 200 | `/studios` (301) |
| `/dance-classes-in-chennai.html` | Courses listing (6 programs) | 200 | `/programs` (301) |
| `/dance-academy-chennai.html` | Program: Little Legends | 200 | `/programs/little-legends` (301) |
| `/dance-academy-classes.html` | Program: Level Up (page titled FLOW COURSE) | 200 | `/programs/level-up` (301) |
| `/dance-classes-for-kids.html` | Program: RDEP | 200 | `/programs/rdep` (301) |
| `/dance-classes-for-adults.html` | Program: Choreo Lab | 200 | `/programs/choreo-lab` (301) |
| `/dance-schools.html` | Program: Film Covers | 200 | `/programs/film-covers` (301) |
| `/dance-academy.html` | Program: Dance Fitness | 200 | `/programs/dance-fitness` (301) |
| `/dance-classes.html` | Program: Just Dance (orphan — not linked from nav) | 200 | `/programs/just-dance` (301) |
| `/dance-schools-in-chennai.html` | Events & Galleries overview | 200 | `/events` (301) |
| `/dance-studios-chennai.html` | Event: Heal The World | 200 | `/events/heal-the-world` (301) |
| `/dance-schools-chennai.html` | Event: Happy Feet 2026 | 200 | `/events/happy-feet` (301) |
| `/dance-classes-chennai.html` | Event: First Step 2027 | 200 | `/events/first-step` (301) |
| `/choreo-camp-chennai.html` | Event: Choreo Camp 2027 | 200 | `/events/camp-raack` (301) |
| `/faculties-training-academy.html` | Faculties Training Academy (FTA) | 200 | `/faculty-academy` (301) |
| `/dance-academy-in-chennai.html` | Careers (5 positions) | 200 | `/careers` (301) |
| `/dance-classes-for-kids-in-chennai.html` | Franchise | 200 | `/franchise` (301) |
| `/dance-classes-for-adults-in-chennai.html` | Contact | 200 | `/contact` (301) |
| `/online-dance-classes.html` | Online Academy | 200 | `/online-academy` (301) |
| `/enquiry-form.html` | Online free-trial registration form | 200 | `/book-a-free-trial?type=online` (301) |
| `/mail/conmail.php` | Form handler (PHP POST endpoint) | 200 | `/contact` (301) |
| `/mail/conmail-studio.php` | Form handler (PHP POST endpoint) | 200 | `/contact` (301) |
| `/mail/conmail-careers.php` | Form handler (PHP POST endpoint) | 200 | `/careers` (301) |
| `/mail/conmail-event.php` | Form handler (PHP POST endpoint) | 200 | `/events` (301) |
| `/mail/mail.php` | Form handler (PHP POST endpoint) | 200 | `/contact` (301) |
| `/studios-ambattur.html` | Studio: Ambattur | 200 | `/studios/ambattur` (301) |
| `/studios-arumbakkam.html` | Studio: Arumbakkam | 200 | `/studios/arumbakkam` (301) |
| `/studios-avadi.html` | Studio: Avadi | 200 | `/studios/avadi` (301) |
| `/studios-ayapakkam.html` | Studio: Ayapakkam | 200 | `/studios/ayapakkam` (301) |
| `/studios-basavanagudi.html` | Studio: Basavanagudi | 200 | `/studios/basavanagudi` (301) |
| `/studios-chidambaram.html` | Studio: Chidambaram | 200 | `/studios/chidambaram` (301) |
| `/studios-cuddalore.html` | Studio: Cuddalore | 200 | `/studios/cuddalore` (301) |
| `/studios-guduvanchery.html` | Studio: Guduvanchery | 200 | `/studios/guduvanchery` (301) |
| `/studios-hasthinapuram.html` | Studio: Hasthinapuram | 200 | `/studios/hasthinapuram` (301) |
| `/studios-iyyappanthangal.html` | Studio: Iyyappanthangal | 200 | `/studios/iyyappanthangal` (301) |
| `/studios-kandigai.html` | Studio: Kandigai | 200 | `/studios/kandigai` (301) |
| `/studios-kattur.html` | Studio: Kattur | 200 | `/studios/kattur` (301) |
| `/studios-keelkattalai.html` | Studio: Keelkattalai | 200 | `/studios/keelkattalai` (301) |
| `/studios-kelambakkam.html` | Studio: Kelambakkam | 200 | `/studios/kelambakkam` (301) |
| `/studios-kilpauk.html` | Studio: Kilpauk | 200 | `/studios/kilpauk` (301) |
| `/studios-kolapakkam.html` | Studio: Kolapakkam | 200 | `/studios/kolapakkam` (301) |
| `/studios-kolathur.html` | Studio: Kolathur | 200 | `/studios/kolathur` (301) |
| `/studios-kumbakonam.html` | Studio: Kumbakonam | 200 | `/studios/kumbakonam` (301) |
| `/studios-kundrathur.html` | Studio: Kundrathur | 200 | `/studios/kundrathur` (301) |
| `/studios-madambakkam.html` | Studio: Madambakkam | 200 | `/studios/madambakkam` (301) |
| `/studios-maduravoyal.html` | Studio: Maduravoyal | 200 | `/studios/maduravoyal` (301) |
| `/studios-mannivakkam.html` | Studio: Mannivakkam | 200 | `/studios/mannivakkam` (301) |
| `/studios-mappedu.html` | Studio: Mappedu | 200 | `/studios/mappedu` (301) |
| `/studios-maraimalainagar.html` | Studio: Maraimalai Nagar | 200 | `/studios/maraimalai-nagar` (301) |
| `/studios-medavakkam.html` | Studio: Medavakkam | 200 | `/studios/medavakkam` (301) |
| `/studios-mogappair.html` | Studio: Mogappair | 200 | `/studios/mogappair` (301) |
| `/studios-mugalivakkam.html` | Studio: Mugalivakkam | 200 | `/studios/mugalivakkam` (301) |
| `/studios-mylapore.html` | Studio: Mylapore | 200 | `/studios/mylapore` (301) |
| `/studios-navalur.html` | Studio: Navalur | 200 | `/studios/navalur` (301) |
| `/studios-neelankarai.html` | Studio: Neelankarai | 200 | `/studios/neelankarai` (301) |
| `/studios-old-perungalathur.html` | Studio: Old Perungalathur | 200 | `/studios/old-perungalathur` (301) |
| `/studios-oldpallavaram.html` | Studio: Old Pallavaram | 200 | `/studios/old-pallavaram` (301) |
| `/studios-padappai.html` | Studio: Padappai | 200 | `/studios/padappai` (301) |
| `/studios-padur.html` | Studio: Padur | 200 | `/studios/padur` (301) |
| `/studios-pallikaranai.html` | Studio: Pallikaranai | 200 | `/studios/pallikaranai` (301) |
| `/studios-pammal.html` | Studio: Pammal | 200 | `/studios/pammal` (301) |
| `/studios-perumbakkam.html` | Studio: Perumbakkam | 200 | `/studios/perumbakkam` (301) |
| `/studios-polachery.html` | Studio: Polachery | 200 | `/studios/polachery` (301) |
| `/studios-pondicherry.html` | Studio: Puducherry | 200 | `/studios/pondicherry` (301) |
| `/studios-pudupakkam.html` | Studio: Pudupakkam | 200 | `/studios/pudupakkam` (301) |
| `/studios-ramapuram.html` | Studio: Ramapuram | 200 | `/studios/ramapuram` (301) |
| `/studios-saidapet.html` | Studio: Saidapet | 200 | `/studios/saidapet` (301) |
| `/studios-sholinganallur.html` | Studio: Sholinganallur | 200 | `/studios/sholinganallur` (301) |
| `/studios-sithalapakkam.html` | Studio: Sithalapakkam | 200 | `/studios/sithalapakkam` (301) |
| `/studios-surapet.html` | Studio: Surapet | 200 | `/studios/surapet` (301) |
| `/studios-tambaram.html` | Studio: Tambaram | 200 | `/studios/tambaram` (301) |
| `/studios-thanjavur.html` | Studio: Thanjavur | 200 | `/studios/thanjavur` (301) |
| `/studios-thiruverkadu.html` | Studio: Thiruverkadu | 200 | `/studios/thiruverkadu` (301) |
| `/studios-thoraipakkam.html` | Studio: Thoraipakkam | 200 | `/studios/thoraipakkam` (301) |
| `/studios-urapakkam.html` | Studio: Urapakkam | 200 | `/studios/urapakkam` (301) |
| `/studios-velachery.html` | Studio: Velachery | 200 | `/studios/velachery` (301) |
| `/studios-vyasarbadi.html` | Studio: Vyasarpadi | 200 | `/studios/vyasarpadi` (301) |

## New pages (no old equivalent)

| New URL | Purpose |
|---|---|
| `/about` | About Raack — story, philosophy, core team (content previously only on homepage) |
| `/gallery` | Consolidated gallery from event/studio galleries |
| `/book-a-free-trial` | Unified enquiry flow (trial / general / program / studio / online / franchise / careers) |
| `/privacy`, `/terms` | Draft legal pages — **owner/legal review required before launch** |
| `/admin/*` | Staff dashboard (noindex) |

## Non-page URLs found

- `/sitemap.xml` — 28 URLs, last modified 2024-01-25 (outdated; 25 studio pages and most new pages missing) → regenerated at build.
- `/robots.txt` — allow all → regenerated.
- `/captcha.php` — image CAPTCHA → replaced by Cloudflare Turnstile.
- External: `https://raackdance.co.in/` (event ticketing) — kept as outbound link.
