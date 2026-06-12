-- صنعة (san3apages.com) — Supabase schema
--
-- Run this once in the Supabase SQL editor (or via the CLI) on a fresh
-- project. It creates all tables, row-level security policies, the
-- profile/page bootstrap trigger, the activation-key RPC, and the public
-- storage bucket used for avatar/cover/gallery images.

-- ---------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  name text not null default '',
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

create table public.pages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  slug text not null unique,
  business_name text not null default '',
  craft text not null default '',
  city text not null default '',
  description text not null default '',
  phone text not null default '',
  whatsapp text not null default '',
  avatar_url text not null default '',
  cover_url text not null default '',
  services jsonb not null default '[]'::jsonb,
  gallery jsonb not null default '[]'::jsonb,
  hours jsonb not null default '{}'::jsonb,
  activated boolean not null default false,
  activated_until date,
  suspended boolean not null default false,
  created_at timestamptz not null default now()
);

create index pages_user_id_idx on public.pages (user_id);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages (id) on delete cascade,
  client_name text not null default '',
  client_phone text not null default '',
  service_name text not null default '',
  date date not null,
  time text not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  source text not null default 'web' check (source in ('web', 'manual')),
  created_at timestamptz not null default now()
);

create index appointments_page_id_idx on public.appointments (page_id);

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages (id) on delete cascade,
  number text not null,
  client_name text not null default '',
  client_phone text not null default '',
  client_address text not null default '',
  items jsonb not null default '[]'::jsonb,
  date date not null,
  notes text not null default '',
  created_at timestamptz not null default now()
);

create index invoices_page_id_idx on public.invoices (page_id);

create table public.activation_keys (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  status text not null default 'unused' check (status in ('unused', 'used')),
  used_by_page_id uuid references public.pages (id) on delete set null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------

-- security definer to avoid recursive RLS lookups on profiles
create function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------
-- New user bootstrap: profile + default page
-- ---------------------------------------------------------------------

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  display_name text;
  base_slug text;
  final_slug text;
  default_hours jsonb := '{
    "0": {"enabled": true, "from": "09:00", "to": "17:00"},
    "1": {"enabled": true, "from": "09:00", "to": "17:00"},
    "2": {"enabled": true, "from": "09:00", "to": "17:00"},
    "3": {"enabled": true, "from": "09:00", "to": "17:00"},
    "4": {"enabled": true, "from": "09:00", "to": "17:00"},
    "5": {"enabled": false, "from": "09:00", "to": "17:00"},
    "6": {"enabled": false, "from": "09:00", "to": "17:00"}
  }'::jsonb;
begin
  display_name := coalesce(new.raw_user_meta_data ->> 'name', '');

  insert into public.profiles (id, email, name, role)
  values (new.id, new.email, display_name, 'user');

  base_slug := regexp_replace(lower(display_name), '[^a-z0-9؀-ۿ]+', '-', 'g');
  base_slug := trim(both '-' from base_slug);
  if base_slug = '' then
    base_slug := 'page';
  end if;
  final_slug := base_slug || '-' || substr(new.id::text, 1, 6);

  insert into public.pages (user_id, slug, business_name, hours)
  values (new.id, final_slug, display_name, default_hours);

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- Activation key RPC (security definer so clients never read other keys)
-- ---------------------------------------------------------------------

create function public.activate_page_with_key(p_page_id uuid, p_code text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_key public.activation_keys;
  v_page public.pages;
  v_base date;
  v_until date;
begin
  select * into v_key from public.activation_keys
    where upper(trim(code)) = upper(trim(p_code))
    for update;

  if v_key.id is null then
    return jsonb_build_object('ok', false, 'message', 'مفتاح التفعيل غير صحيح');
  end if;

  if v_key.status = 'used' then
    return jsonb_build_object('ok', false, 'message', 'هذا المفتاح مستعمل من قبل');
  end if;

  select * into v_page from public.pages where id = p_page_id and user_id = auth.uid();
  if v_page.id is null then
    return jsonb_build_object('ok', false, 'message', 'الصفحة غير موجودة');
  end if;

  if v_page.activated and v_page.activated_until is not null and v_page.activated_until > current_date then
    v_base := v_page.activated_until;
  else
    v_base := current_date;
  end if;
  v_until := v_base + interval '1 year';

  update public.pages
    set activated = true, activated_until = v_until
    where id = v_page.id;

  update public.activation_keys
    set status = 'used', used_by_page_id = v_page.id, used_at = now()
    where id = v_key.id;

  return jsonb_build_object('ok', true, 'message', 'تم تفعيل صفحتك حتى ' || v_until::text, 'activatedUntil', v_until);
end;
$$;

-- ---------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.pages enable row level security;
alter table public.appointments enable row level security;
alter table public.invoices enable row level security;
alter table public.activation_keys enable row level security;

-- profiles
create policy "profiles: read own or admin" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

create policy "profiles: update own" on public.profiles
  for update using (id = auth.uid());

-- pages
create policy "pages: public read" on public.pages
  for select using (true);

create policy "pages: owner update" on public.pages
  for update using (user_id = auth.uid() or public.is_admin());

-- appointments
create policy "appointments: owner read" on public.appointments
  for select using (
    public.is_admin() or page_id in (select id from public.pages where user_id = auth.uid())
  );

create policy "appointments: anyone can book" on public.appointments
  for insert with check (true);

create policy "appointments: owner update" on public.appointments
  for update using (page_id in (select id from public.pages where user_id = auth.uid()));

create policy "appointments: owner delete" on public.appointments
  for delete using (page_id in (select id from public.pages where user_id = auth.uid()));

-- invoices
create policy "invoices: owner all" on public.invoices
  for all using (page_id in (select id from public.pages where user_id = auth.uid()))
  with check (page_id in (select id from public.pages where user_id = auth.uid()));

-- activation_keys
create policy "activation_keys: admin read" on public.activation_keys
  for select using (public.is_admin());

create policy "activation_keys: admin insert" on public.activation_keys
  for insert with check (public.is_admin());

create policy "activation_keys: admin update" on public.activation_keys
  for update using (public.is_admin());

-- ---------------------------------------------------------------------
-- Storage: public "media" bucket for avatar / cover / gallery images
-- ---------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "media: public read" on storage.objects
  for select using (bucket_id = 'media');

create policy "media: owner insert" on storage.objects
  for insert with check (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "media: owner update" on storage.objects
  for update using (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "media: owner delete" on storage.objects
  for delete using (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);

-- ---------------------------------------------------------------------
-- Seed: first admin account (optional)
-- ---------------------------------------------------------------------
-- After creating a user through Supabase Auth (signup or the dashboard),
-- promote it to admin with:
--
--   update public.profiles set role = 'admin' where email = 'admin@example.com';
