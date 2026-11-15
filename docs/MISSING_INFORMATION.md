# Missing / Inconsistent Information — Owner Verification Required

Items below were found on the old site and need confirmation. The new site handles each conservatively (shown how in the **Handling** column). Owner can resolve most of them directly in the admin dashboard.

## A. Global

| # | Issue | Old site evidence | Handling in new site |
|---|---|---|---|
| A1 | **Years of expertise** inconsistent | 28 (home, locator), 27 (franchise), "25+ years" (online) | Shows **28**; editable in Admin → Settings |
| A2 | **Studio count** | "45+" stats, store locator lists 52, contact says "40 vibrant branches in Chennai" | Shows "45+" stat; directory lists all 52 marked *unverified* |
| A3 | **Email addresses** — 3 variants, 2 domains | admin@raack.in, enquiry@raack.com, Admin@raack.com | Primary admin@raack.in, enquiries enquiry@raack.com. Confirm which domain (raack.in vs raack.com) is live |
| A4 | X/Twitter link is a placeholder | `https://x.com/your-profile` | Removed |
| A5 | No privacy policy / terms / FAQs exist | — | Draft privacy & terms pages created, marked **DRAFT – pending legal review**; no FAQs invented |
| A6 | Fees / pricing | Not on site | Not shown |
| A7 | Registration notice "academic year 2026–2027 open" | Home | Shown; editable in Settings |
| A8 | Ticketing site `raackdance.co.in` | Events pages | Linked as-is; confirm it is still active |
| A9 | **Media consent** for children's photos/videos/testimonials | None recorded | Every media/testimonial row seeded `consent_status='unknown'`. Public site shows migrated legacy media (already public). **Before launch the owner must confirm consent or unpublish items** |

## B. Programs

| # | Issue | Handling |
|---|---|---|
| B1 | **Level Up vs Flow Course** — course card says "Level Up" (5.5–7 yrs) but the detail page heading is "FLOW COURSE" and its body text is copied from Little Legends with "Age 03–06" | Named "Level Up (Flow Course)", 5.5–7 yrs, tagline used as description. Confirm name, age band and full description |
| B2 | "What to expect" bullet list on Little Legends, RDEP, Dance Fitness, Just Dance is a copy of the Film Covers list (mentions cinema/film songs) | Hidden for those programs; shown only for Film Covers and Level Up. Supply genuine outcomes |
| B3 | **Just Dance** exists (orphan page + home course list + form) but not in the courses listing | Published with notice "availability varies by studio". Confirm if still offered |
| B4 | Dance Fitness has no videos | None shown |
| B5 | RDEP levels (Level 1/2, "intermediate", "senior") appear only in schedules | Shows Level 1 & 2 |
| B6 | Choreo Lab age: "7–12 · 13+" but schedules also list "Choreo Lab Adult" | As listed on program page |

## C. Events

| # | Issue | Handling |
|---|---|---|
| C1 | **Heal The World** facts conflict: overview says *29 Aug 2023, 1200 students, VR Mall*; event page says *Season 4, Aug 24 & 25 2024, VR Mahal, 1800+ kids*; heading says "2026" | Event page values used (Season 4, Aug 2024, 1800+), venue "VR Mall, Chennai". Marked `dates_verified=false` |
| C2 | **Happy Feet 2026** date "NOVEMBER - 30", venue "coming soon" | Shown as "30 November · venue TBA". Confirm |
| C3 | **First Step 2027** — "4000+ participants" headline vs "over 400" in body; Feb 2027, venue TBA | "4000+" stat kept, body number removed. Confirm |
| C4 | **Camp Raack / Choreo Camp 2027** page reuses First Step recital copy; footer link was `#` | Only camp-specific facts shown (categories, "dates coming soon") |
| C5 | Event galleries for First Step / Happy Feet / Camp reuse the same 4 generic images | Shown as generic highlights; provide real event photos |
| C6 | No Event structured data published | Will be enabled per event once dates are verified (`dates_verified`) |

## D. Studios
| Studio | Issues |
|---|---|
| Avadi | Class schedule is identical to other studios on the old site (likely template) — verify. |
| Basavanagudi | Class schedule is identical to other studios on the old site (likely template) — verify. |
| Cuddalore | Old locator listed city as 'Chennai', address indicates Cuddalore. |
| Iyyappanthangal | Class schedule is identical to other studios on the old site (likely template) — verify. |
| Kandigai | Class schedule is identical to other studios on the old site (likely template) — verify. |
| Kattur | Old locator listed city as 'Chennai', address indicates Tiruchirappalli.<br>Class schedule is identical to other studios on the old site (likely template) — verify.<br>Old hero image missing (404). |
| Keelkattalai | Phone '91994516090' is not a valid 10-digit number.<br>Phone '994516090' is not a valid 10-digit number. |
| Kelambakkam | Class schedule is identical to other studios on the old site (likely template) — verify. |
| Kolapakkam | Class schedule is identical to other studios on the old site (likely template) — verify.<br>Old hero image missing (404). |
| Kumbakonam | Class schedule is identical to other studios on the old site (likely template) — verify. |
| Kundrathur | Class schedule is identical to other studios on the old site (likely template) — verify. |
| Madambakkam | Class schedule is identical to other studios on the old site (likely template) — verify. |
| Maduravoyal | Class schedule is identical to other studios on the old site (likely template) — verify. |
| Mappedu | Class schedule is identical to other studios on the old site (likely template) — verify. |
| Maraimalai Nagar | No Google Maps embed on old studio page. |
| Medavakkam | No Google Maps embed on old studio page. |
| Navalur | No phone on old studio page (taken from store locator).<br>Class schedule is identical to other studios on the old site (likely template) — verify. |
| Padappai | Class schedule is identical to other studios on the old site (likely template) — verify. |
| Padur | No Google Maps embed on old studio page. |
| Pammal | Class schedule is identical to other studios on the old site (likely template) — verify. |
| Perumbakkam | Class schedule is identical to other studios on the old site (likely template) — verify. |
| Polachery | Class schedule is identical to other studios on the old site (likely template) — verify. |
| Puducherry | No phone on old studio page (taken from store locator). |
| Pudupakkam | Class schedule is identical to other studios on the old site (likely template) — verify. |
| Sithalapakkam | Class schedule is identical to other studios on the old site (likely template) — verify. |
| Surapet | No Google Maps embed on old studio page. |
| Thanjavur | Class schedule is identical to other studios on the old site (likely template) — verify. |
| Urapakkam | Class schedule is identical to other studios on the old site (likely template) — verify. |
| Velachery | Class schedule is identical to other studios on the old site (likely template) — verify. |
| Vyasarpadi | Class schedule is identical to other studios on the old site (likely template) — verify. |

### Studio-wide

| # | Issue | Handling |
|---|---|---|
| D1 | Whether every listed branch is still active | All 52 imported with `status='unverified'`; listed publicly with a "confirm before visiting" note. Mark verified/closed in Admin → Studios |
| D2 | Store-locator "hours", "offer", "status: OPEN TODAY" values look like placeholders ("Beach batch", "Military discount", identical hours) | **Not migrated** |
| D3 | 20 studios share an identical weekly schedule (Velachery's) and 3 others share another — likely template copies | Schedules shown with "as listed on previous website — confirm with studio" note; `scheduleVerified=false` on those |
| D4 | Schedule program names are inconsistent (≈110 spellings, e.g. "Flim covers", "Choreopab Sr", "DANCE FINESS", "Doctors Batch", "ladies batch") | Original labels kept, mapped to program slugs for filtering |
| D5 | Velachery page shows "+919543345345" but the tel: link dials +919841429355 | Displayed number used |
| D6 | Head office: Kilpauk, Mylapore and Velachery are all labelled "HEAD OFFICE STUDIO" | All three flagged as head office; confirm the actual head office address for Organization schema |
| D7 | Kattur address is in Trichy but listed under Chennai; Cuddalore pin code shown as 600001 | City corrected from address; pin codes untouched — verify |
| D8 | Same branch heads for Keelkattalai & Old Pallavaram; "Aishwarya" (franchise page) vs "Aiswarya Jagatheesan" (Old Perungalathur & Mannivakkam studio pages) | As listed; confirm |
| D9 | Basavanagudi (Bengaluru) while locator says "45+ dance studios across Tamil Nadu" | Copy changed to "across South India" |

## E. Careers / other

| # | Issue | Handling |
|---|---|---|
| E1 | Instructor & Designer job descriptions end with "…through your video editing skills" (copied) | Corrected to role-appropriate closing line |
| E2 | Online Academy page contains an "event support" paragraph and "Contact us for the ultimate event experience" | Kept as a separate "Event support" block (Event Support is also a class type) |
| E3 | Contact page tel link `tell:` was broken; "Socials" heading had no links | Fixed |
| E4 | Testimonial (Karthic, Film Covers) calls the class "dance fitness sessions" | Reworded to "these sessions" |
| E5 | Ramana Balaji photo file is `team-2.png` | Used as-is; confirm it is the founder |
