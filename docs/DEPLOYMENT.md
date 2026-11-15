# Deployment & Launch

> The live raackdance.com site must stay untouched until staging is approved by the owner. Nothing in this repo changes DNS.

## Current hosting (audited)

raackdance.com → Apache on `103.14.122.193` (shared hosting, PHP mail handlers). Options:

| Option | Fit | Notes |
|---|---|---|
| **A. Netlify / Vercel / Cloudflare Pages** (recommended) | Static SPA + prerendered HTML, global CDN, free SSL, preview deploys for staging | `_redirects` / `vercel.json` generated at build |
| B. Existing Apache host | Upload `dist/` to `public_html` | `.htaccess` generated at build (HTTPS, www→apex, 81 × 301, SPA fallback, caching, security headers) |

Supabase hosts the database, auth, storage and edge functions either way.

## 1. Supabase

1. Create a project (region: Mumbai `ap-south-1`).
2. `npm i -g supabase && supabase login && supabase link --project-ref <ref>`
3. `supabase db push` (applies `supabase/migrations`)
4. Load content: SQL editor → paste `supabase/seed.sql` (or `psql "$DB_URL" -f supabase/seed.sql`).
5. Edge functions:
   ```bash
   supabase secrets set TURNSTILE_SECRET=... IP_HASH_SALT=$(openssl rand -hex 16) \
     ALLOWED_ORIGINS=https://raackdance.com,https://www.raackdance.com,https://staging.raackdance.com \
     SITE_URL=https://raackdance.com
   # optional e-mail alerts for new leads
   supabase secrets set RESEND_API_KEY=... NOTIFY_EMAIL=enquiry@raack.com NOTIFY_FROM="Raack Website <noreply@raackdance.com>"
   supabase functions deploy submit-enquiry --no-verify-jwt
   supabase functions deploy admin-users
   ```
6. Auth → disable public sign-ups; set Site URL + redirect URLs (`/admin/login`) for staging and production; configure SMTP so invite e-mails come from Raack.
7. Create the owner's user (Auth → Add user) and run the bootstrap SQL in `supabase/migrations/20261115000002_bootstrap_admin.sql` with their e-mail. Invite all other staff from **Admin → Users & roles**.
8. Enable daily backups / PITR (Pro plan) and set `SUPABASE_DB_URL` secret in GitHub for the nightly `db-backup` workflow.

## 2. Cloudflare Turnstile

Create a widget for `raackdance.com` + staging domain → put the **site key** in `VITE_TURNSTILE_SITE_KEY`, the **secret** in Supabase (`TURNSTILE_SECRET`).

## 3. Environment variables (frontend)

```
VITE_SUPABASE_URL=https://<ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key>
VITE_TURNSTILE_SITE_KEY=<site key>
VITE_SITE_URL=https://raackdance.com        # staging: https://staging.raackdance.com
VITE_ALLOW_DEMO=false
VITE_MAP_TILES_URL=                           # optional keyed tile provider
```
Never put the service-role key in any `VITE_` variable.

## 4. Staging

1. Connect the repo to Netlify/Vercel; build `npm run build`, publish `dist`.
2. Add domain `staging.raackdance.com` (CNAME at the DNS provider — does not affect the live site).
3. Run the checklist below with the owner.

### Staging test checklist
- [ ] Every page loads on desktop, tablet, mobile (Chrome, Safari iOS, Android)
- [ ] Free trial / program / studio / online / general / careers / franchise / faculty / event forms create rows in `enquiries`
- [ ] Turnstile blocks submission without verification; 6th submission in 10 min returns 429
- [ ] E-mail alert received (if configured)
- [ ] Each role signs in and sees only what it should (branch manager = own studio; counsellor = unassigned + own)
- [ ] Content edits in admin appear on the site after refresh; uploads work; audit log records them
- [ ] Old URLs (sample from PAGE_MIGRATION_MAP.md) 301 to the right page
- [ ] `/sitemap.xml`, `/robots.txt`, page titles/descriptions, OG previews (paste a URL into WhatsApp)
- [ ] Owner has resolved / accepted items in MISSING_INFORMATION.md (esp. media consent and studio verification)

## 5. Production launch (after written owner approval)

1. Lower DNS TTL to 300 s a day before.
2. Back up the old site: download `public_html` (HTML, PHP, `images-raack/`) and keep it — this is the rollback.
3. Add `raackdance.com` + `www` to the host; update DNS (A/ALIAS + CNAME for www). SSL issues automatically.
4. Set `VITE_SITE_URL=https://raackdance.com`, rebuild, deploy.
5. Smoke test, then submit `https://raackdance.com/sitemap.xml` in Google Search Console and monitor Coverage / 404s for two weeks.

## Rollback

- **Frontend**: Netlify/Vercel "promote previous deploy" (instant). If DNS was moved, point it back to `103.14.122.193` (old site is untouched on that server).
- **Database**: restore from Supabase backup / PITR, or `pg_restore` the latest artifact from the `db-backup` workflow.

## Option B — deploy to the existing Apache host

`npm run build` → upload the *contents* of `dist/` (including the hidden `.htaccess`) to a new folder for staging (e.g. `staging.raackdance.com` subdomain doc root). At launch, swap `public_html` after backing it up. Requires `mod_rewrite` and `mod_headers` (standard on cPanel).
