-- =====================================================================================
-- ATU Simulation Hospital EHR — shared charting setup (run once)
--
-- Supabase → SQL Editor → New query → paste this whole file → Run.
-- Running it again is safe: it keeps existing charting and re-applies the rules.
--
-- What it creates:
--   ehr_members   which classroom logins may use the shared chart, and as what role
--                 (student = documents, observer = view only, faculty = release/reset)
--   ehr_patients  one row per patient per class session: reset number ("epoch"),
--                 scenario clock start, and faculty releases
--   ehr_entries   every saved chart entry (author, time, session) — one row each
--
-- All changes go through the functions below, which check the login's role on the
-- server. The website only holds the public project URL and publishable key.
-- Never put the database password or a secret/service_role key in the website.
-- =====================================================================================

create table if not exists public.ehr_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('student', 'observer', 'faculty')),
  label text
);
alter table public.ehr_members enable row level security;
drop policy if exists "read own membership" on public.ehr_members;
create policy "read own membership" on public.ehr_members
  for select to authenticated using (user_id = (select auth.uid()));
revoke all on public.ehr_members from anon, authenticated;
grant select on public.ehr_members to authenticated;

-- The signed-in login's role, or null if the login has not been approved.
create or replace function public.ehr_role() returns text
language sql stable security definer set search_path = '' as $$
  select role from public.ehr_members where user_id = auth.uid()
$$;
revoke all on function public.ehr_role() from public, anon;
grant execute on function public.ehr_role() to authenticated;

create table if not exists public.ehr_patients (
  app text not null,
  session_id text not null,
  patient_id text not null,
  epoch integer not null default 1,
  real_start bigint,
  released jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (app, session_id, patient_id)
);
alter table public.ehr_patients enable row level security;
drop policy if exists "approved members read" on public.ehr_patients;
create policy "approved members read" on public.ehr_patients
  for select to authenticated using ((select public.ehr_role()) is not null);
revoke all on public.ehr_patients from anon, authenticated;
grant select on public.ehr_patients to authenticated;

create table if not exists public.ehr_entries (
  app text not null,
  session_id text not null,
  id text not null,
  patient_id text not null,
  epoch integer not null,
  section text not null,
  entry jsonb not null,
  author uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (app, session_id, id)
);
create index if not exists ehr_entries_changed on public.ehr_entries (app, session_id, updated_at);
alter table public.ehr_entries enable row level security;
drop policy if exists "approved members read" on public.ehr_entries;
create policy "approved members read" on public.ehr_entries
  for select to authenticated using ((select public.ehr_role()) is not null);
revoke all on public.ehr_entries from anon, authenticated;
grant select on public.ehr_entries to authenticated;

-- Creates the patient's row the first time anyone uses it; returns the current epoch.
create or replace function public.ehr__patient(p_app text, p_session text, p_patient text)
returns integer language plpgsql security definer set search_path = '' as $$
declare e integer;
begin
  insert into public.ehr_patients (app, session_id, patient_id) values (p_app, p_session, p_patient)
    on conflict do nothing;
  select epoch into e from public.ehr_patients
    where app = p_app and session_id = p_session and patient_id = p_patient for update;
  return e;
end $$;
revoke all on function public.ehr__patient(text, text, text) from public, anon, authenticated;

create or replace function public.ehr__require(p_roles text[]) returns void
language plpgsql stable security definer set search_path = '' as $$
begin
  if public.ehr_role() is null then
    raise exception 'This login is not approved for the shared chart.' using errcode = '42501';
  end if;
  if not (public.ehr_role() = any (p_roles)) then
    raise exception 'This % login cannot do this.', public.ehr_role() using errcode = '42501';
  end if;
end $$;
revoke all on function public.ehr__require(text[]) from public, anon, authenticated;

-- Save one chart entry (students and faculty). Saving the same entry twice is harmless.
-- Returns 'ok', or 'stale' when the patient was reset after the entry was started
-- (late writes from a previous group never enter the new group's chart).
create or replace function public.ehr_add_entry(p_app text, p_session text, p_patient text, p_epoch integer,
  p_section text, p_id text, p_entry jsonb)
returns text language plpgsql security definer set search_path = '' as $$
begin
  perform public.ehr__require(array['student', 'faculty']);
  if p_section not in ('vitals', 'assess', 'mar', 'io', 'notes', 'orders', 'ack', 'careplan', 'heparin', 'tar') then
    raise exception 'Unknown chart section %', p_section;
  end if;
  -- Approving, entering, or discontinuing orders is for faculty logins only.
  if p_section = 'orders' and coalesce(p_entry->'data'->>'kind', '') in ('approval', 'faculty', 'dc') then
    perform public.ehr__require(array['faculty']);
  end if;
  if public.ehr__patient(p_app, p_session, p_patient) <> p_epoch then return 'stale'; end if;
  insert into public.ehr_entries (app, session_id, id, patient_id, epoch, section, entry, author)
    values (p_app, p_session, p_id, p_patient, p_epoch, p_section, p_entry, auth.uid())
    on conflict do nothing;
  return 'ok';
end $$;

-- Mark an entry "entered in error" (entries are never deleted).
create or replace function public.ehr_mark_error(p_app text, p_session text, p_patient text, p_epoch integer,
  p_id text, p_error jsonb)
returns text language plpgsql security definer set search_path = '' as $$
begin
  perform public.ehr__require(array['student', 'faculty']);
  if public.ehr__patient(p_app, p_session, p_patient) <> p_epoch then return 'stale'; end if;
  update public.ehr_entries
     set entry = entry || jsonb_build_object('status', 'error', 'error', p_error), updated_at = now()
   where app = p_app and session_id = p_session and id = p_id and patient_id = p_patient and epoch = p_epoch;
  return case when found then 'ok' else 'missing' end;
end $$;

-- Start the scenario clock the first time the patient is opened (first device wins).
create or replace function public.ehr_start_clock(p_app text, p_session text, p_patient text, p_start bigint)
returns bigint language plpgsql security definer set search_path = '' as $$
declare s bigint;
begin
  perform public.ehr__require(array['student', 'observer', 'faculty']);
  perform public.ehr__patient(p_app, p_session, p_patient);
  update public.ehr_patients set real_start = coalesce(real_start, p_start),
         updated_at = case when real_start is null then now() else updated_at end
   where app = p_app and session_id = p_session and patient_id = p_patient
   returning real_start into s;
  return s;
end $$;

-- Faculty: restart the scenario clock.
create or replace function public.ehr_set_clock(p_app text, p_session text, p_patient text, p_start bigint)
returns void language plpgsql security definer set search_path = '' as $$
begin
  perform public.ehr__require(array['faculty']);
  perform public.ehr__patient(p_app, p_session, p_patient);
  update public.ehr_patients set real_start = p_start, updated_at = now()
   where app = p_app and session_id = p_session and patient_id = p_patient;
end $$;

-- Faculty: release (p_on = true) or take back (false) a scenario order/result.
create or replace function public.ehr_release(p_app text, p_session text, p_patient text, p_event text,
  p_on boolean, p_at bigint)
returns void language plpgsql security definer set search_path = '' as $$
begin
  perform public.ehr__require(array['faculty']);
  perform public.ehr__patient(p_app, p_session, p_patient);
  update public.ehr_patients
     set released = case when p_on then released || jsonb_build_object(p_event, p_at) else released - p_event end,
         updated_at = now()
   where app = p_app and session_id = p_session and patient_id = p_patient;
end $$;

-- Faculty: reset one patient for the next group. Removes that patient's student charting
-- and releases (no copy is kept), restarts the clock, and moves to a new epoch.
create or replace function public.ehr_reset_patient(p_app text, p_session text, p_patient text)
returns integer language plpgsql security definer set search_path = '' as $$
declare e integer;
begin
  perform public.ehr__require(array['faculty']);
  perform public.ehr__patient(p_app, p_session, p_patient);
  update public.ehr_patients set epoch = epoch + 1, real_start = null, released = '{}'::jsonb, updated_at = now()
   where app = p_app and session_id = p_session and patient_id = p_patient
   returning epoch into e;
  delete from public.ehr_entries where app = p_app and session_id = p_session and patient_id = p_patient;
  return e;
end $$;

revoke all on function public.ehr_add_entry(text, text, text, integer, text, text, jsonb) from public, anon;
revoke all on function public.ehr_mark_error(text, text, text, integer, text, jsonb) from public, anon;
revoke all on function public.ehr_start_clock(text, text, text, bigint) from public, anon;
revoke all on function public.ehr_set_clock(text, text, text, bigint) from public, anon;
revoke all on function public.ehr_release(text, text, text, text, boolean, bigint) from public, anon;
revoke all on function public.ehr_reset_patient(text, text, text) from public, anon;
grant execute on function public.ehr_add_entry(text, text, text, integer, text, text, jsonb) to authenticated;
grant execute on function public.ehr_mark_error(text, text, text, integer, text, jsonb) to authenticated;
grant execute on function public.ehr_start_clock(text, text, text, bigint) to authenticated;
grant execute on function public.ehr_set_clock(text, text, text, bigint) to authenticated;
grant execute on function public.ehr_release(text, text, text, text, boolean, bigint) to authenticated;
grant execute on function public.ehr_reset_patient(text, text, text) to authenticated;

-- -------------------------------------------------------------------------------------
-- Approve the logins. First create them in Authentication → Users → Add user
-- → Create new user (check "Auto Confirm User"). Then run this file (or just this part).
--
-- Standard setup (same as the original ATU Simulation Hospital): ONE hospital login,
-- Atusim1@atu.edu, used on every simulation computer. It has full access; Student,
-- Observer, and Faculty (PIN) are chosen on each computer's screen.
--
-- Optional: separate student / observer / faculty logins make the server itself enforce
-- the role (a student login can never release or reset). Create only the ones you want;
-- lines for logins that do not exist are skipped. Emails here must be lowercase.
-- -------------------------------------------------------------------------------------
insert into public.ehr_members (user_id, role, label)
select id, v.role, v.label
  from auth.users u
  join (values
    ('atusim1@atu.edu',      'faculty',  'Hospital login (all computers)'),
    ('faculty@atusim.test',  'faculty',  'Faculty'),
    ('student@atusim.test',  'student',  'Student nurse'),
    ('observer@atusim.test', 'observer', 'Observer')
  ) as v(email, role, label) on lower(u.email) = v.email
on conflict (user_id) do update set role = excluded.role, label = excluded.label;

-- Check: lists the approved logins and their roles.
select u.email, m.role from public.ehr_members m join auth.users u on u.id = m.user_id order by m.role;
