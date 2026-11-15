-- Raack Academy of Dance — core schema, RLS, audit logging, storage.
-- Apply with: supabase db push   (or paste into the SQL editor in order)

-- gen_random_uuid() is built into Postgres 13+.

-- ───────────────────────── Enums ─────────────────────────
do $$ begin
  create type app_role as enum ('super_admin','content_editor','branch_manager','counsellor','read_only');
  create type consent_status as enum ('unknown','obtained','not_required','withdrawn');
  create type studio_status as enum ('active','unverified','closed');
  create type enquiry_status as enum ('new','contacted','trial_scheduled','trial_completed','enrolled','not_interested','invalid','archived');
  create type enquiry_type as enum ('trial','general','program','studio','online','franchise','careers','event','faculty');
  create type event_status as enum ('upcoming','past','announced');
exception when duplicate_object then null; end $$;

-- ───────────────────────── Helpers ─────────────────────────
create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- ───────────────────────── Staff ─────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null default '',
  role app_role not null default 'read_only',
  active boolean not null default true,
  studio_ids text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.current_role_name() returns app_role
language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid() and active
$$;
create or replace function public.is_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.profiles where id = auth.uid() and active)
$$;
create or replace function public.has_role(variadic roles app_role[]) returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select role = any(roles) from public.profiles where id = auth.uid() and active), false)
$$;
create or replace function public.can_edit_content() returns boolean
language sql stable as $$ select public.has_role('super_admin','content_editor') $$;
create or replace function public.manages_studio(sid text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.profiles where id = auth.uid() and active and role = 'branch_manager' and sid = any(studio_ids))
$$;


-- ───────────────────────── Content ─────────────────────────
create table if not exists public.programs (
  id text primary key default gen_random_uuid()::text,
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  name text not null, aka text, age_group text not null default '', audience text not null default 'kids',
  tagline text not null default '', description text not null default '',
  outcomes text[] not null default '{}', levels text[] not null default '{}', videos text[] not null default '{}',
  logo text, logo_mono text, image text, accent text not null default '#ec1d25', notice text,
  sort int not null default 0, published boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.studios (
  id text primary key default gen_random_uuid()::text,
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'), legacy_slug text,
  name text not null, city text not null, address text not null default '',
  phones text[] not null default '{}', email text,
  lat double precision, lng double precision, maps_embed text, hero text,
  is_head_office boolean not null default false,
  status studio_status not null default 'unverified',
  schedule_verified boolean not null default false,
  notes text, published boolean not null default true, sort int not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create or replace function public.manages_studio_slug(sslug text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists(
    select 1 from public.profiles p join public.studios s on s.id = any(p.studio_ids)
    where p.id = auth.uid() and p.active and p.role = 'branch_manager' and s.slug = sslug)
$$;

create table if not exists public.branch_heads (
  id text primary key default gen_random_uuid()::text,
  studio_id text not null references public.studios(id) on delete cascade,
  name text not null, photo text, sort int not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.class_sessions (
  id text primary key default gen_random_uuid()::text,
  studio_id text not null references public.studios(id) on delete cascade,
  day smallint not null check (day between 0 and 6),
  program_slug text not null default 'other', label text not null, time_text text not null, sort int not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists class_sessions_studio_idx on public.class_sessions(studio_id);

create table if not exists public.team_members (
  id text primary key default gen_random_uuid()::text,
  name text not null, role text not null, vision text not null default '', body text not null default '', photo text,
  sort int not null default 0, published boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.events (
  id text primary key default gen_random_uuid()::text,
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  name text not null, subtitle text not null default '', edition text not null default '',
  status event_status not null default 'announced', date_text text not null default '', venue text not null default '',
  dates_verified boolean not null default false, summary text not null default '',
  body text[] not null default '{}', highlights jsonb not null default '[]', categories text[] not null default '{}', judging text[] not null default '{}',
  stat jsonb, cover text, poster text, video text, gallery text[] not null default '{}', tickets_url text,
  register boolean not null default true, closing text, sort int not null default 0, published boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id text primary key default gen_random_uuid()::text,
  kind text not null default 'student' check (kind in ('student','franchise','staff')),
  name text not null, designation text, studio text, program_slug text, quote text not null, photo text,
  consent_status consent_status not null default 'unknown',
  published boolean not null default false, sort int not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.media (
  id text primary key default gen_random_uuid()::text,
  url text not null, kind text not null default 'image' check (kind in ('image','video')),
  alt text not null default '', caption text, category text not null default 'academy-life',
  event_slug text, studio_slug text,
  consent_status consent_status not null default 'unknown',
  published boolean not null default false, sort int not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.careers (
  id text primary key default gen_random_uuid()::text,
  title text not null, type text not null default 'Full-time', summary text not null default '',
  requirements text[] not null default '{}', apply text, published boolean not null default false, sort int not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key, value jsonb not null default '{}'::jsonb, updated_at timestamptz not null default now()
);

create table if not exists public.pages (
  slug text primary key, title text not null, meta_description text not null default '',
  heading text, intro text, published boolean not null default true, updated_at timestamptz not null default now()
);

-- ───────────────────────── Leads ─────────────────────────
create table if not exists public.enquiries (
  id text primary key default gen_random_uuid()::text,
  type enquiry_type not null default 'general',
  status enquiry_status not null default 'new',
  name text not null check (char_length(name) between 2 and 120),
  email text check (email is null or char_length(email) <= 200),
  country_code text not null default '+91',
  phone text not null check (phone ~ '^[0-9]{6,15}$'),
  whatsapp text, gender text, program_slug text, studio_slug text, position text, country text, state text,
  class_type text, preferred_timing text, heard_from text, message text check (message is null or char_length(message) <= 2000),
  child_age text, guardian_consent boolean not null default false,
  utm jsonb not null default '{}'::jsonb, referrer text, landing_page text, source_page text,
  ip_hash text,
  assigned_to uuid references public.profiles(id) on delete set null,
  follow_up_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists enquiries_created_idx on public.enquiries(created_at desc);
create index if not exists enquiries_status_idx on public.enquiries(status);
create index if not exists enquiries_studio_idx on public.enquiries(studio_slug);
create index if not exists enquiries_assigned_idx on public.enquiries(assigned_to);

create table if not exists public.enquiry_notes (
  id text primary key default gen_random_uuid()::text,
  enquiry_id text not null references public.enquiries(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null default auth.uid(),
  author_name text, body text not null check (char_length(body) <= 4000),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create or replace function public.can_access_enquiry(e public.enquiries) returns boolean
language sql stable security definer set search_path = public as $$
  select case public.current_role_name()
    when 'super_admin' then true
    when 'branch_manager' then e.studio_slug is not null and public.manages_studio_slug(e.studio_slug)
    when 'counsellor' then e.assigned_to is null or e.assigned_to = auth.uid()
    else false end
$$;

-- Counsellors may only claim (assign to themselves) — not reassign to others.
create or replace function public.guard_enquiry_update() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if public.current_role_name() = 'counsellor' and new.assigned_to is distinct from old.assigned_to
     and new.assigned_to is distinct from auth.uid() then
    raise exception 'Counsellors can only assign enquiries to themselves';
  end if;
  -- immutable lead facts
  new.created_at = old.created_at; new.ip_hash = old.ip_hash; new.utm = old.utm;
  return new;
end $$;

-- Abuse protection for the public form (used by the submit-enquiry edge function).
create table if not exists public.rate_limits (
  bucket text not null, window_start timestamptz not null, hits int not null default 0,
  primary key (bucket, window_start)
);
create or replace function public.hit_rate_limit(p_bucket text, p_max int, p_window_seconds int) returns boolean
language plpgsql security definer set search_path = public as $$
declare w timestamptz := to_timestamp(floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds); n int;
begin
  insert into public.rate_limits(bucket, window_start, hits) values (p_bucket, w, 1)
  on conflict (bucket, window_start) do update set hits = public.rate_limits.hits + 1 returning hits into n;
  delete from public.rate_limits where window_start < now() - interval '2 days';
  return n <= p_max;
end $$;
revoke all on function public.hit_rate_limit(text,int,int) from public, anon, authenticated;

-- ───────────────────────── Audit ─────────────────────────
create table if not exists public.audit_logs (
  id text primary key default gen_random_uuid()::text,
  actor_id uuid, actor_email text, action text not null, table_name text not null, record_id text, diff jsonb,
  created_at timestamptz not null default now()
);
create index if not exists audit_logs_created_idx on public.audit_logs(created_at desc);

create or replace function public.audit_row() returns trigger language plpgsql security definer set search_path = public as $$
declare
  rid text; d jsonb; o jsonb; n jsonb; k text;
begin
  if tg_op = 'DELETE' then o := to_jsonb(old); else n := to_jsonb(new); end if;
  if tg_op = 'UPDATE' then o := to_jsonb(old); end if;
  rid := coalesce(n->>'id', o->>'id', n->>'key', o->>'key', n->>'slug', o->>'slug');
  if tg_op = 'UPDATE' then
    d := '{}'::jsonb;
    for k in select jsonb_object_keys(n) loop
      if k <> 'updated_at' and (o->k) is distinct from (n->k) then d := d || jsonb_build_object(k, jsonb_build_object('from', o->k, 'to', n->k)); end if;
    end loop;
    if d = '{}'::jsonb then return new; end if;
  elsif tg_op = 'INSERT' then d := n - 'ip_hash';
  else d := o - 'ip_hash'; end if;
  insert into public.audit_logs(actor_id, actor_email, action, table_name, record_id, diff)
  values (auth.uid(), (select email from public.profiles where id = auth.uid()), lower(tg_op), tg_table_name, rid, d);
  return coalesce(new, old);
end $$;

-- ───────────────────────── Triggers ─────────────────────────
do $$ declare t text; begin
  foreach t in array array['profiles','programs','studios','branch_heads','class_sessions','team_members','events','testimonials','media','careers','enquiries','enquiry_notes'] loop
    execute format('drop trigger if exists trg_touch on public.%I; create trigger trg_touch before update on public.%I for each row execute function public.touch_updated_at();', t, t);
  end loop;
  foreach t in array array['site_settings','pages'] loop
    execute format('drop trigger if exists trg_touch on public.%I; create trigger trg_touch before update on public.%I for each row execute function public.touch_updated_at();', t, t);
  end loop;
  foreach t in array array['profiles','programs','studios','branch_heads','class_sessions','team_members','events','testimonials','media','careers','enquiries','enquiry_notes','site_settings','pages'] loop
    execute format('drop trigger if exists trg_audit on public.%I; create trigger trg_audit after insert or update or delete on public.%I for each row execute function public.audit_row();', t, t);
  end loop;
end $$;
drop trigger if exists trg_guard on public.enquiries;
create trigger trg_guard before update on public.enquiries for each row execute function public.guard_enquiry_update();

-- ───────────────────────── Row Level Security ─────────────────────────
alter table public.profiles enable row level security;
alter table public.programs enable row level security;
alter table public.studios enable row level security;
alter table public.branch_heads enable row level security;
alter table public.class_sessions enable row level security;
alter table public.team_members enable row level security;
alter table public.events enable row level security;
alter table public.testimonials enable row level security;
alter table public.media enable row level security;
alter table public.careers enable row level security;
alter table public.site_settings enable row level security;
alter table public.pages enable row level security;
alter table public.enquiries enable row level security;
alter table public.enquiry_notes enable row level security;
alter table public.audit_logs enable row level security;
alter table public.rate_limits enable row level security; -- no policies: service role only

-- Public read of published content; staff read everything.
do $$ declare t text; begin
  foreach t in array array['programs','studios','team_members','events','testimonials','media','careers'] loop
    execute format('drop policy if exists "public read" on public.%I; create policy "public read" on public.%I for select using (published or public.is_staff());', t, t);
    execute format('drop policy if exists "editors write" on public.%I; create policy "editors write" on public.%I for all to authenticated using (public.can_edit_content()) with check (public.can_edit_content());', t, t);
  end loop;
end $$;
-- Testimonials/media with withdrawn consent are never public.
drop policy if exists "public read" on public.testimonials;
create policy "public read" on public.testimonials for select using ((published and consent_status <> 'withdrawn') or public.is_staff());
drop policy if exists "public read" on public.media;
create policy "public read" on public.media for select using ((published and consent_status <> 'withdrawn') or public.is_staff());
drop policy if exists "public read" on public.studios;
create policy "public read" on public.studios for select using ((published and status <> 'closed') or public.is_staff());

-- Branch managers: update own studios (not create/delete).
drop policy if exists "branch manager update" on public.studios;
create policy "branch manager update" on public.studios for update to authenticated using (public.manages_studio(id)) with check (public.manages_studio(id));

-- Schedules & branch heads: public read; editors + own-branch managers write.
do $$ declare t text; begin
  foreach t in array array['class_sessions','branch_heads'] loop
    execute format('drop policy if exists "public read" on public.%I; create policy "public read" on public.%I for select using (true);', t, t);
    execute format('drop policy if exists "write" on public.%I; create policy "write" on public.%I for all to authenticated using (public.can_edit_content() or public.manages_studio(studio_id)) with check (public.can_edit_content() or public.manages_studio(studio_id));', t, t);
  end loop;
end $$;

drop policy if exists "public read" on public.site_settings;
create policy "public read" on public.site_settings for select using (true);
drop policy if exists "admin write" on public.site_settings;
create policy "admin write" on public.site_settings for all to authenticated using (public.has_role('super_admin')) with check (public.has_role('super_admin'));

drop policy if exists "public read" on public.pages;
create policy "public read" on public.pages for select using (true);
drop policy if exists "editors write" on public.pages;
create policy "editors write" on public.pages for all to authenticated using (public.can_edit_content()) with check (public.can_edit_content());

-- Profiles: staff can see colleagues (names for assignment); only super admins change them (via admin-users function).
drop policy if exists "staff read" on public.profiles;
create policy "staff read" on public.profiles for select to authenticated using (public.is_staff() or id = auth.uid());
drop policy if exists "admin write" on public.profiles;
create policy "admin write" on public.profiles for all to authenticated using (public.has_role('super_admin')) with check (public.has_role('super_admin'));

-- Enquiries: NO anon access (inserted by the submit-enquiry edge function with the service role).
drop policy if exists "scoped read" on public.enquiries;
create policy "scoped read" on public.enquiries for select to authenticated using (public.can_access_enquiry(enquiries));
drop policy if exists "scoped update" on public.enquiries;
create policy "scoped update" on public.enquiries for update to authenticated
  using (public.can_access_enquiry(enquiries) and public.has_role('super_admin','branch_manager','counsellor'))
  with check (public.has_role('super_admin','branch_manager','counsellor'));
drop policy if exists "admin delete" on public.enquiries;
create policy "admin delete" on public.enquiries for delete to authenticated using (public.has_role('super_admin'));

drop policy if exists "scoped read" on public.enquiry_notes;
create policy "scoped read" on public.enquiry_notes for select to authenticated
  using (exists(select 1 from public.enquiries e where e.id = enquiry_id and public.can_access_enquiry(e)));
drop policy if exists "scoped insert" on public.enquiry_notes;
create policy "scoped insert" on public.enquiry_notes for insert to authenticated
  with check (author_id = auth.uid() and public.has_role('super_admin','branch_manager','counsellor')
    and exists(select 1 from public.enquiries e where e.id = enquiry_id and public.can_access_enquiry(e)));

drop policy if exists "admin read" on public.audit_logs;
create policy "admin read" on public.audit_logs for select to authenticated using (public.has_role('super_admin'));

-- Aggregate stats for roles that may not see individual leads (read_only, content_editor).
create or replace function public.enquiry_stats() returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare r jsonb;
begin
  if not public.is_staff() then raise exception 'not authorised'; end if;
  select jsonb_build_object(
    'total', count(*),
    'last7', count(*) filter (where created_at > now() - interval '7 days'),
    'enrolled', count(*) filter (where status = 'enrolled'),
    'byStatus', coalesce((select jsonb_object_agg(status, n) from (select status, count(*) n from enquiries group by 1) s), '{}'),
    'byType', coalesce((select jsonb_object_agg(type, n) from (select type, count(*) n from enquiries group by 1) s), '{}'),
    'bySource', coalesce((select jsonb_object_agg(src, n) from (select coalesce(utm->>'utm_source', heard_from, 'Direct / website') src, count(*) n from enquiries group by 1) s), '{}'),
    'byProgram', coalesce((select jsonb_object_agg(coalesce(program_slug,'—'), n) from (select program_slug, count(*) n from enquiries group by 1) s), '{}'),
    'byStudio', coalesce((select jsonb_object_agg(coalesce(studio_slug,'—'), n) from (select studio_slug, count(*) n from enquiries group by 1) s), '{}'),
    'byWeek', (select jsonb_agg(jsonb_build_object('label', to_char(w, 'DD Mon'), 'n', (select count(*) from enquiries where created_at > w - interval '7 days' and created_at <= w)) order by w)
               from generate_series(now() - interval '7 weeks', now(), interval '1 week') w)
  ) into r from enquiries;
  return r;
end $$;
grant execute on function public.enquiry_stats() to authenticated;

-- ───────────────────────── Storage ─────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 104857600, array['image/jpeg','image/png','image/webp','image/avif','image/gif','video/mp4','video/webm'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects for select using (bucket_id = 'media');
drop policy if exists "media staff upload" on storage.objects;
create policy "media staff upload" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and (public.can_edit_content() or public.has_role('branch_manager')));
drop policy if exists "media editors manage" on storage.objects;
create policy "media editors manage" on storage.objects for update to authenticated using (bucket_id = 'media' and public.can_edit_content());
drop policy if exists "media editors delete" on storage.objects;
create policy "media editors delete" on storage.objects for delete to authenticated using (bucket_id = 'media' and public.can_edit_content());
