# Architecture

## Stack

| Layer | Choice | Why |
|---|---|---|
| UI | React 19 + TypeScript, Vite 8, Tailwind CSS v4 | Fast builds, typed, utility-first design tokens (`src/index.css` `@theme`) |
| Motion | Motion for React (`motion/react`) | Reveals, 3D text, tilt cards, page & menu transitions |
| 3D | Three.js + React Three Fiber | Hero silk-ribbon sculpture (`src/three/HeroScene.tsx`), lazy-loaded on idle |
| Routing | React Router 7 (data router) | Code-split routes, `/admin/*` sub-app |
| Forms | React Hook Form + Zod | One schema drives all enquiry types; the edge function re-validates server-side |
| Maps | Leaflet + OpenStreetMap tiles | Free, no key, matches the old site's Leaflet locator. Set `VITE_MAP_TILES_URL` to a keyed provider (MapTiler / Stadia, ~free tiers) once traffic grows — OSM's tile policy is for light use |
| Backend | Supabase (Postgres, Auth, Storage, Edge Functions, RLS) | Managed, row-level security for branch/role scoping |
| Bot protection | Cloudflare Turnstile + honeypot + DB rate limiter | Privacy-friendly, free |

GSAP was evaluated but not needed — Motion covers every interaction with a smaller bundle. Drei was removed in favour of three's procedural `RoomEnvironment` (no HDR downloads, −55 kB).

## Run modes

- **Demo mode** (no `VITE_SUPABASE_*` env): content from `src/content`, admin data in `localStorage` (`src/lib/localdb.ts`), demo logins shown on `/admin/login`. For evaluation only; disable with `VITE_ALLOW_DEMO=false`.
- **Supabase mode**: public site renders instantly from bundled content, then hydrates from the database (`src/lib/content.tsx`). Admin edits are live.

Both modes share one data API (`src/lib/repo.ts`) and identical row shapes (`src/lib/types.ts`).

## Folder structure

```
src/
  content/        migrated content (site.ts, programs.ts, events.ts, studios.json, redirects.json)
  lib/            types, seed builder, repo (Supabase|demo), content context, auth, RBAC, UTM capture
  components/     Header/Footer/Layout, Motion primitives, EnquiryForm, StudioMap, Lightbox, SEO, …
  three/          Hero3D (detection + fallback) and HeroScene (R3F)
  pages/          public routes
  admin/          dashboard (AdminApp shell, ResourceManager CRUD, Enquiries, Overview, Users, Settings, Audit)
supabase/
  migrations/     schema + RLS + audit triggers + storage + stats RPC
  functions/      submit-enquiry (public), admin-users (super admin)
  seed.sql        generated from src/content (npm run seed:sql)
scripts/          postbuild (prerender meta, sitemap, robots, redirects), seed generator
public/media/     optimised legacy assets (WebP + H.264)
_audit/           raw crawl of the old site (HTML, text, JSON) for traceability
```

## Routes

`/`, `/about`, `/programs`, `/programs/:slug`, `/studios`, `/studios/:slug`, `/online-academy`, `/events`, `/events/:slug`, `/faculty-academy`, `/gallery`, `/careers`, `/franchise`, `/contact`, `/book-a-free-trial?type=`, `/privacy`, `/terms`, `/admin/*`. All 81 old `.html` URLs 301 → see PAGE_MIGRATION_MAP.md.

## Database (Postgres)

Content: `programs`, `studios`, `branch_heads`, `class_sessions`, `team_members`, `events`, `testimonials`, `media`, `careers`, `site_settings`, `pages`.
Leads: `enquiries` (type, status pipeline, assignment, follow-up, UTM, referrer, landing page, guardian consent, hashed IP), `enquiry_notes`.
Ops: `profiles` (role, active, studio_ids), `audit_logs`, `rate_limits`.

### Roles & RLS

| Role | Content | Studios / schedules | Enquiries | Users / settings / audit |
|---|---|---|---|---|
| Super Admin | write | write | all | write |
| Content Editor | write | write | — (aggregate stats via `enquiry_stats()`) | settings: view |
| Branch Manager | view | **own studios only** (update) | **own studios only** | — |
| Counsellor | view | view | unassigned + assigned to self; can only claim, not reassign (trigger) | — |
| Read-only | view | view | aggregate stats only | — |

Policies live in `supabase/migrations/20261115000001_schema.sql` and were tested against Postgres (PGlite) for branch scoping, counsellor claim-only, anon lead isolation, audit triggers and rate limiting. The frontend mirrors them in `src/lib/rbac.ts` purely for UX.

### Security

- Public cannot read or write `enquiries`; inserts happen only in the `submit-enquiry` edge function (service role, server-side validation, Turnstile verification, per-IP / per-phone rate limits, IP stored as salted SHA-256).
- Service-role key is used only inside edge functions; the browser gets the anon key.
- Staff sign-up disabled; invite-only via `admin-users` (super admin JWT required). Deactivation bans the auth user.
- Storage bucket `media`: MIME allow-list (JPG/PNG/WebP/AVIF/GIF/MP4/WebM), 100 MB cap, write limited to editors/branch managers; client also validates type/size.
- Audit trigger records actor, action, table, record and a field-level diff for every change.
- Child safety: `consent_status` on every media item and testimonial; `withdrawn` is hidden by RLS; dashboard flags published items with unknown consent.

## Design system

Ivory `#FAF7F2` / pearl `#F3EEE6` surfaces, ink `#141210` text, accent **#EC1D25** (extracted from the Raack logo and old `style.css`, most-used brand colour), night `#0D0C0B` cinematic sections. Fraunces (variable, editorial serif) + Manrope (sans), self-hosted via Fontsource. Utilities: `display-xl/lg/md`, `eyebrow`, `card`, `btn-*`, `field`, `chip`, `grain`.

## Performance

- 3D chunk loads on `requestIdleCallback` after first paint; SVG ribbon fallback renders instantly (also used for no-WebGL); `prefers-reduced-motion` renders a still frame; mobile uses a lighter scene (fewer segments, 2 ribbons, capped DPR).
- Routes and the enquiry form (zod/RHF) are code-split; YouTube uses a click-to-load facade on `youtube-nocookie.com`.
- Images 124 MB → 8.4 MB (WebP); videos 150 MB → 36 MB.
- Measured (mobile emulation, 4× CPU throttle, fast-4G, local server): LCP 1.5–2.6 s, CLS 0.
