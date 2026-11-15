# Raack Academy of Dance — Website & Admin

Premium React + TypeScript rebuild of [raackdance.com](https://raackdance.com) with a 3D hero, studio finder, enquiry pipeline and role-based admin dashboard on Supabase.

## Quick start

```bash
npm install
npm run dev          # http://localhost:5173  (demo mode — no backend needed)
```

- Public site: all pages, forms and studio finder work immediately (demo data stored in your browser).
- Admin: http://localhost:5173/admin — demo logins are shown on the sign-in page (password `raack-demo`).

## Production

1. Copy `.env.example` → `.env` and fill in Supabase + Turnstile keys.
2. Follow **docs/DEPLOYMENT.md** (Supabase migrations, seed, edge functions, staging, launch, rollback).

```bash
npm run build        # typecheck + build + prerender meta/sitemap/robots/redirects → dist/
npm run preview
npm run seed:sql     # regenerate supabase/seed.sql from src/content
```

## Docs

| File | What |
|---|---|
| docs/OLD_WEBSITE_AUDIT.md | Audit of the old site (tech, pages, problems) |
| docs/CONTENT_INVENTORY.md | Every piece of content extracted, incl. 52 studios |
| docs/PAGE_MIGRATION_MAP.md | Old URL → new URL (301) for all 81 pages |
| docs/ASSET_INVENTORY.md | All images/videos, optimisation, 404s |
| docs/MISSING_INFORMATION.md | **Items the owner must confirm before launch** |
| docs/ARCHITECTURE.md | Stack, data model, RLS/roles, security, performance |
| docs/DEPLOYMENT.md | Supabase setup, staging checklist, launch, rollback |
| docs/ADMIN_GUIDE.md | How staff use the dashboard |
| docs/PROJECT_STATUS.md | What's done, what's pending |
