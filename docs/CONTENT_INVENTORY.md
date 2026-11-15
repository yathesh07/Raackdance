# Content Inventory

Everything extracted from raackdance.com. Source of truth for migrated content: `src/content/*.ts|json` (also seeded into Supabase by `supabase/seed.sql`). Raw crawl: `_audit/html`, text extracts: `_audit/text`.

## Global

| Item | Value (old site) | Where |
|---|---|---|
| Brand line | The Amplifiers of Dance As a Way of Life in South India | Home |
| Mission line | Igniting passion, creativity, and the love for movement in every dancer. | Home |
| RAACK acronym | Rhythm-frenzy · Body language · Dynamics · Creativity · Self expression | Home |
| Stats | 45+ studios · 100000+ students trained · 4000+ events performed · 28 years (franchise page: 27) | Home, Franchise, Store locator |
| Phone | +91 90030 24113 | Header/footer/all pages |
| Emails | admin@raack.in (header/footer), enquiry@raack.com (inner pages), Admin@raack.com (FTA) | various |
| Socials | Instagram raack_official · Facebook danceatraack · YouTube @raackacademyofdance6792 · LinkedIn · WhatsApp channel · X (placeholder `x.com/your-profile`) | Header/footer |
| Registration notice | Registration for the academic year 2026-2027 are open now! | Home |
| Ticketing | https://raackdance.co.in/ | Events pages |
| SEO title (all pages identical) | Raack - Dance Schools in Chennai, Best Dance Studio in Chennai, Dance classes for Kids, Adults Chennai | all |
| Meta description | Keyword list of Chennai neighbourhoods (identical on almost every page) | all |

## Programs (7 found)

| Program | Age | Old URL | Description | Outcomes | Videos (YouTube) |
|---|---|---|---|---|---|
| Little Legends | 3–5.5 yrs | dance-academy-chennai.html | ✔ | ✖ copied Film Covers list | PPVhTnvB-k8, YmrlaaTzaZY, xfKMJ4IPTcI |
| Level Up (Flow Course) | 5.5–7 yrs (page body says 3–6) | dance-academy-classes.html | tagline only (body copied from Little Legends) | ✔ 4 items | gGKb0l_Hl7k, mF9Rf936D_I, uCdrwTvJoOY |
| RDEP | 7–12 yrs | dance-classes-for-kids.html | ✔ | ✖ copied | it9Zsj5KcyQ, 37nr0wNzar4, BximtcOaEmY |
| Choreo Lab | 7–12 · 13+ | dance-classes-for-adults.html | ✔ | none | _rJB38jz6Rc, PgkFtdh9UQc, o87VXsXLpQw |
| Film Covers | 7–12 · 13+ | dance-schools.html | ✔ | ✔ 6 items | jFSDM1wMVWg, UKAc2SdY-94, uWW7VA3rgS0 |
| Dance Fitness | Adults | dance-academy.html | ✔ | ✖ copied | none |
| Just Dance (Open Class) | 7–12 · 13+ | dance-classes.html (orphan) | ✔ | ✖ copied | aQXcVb_yTK8, UhVetG6Dae4, usEkcGvD7A8 |

Form course options seen: Choreolab, Dance Fitness, Film/“Flim” Covers, Just Dance, Little Legends, RDEP, Flow Course.

## Core team (5)
Ramana Balaji — Founder · Kavi Chakravarthy — Curriculum Head · Gugan — Instructor Head · Vijay Kumar B — Counsellor Head · Vibinesh Vijayan — Event Head (full vision statements migrated in `src/content/site.ts`).

## Testimonials
- Students/parents (6): Mudita Mehta (CA), Karthic Sankar Senthippan (Engineer), Meenakshi, Athirai (Dance Enthusiast), Sivaranjini (Toddler Parent), Dr. P. Elanthirayan (Paediatric Surgeon)
- Franchise owners (4): Muthu Kumar (Pallikaranai), Smitha Arun (Kolathur), Aishwarya (Old Perungalathur), Purni Magesh (Cuddalore)
- Staff (3, careers page): Abirami, Rajvarma, Joshi

## Events (4)
| Event | Old details | Notes |
|---|---|---|
| Happy Feet — in-house contest, Season 3 | Date “NOVEMBER - 30” (2026), venue coming soon, 7 categories, 4 judging criteria | upcoming |
| First Step — Annual Recital | February 2027, venue coming soon, countdown, “4000+ participants” (body says “over 400”) | upcoming, tickets raackdance.co.in |
| Choreo Camp / Camp Raack 2027 | Kiddy / Junior / Senior camps, categories 7–12 · 13+ · Adults, dates coming soon | page reuses First Step copy |
| Heal The World — MJ tribute flash mob, Season 4 | Aug 24 & 25 2024, “VR Mahal” Chennai, 1800+ kids. Events overview says 29 Aug 2023, 1200 students, VR Mall | past, 16-photo album |

## Other pages
- **Online Academy** — tagline, intro, 5 features, belief, event-support paragraph, free-trial CTA; registration form fields: name, gender, email, country code, mobile, WhatsApp same?/number, country, state, class type (One on One / Batch / Group for Tamil School / Group Class for Tamil Sangam / Event Support), preferred trial timing + timezone, how did you hear (Social Media / Website / Friend/Family / Advertisement / Reference), purpose, CAPTCHA.
- **FTA** — intro, 5 benefits, join & signup copy.
- **Careers** — intro, 3 staff quotes, 5 positions (Instructor, Counsellor, Branch Manager, Designer, Editor) with requirements, 5 “why” points; form: name, country code, mobile, email, position, location, CAPTCHA.
- **Franchise** — intro, 4 owner quotes, stats, 5 benefits, closing.
- **Contact** — heading, intro, phone, map image, testimonial; enquiry form.
- **Standard enquiry form** (every page): name*, country code, mobile*, email*, course, location (52 options), CAPTCHA* → `mail/conmail.php`.
- **FAQs, privacy policy, terms** — **do not exist** on the old site.


## Studios (52)

Addresses & coordinates from the store-locator dataset; phones from studio pages + locator; schedules from each studio page.

| Studio | City | Address | Phones | Branch head(s) | Classes listed | Flags |
|---|---|---|---|---|---|---|
| [Ambattur](/studios/ambattur) | Chennai | First floor 125 Redhills Road Vijayalakshmipuram, Ambathur, near Pommys, Rajiv Gandhi Nagar, Vijayalakshmi Puram, Oragadam, Chennai, Tamil Nadu 600053 | 9940011227, 9841029322 | — | 31 | 0 |
| [Arumbakkam](/studios/arumbakkam) | Chennai | No 2 , Vallalar street, 1st Main Rd, Jai Nagar, Arumbakkam, Chennai, Tamil Nadu 600106 | 9500168676, 9884188848 | Pradeep S | 8 | 0 |
| [Avadi](/studios/avadi) | Chennai | No-1116, Vivekananda Nagar, TNHB Mig V Block, Avadi, Tamil Nadu 600054 | 9940698798, 9841029322 | — | 27 (template?) | 1 |
| [Ayapakkam](/studios/ayapakkam) | Chennai | R73/A, Ayapakkam Housing Board Rd, Rajammal nagar, TNHB Colony, Annanur, Ayappakkam, Chennai, Tamil Nadu 600077 | 9600769789, 8925324525 | Karthika | 10 | 0 |
| [Basavanagudi](/studios/basavanagudi) | Bengaluru | Ward No 154, Subbarama Chetty Rd, NR Colony, Basavanagudi, Bengaluru, Karnataka 560004 | 7795945777 | — | 27 (template?) | 1 |
| [Chidambaram](/studios/chidambaram) | Chidambaram | Raack Academy of Dance No:27, M, 1st Floor, J. Tower, Kamaleeshwaran Koil St, Chidambaram, Tamil Nadu 608001 | 9600919177 | Meenambiga | 10 | 0 |
| [Cuddalore](/studios/cuddalore) | Cuddalore | No,7, Link Rd, Thirupapuliyur, Cuddalore, Tamil Nadu 600001 | 9003302927, 9500921667 | Purni Magesh | 24 | 1 |
| [Guduvanchery](/studios/guduvanchery) | Chennai | No. 1 Vishnu Priya Nagar, Nellikuppam Road Kayarembedu Village, near Velammal School, Guduvancheri, Moolakazhani, Tamil Nadu 603202 | 9500919990, 8754537733 | M. Arun Rathinavel | 50 | 0 |
| [Hasthinapuram](/studios/hasthinapuram) | Chennai | 15 Gayathri Nagar, Water Tank, Opp Street to SBI bank, Dr Rajendra Prasad Rd, opp. to Gayathri Nagar, Velmurugan Nagar, Hasthinapuram, Chromepet, Chennai, Tamil Nadu 600064 | 7695890080, 8925253052 | Kalaivani K | 24 | 0 |
| [Iyyappanthangal](/studios/iyyappanthangal) | Chennai | 9, First main road, Krishnaveni ammal nagar, Opp Grace Supermarket, Oil Mill Road, Iyyappanthangal, Chennai - 600056 | 9790974123 | Nithya Sathish | 32 (template?) | 1 |
| [Kandigai](/studios/kandigai) | Chennai | 3rd Floor, Thiru Thamizh Tower Melakottaiyur, Kelambakkam - Vandalur Rd, Kandigai, Chennai, Tamil Nadu 600127. | 9500097045 | Vidya Sureshkumar | 32 (template?) | 1 |
| [Kattur](/studios/kattur) | Tiruchirappalli | 3rd Floor, Ideal Towers, Thanjai Main Road, Kattur, Trichy - 620019 | 7550046563 | — | 32 (template?) | 3 |
| [Keelkattalai](/studios/keelkattalai) | Chennai | First floor, 78, Medavakkam Main Rd, opp. Andhra Bank, Rajamanickam Nagar, Keelkattalai, Chennai, Tamil Nadu 600117 | 7550283439, 91994516090, 994516090 | Saravan Santhanakrishnan, Gugan Gurubaran | 23 | 2 |
| [Kelambakkam](/studios/kelambakkam) | Chennai | 22/1C1A & 22/1C1B Third Floor, Rajiv Gandhi Salai (OMR), Kelambakkam, Chennai - 603 103 (above TVS Showroom) | 9363739997 | Thileepa Tl | 32 (template?) | 1 |
| [Kilpauk](/studios/kilpauk) | Chennai | 28/1, Rajaratnam St, Kilpauk, Chennai, Tamil Nadu 600010 | 9543345345, 9841429355 | — | 18 | 0 |
| [Kolapakkam](/studios/kolapakkam) | Chennai | 2, Anna Main Road, Mahalakshmi Nagar, Kolapakkam, Chennai, Tamil Nadu - 600128 | 8925928565 | — | 32 (template?) | 2 |
| [Kolathur](/studios/kolathur) | Chennai | No,13/14, 200, ft road, Ambethkar Nagar, Ambedkar Nagar, Kolathur, Chennai, Tamil Nadu 600099 | 9841522220 | Smitha Arun, Supra Karthikeyan | 32 | 0 |
| [Kumbakonam](/studios/kumbakonam) | Kumbakonam | 97, John Selvaraj Nagar Rd, John Selvaraj Nagar, Kumbakonam, Tamil Nadu - 612001 | 8220040048 | Mahalakshmi D | 32 (template?) | 1 |
| [Kundrathur](/studios/kundrathur) | Chennai | Pallavaram - Kundrathur Rd, 70/3, Main Rd, Aandankuppam, Kundrathur, Chennai, Tamil Nadu 600069 | 7550214655 | Ajith Kumar | 32 (template?) | 1 |
| [Madambakkam](/studios/madambakkam) | Chennai | 638, 3rd St, Shanthi Nikethan Colony, Sudharsan Nagar, Madambakkam, Chennai, Tamil Nadu 600073 | 8438962316 | Dilip Joshi | 32 (template?) | 1 |
| [Maduravoyal](/studios/maduravoyal) | Chennai | No.3, Singaravel nagar 2nd street, pallavan nagar main road, Maduravoyal, 600095 | 8122868091 | V. A. Niraimathee | 32 (template?) | 1 |
| [Mannivakkam](/studios/mannivakkam) | Chennai | 15, Mudichur Rd, Nehru Colony, Mannivakkam, Chennai, Tamil Nadu 600048 | 9500001292 | Aiswarya Jagatheesan | 18 | 0 |
| [Mappedu](/studios/mappedu) | Chennai | plot no. 37, AKB Solitire, anna main road, Mappedu - Vengambakkam Rd, Kaspapuram, Chennai, Tamil Nadu 600126 | 9790500510 | Joel Victor Ezhilarasan | 32 (template?) | 1 |
| [Maraimalai Nagar](/studios/maraimalai-nagar) | Chennai | No. 1/73, Pavendar Salai, Maraimalai Nagar, Tamil Nadu 603209 | 9884726634, 8925531580 | Anitha | 18 | 1 |
| [Medavakkam](/studios/medavakkam) | Chennai | 7/492C, Third Floor, Velachery Main Rd, Ranganathapuram, Medavakkam, Chennai, Medavakkam, Tamil Nadu 600100 | 9500078970 | Muthukumar Narayanan | 26 | 1 |
| [Mogappair](/studios/mogappair) | Chennai | No. 36, D N Plaza, Thiruvalluvar Salai, Thiruvalluvar Nagar, J J Nagar, Mogappair East, Chennai, Tamil Nadu 600037 | 9840339994 | Krishna | 23 | 0 |
| [Mugalivakkam](/studios/mugalivakkam) | Chennai | 2, Vembadi Vinayakar Koil Rd, AGS Colony, Mugalivakkam, Chennai, Tamil Nadu 600125 | 9940329429, 9710939240 | Vibinesh | 18 | 0 |
| [Mylapore](/studios/mylapore) | Chennai | 51, Ramakrishna Mutt Rd, opp. P.S Matriculation School, Alamelu Manga Puram, Sankarapuram, Mylapore, Chennai, Tamil Nadu 600004 | 9543345345, 9841429355 | — | 21 | 0 |
| [Navalur](/studios/navalur) | Chennai | S2, Second floor, 3/46, Rajiv Gandhi Salai, OMR, Navalur, Chennai, Tamil Nadu 600130 | 9677899303, 8754622303 | Mahjabeen Reyaz | 32 (template?) | 2 |
| [Neelankarai](/studios/neelankarai) | Chennai | no - 2/796 sakshi towers, kazura garden 1st, East Coast Rd, opp. hot chips, Kazura Garden, Neelankarai, Chennai, Tamil Nadu 600115 | 9841429355 | Rajangam | 29 | 0 |
| [Old Perungalathur](/studios/old-perungalathur) | Chennai | Bus stop, No: 3, Mudichur Rd, near Bharathi Nagar, Gandhi Nagar, Old Perungalathur, Chennai, Tamil Nadu 600063 | 9500001292 | Aiswarya Jagatheesan | 39 | 0 |
| [Old Pallavaram](/studios/old-pallavaram) | Chennai | No:95, 1st Floor, Gokulam Complex, PV Vaithiyalingam Rd, above City Union Bank, Zamin Pallavaram, Raja Joseph Colony, Old Pallavaram, Chennai, Tamil Nadu 600043 | 9150188688, 9962374879 | Saravan Santhanakrishnan, Gugan Gurubaran | 26 | 0 |
| [Padappai](/studios/padappai) | Chennai | Old no 539/2, Plot no. 15, Ground floor, Hajiyar Nagar, NGO Colony Main Road Padappai, Chennai, Kancheepuraam, Tamil Nadu 601301 | 9840642837 | Rajalakshmi S | 27 (template?) | 1 |
| [Padur](/studios/padur) | Chennai | First floor, 1/200, OMR Rd, above Federal Bank, Padur, Chennai, Tamil Nadu 603103 | 9363739997, 9363719997 | Thileepa Tl | 29 | 1 |
| [Pallikaranai](/studios/pallikaranai) | Chennai | Bus Stop, 5, Sengalani Amman Koil Street, near Domino's Pizza, opposite to Narayanapuram, IIT Colony, Narayanapuram, Pallikaranai, Chennai, Tamil Nadu 600100 | 9500078970 | Muthu, Madhu | 28 | 0 |
| [Pammal](/studios/pammal) | Chennai | 219, 39th St, Easwari Nagar, Shankar Nagar, Pammal, Chennai, Tamil Nadu 600075, India | 7200117109, 9790938508 | Aparna R | 32 (template?) | 1 |
| [Perumbakkam](/studios/perumbakkam) | Chennai | Block 1st Floor, Sekaran's The ARC B, 225/1, Rose Garden St, Nesamani Nagar, Perumbakkam, Chennai, Tamil Nadu 600100 | 9003024113, 9543345345 | Venkat | 32 (template?) | 1 |
| [Polachery](/studios/polachery) | Chennai | Flat.no 6, DABC main road, Bliss in the town, phase-3, polachery, chennai-600127 | 9962996468 | Kalpana M | 32 (template?) | 1 |
| [Puducherry](/studios/pondicherry) | Puducherry | 2nd floor, 349, Mahatma Gandhi Rd, above Nike Showroom, next to Petit Seminaire Higher Secondary School, MG Road Area, Puducherry, 605001 | 9841712232 | Murali Krishna | 16 | 1 |
| [Pudupakkam](/studios/pudupakkam) | Chennai | 2nd floor, GK Towers, No 4/16, MR Radha Rd, Pudupakkam, Chennai, Tamil Nadu 603103 | 9003024113, 9543345345 | Pavithra Aravind | 32 (template?) | 1 |
| [Ramapuram](/studios/ramapuram) | Chennai | Valluvar Salai, near : Arasa Maram, opp. to HP Petrol bunk Top of indian bank, Gokulam Colony, Ramapuram, Chennai, Tamil Nadu 600089 | 6379671663 | Pradeep Prasad | 27 | 0 |
| [Saidapet](/studios/saidapet) | Chennai | 54, Alandur Rd, Abith Colony, Industrial Area, Saidapet, Chennai, Tamil Nadu 600015 | 9789997040, 9884821285 | Sumathi | 19 | 0 |
| [Sholinganallur](/studios/sholinganallur) | Chennai | 2A, Elcot Ave Main Rd, Sholinganallur, Chennai, Tamil Nadu 600119 | 9840339506 | Rajiv Pandian | 36 | 0 |
| [Sithalapakkam](/studios/sithalapakkam) | Chennai | No.3/993, Plot 405, Survey No, 1st Floor, TNHB, 5/3, Mambakkam - Medavakkam Main Rd, Sithalapakkam, Chennai, Tamil Nadu 600126 | 9003024113, 9543345345 | A Ezra Jerostine | 32 (template?) | 1 |
| [Surapet](/studios/surapet) | Chennai | Plot no 249, Ambattur Red Hills Rd, Sivaprakasam Nagar, Surapet, Chennai, Tamil Nadu 600066 | 8838723149 | Sandhya A | 16 | 1 |
| [Tambaram](/studios/tambaram) | Chennai | No 7&8, 100 Feet Main Road Sri Ram Nagar, Selaiyur, Tambaram, near Camp Road, Mahalakshmi Nagar, Signal, Chennai, Tamil Nadu 600073 | 7845055523, 9962609365 | — | 36 | 0 |
| [Thanjavur](/studios/thanjavur) | Thanjavur | Devi Towers, MIG-81/87, Marutham St, New Housing Unit, Thanjavur, Tamil Nadu 613005 | 9003009391 | Pavithra B | 32 (template?) | 1 |
| [Thiruverkadu](/studios/thiruverkadu) | Chennai | 30, Sivan Kovil Rd, Thiruverkadu, Chennai, Thiruverkadu, Tamil Nadu 600077 | 8925515104, 8825957192 | Rajvarman Sm | 25 | 0 |
| [Thoraipakkam](/studios/thoraipakkam) | Chennai | PLOT NO 3 AND 4, WEST WING, 200 Feet Radial Rd, Vinayaganagar, MCN Nagar Extension, Thoraipakkam, Chennai, Tamil Nadu 600097 | 8778437344 | Anthony Raja | 27 | 0 |
| [Urapakkam](/studios/urapakkam) | Chennai | 16, Railway Station Road, Selvaraj Nagar, Vardhaman Nagar, Chennai, Tamil Nadu 603211 | 8754537733 | — | 32 (template?) | 1 |
| [Velachery](/studios/velachery) | Chennai | Sri Supra Towers, Plot No 22, 3rd Cross St, Vijaya Nagar, Velachery, Chennai, Tamil Nadu 600042 | 9003024113, 9543345345 | — | 32 (template?) | 1 |
| [Vyasarpadi](/studios/vyasarpadi) | Chennai | 1st Floor, 6, 1st St, opposite to RADIANCE EMPIRE, Avvai Nagar, Vyasar Nagar Colony, Vyasarpadi, Chennai, Tamil Nadu 600039 | 9840283265 | Bharath | 32 (template?) | 1 |
