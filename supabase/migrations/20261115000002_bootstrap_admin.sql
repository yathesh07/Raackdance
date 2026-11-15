-- One-time bootstrap: after inviting/creating the owner's account in Supabase Auth
-- (Dashboard → Authentication → Add user), promote it to Super Admin:
--
--   insert into public.profiles (id, email, full_name, role)
--   select id, email, 'Raack Owner', 'super_admin' from auth.users where email = 'OWNER_EMAIL_HERE'
--   on conflict (id) do update set role = 'super_admin', active = true;
--
-- All further staff are invited from Admin → Users & roles.
select 1;
