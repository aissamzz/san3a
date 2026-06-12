create extension if not exists "pgcrypto";

create type public.user_role as enum ('user', 'admin');
create type public.appointment_status as enum ('pending', 'confirmed', 'cancelled');
create type public.appointment_source as enum ('web', 'manual');
create type public.activation_key_status as enum ('unused', 'used');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text not null,
  role public.user_role not null default 'user',
  created_at timestamptz not null default now()
);

create table public.pages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  business_name text not null,
  craft text not null default '',
  city text not null default '',
  description text not null default '',
  phone text not null default '',
  whatsapp text not null default '',
  avatar_url text not null default '',
  cover_url text not null default '',
  services jsonb not null default '[]'::jsonb,
  gallery jsonb not null default '[]'::jsonb,
  hours jsonb not null default '{
    "0": { "enabled": true, "from": "09:00", "to": "17:00" },
    "1": { "enabled": true, "from": "09:00", "to": "17:00" },
    "2": { "enabled": true, "from": "09:00", "to": "17:00" },
    "3": { "enabled": true, "from": "09:00", "to": "17:00" },
    "4": { "enabled": true, "from": "09:00", "to": "17:00" },
    "5": { "enabled": false, "from": "09:00", "to": "17:00" },
    "6": { "enabled": false, "from": "09:00", "to": "17:00" }
  }'::jsonb,
  activated boolean not null default false,
  activated_until date,
  suspended boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages(id) on delete cascade,
  client_name text not null,
  client_phone text not null default '',
  service_name text not null default '',
  date date not null,
  time time not null,
  status public.appointment_status not null default 'pending',
  source public.appointment_source not null default 'web',
  created_at timestamptz not null default now()
);

create unique index appointments_live_slot_idx
  on public.appointments (page_id, date, time)
  where status <> 'cancelled';

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages(id) on delete cascade,
  number text not null,
  client_name text not null,
  client_phone text not null default '',
  client_address text not null default '',
  items jsonb not null default '[]'::jsonb,
  date date not null default current_date,
  notes text not null default '',
  unique (page_id, number)
);

create table public.activation_keys (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  status public.activation_key_status not null default 'unused',
  used_by_page_id uuid references public.pages(id) on delete set null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.pages enable row level security;
alter table public.appointments enable row level security;
alter table public.invoices enable row level security;
alter table public.activation_keys enable row level security;

create policy "profiles read own or admin"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

create policy "profiles insert own"
  on public.profiles for insert
  with check (id = auth.uid());

create policy "profiles update own or admin"
  on public.profiles for update
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

create policy "pages public live read"
  on public.pages for select
  using (
    (activated and not suspended and activated_until >= current_date)
    or user_id = auth.uid()
    or public.is_admin()
  );

create policy "pages insert owner"
  on public.pages for insert
  with check (user_id = auth.uid());

create policy "pages update owner or admin"
  on public.pages for update
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

create policy "appointments insert public live page"
  on public.appointments for insert
  with check (
    exists (
      select 1 from public.pages
      where pages.id = appointments.page_id
        and pages.activated
        and not pages.suspended
        and pages.activated_until >= current_date
    )
    or exists (
      select 1 from public.pages
      where pages.id = appointments.page_id
        and pages.user_id = auth.uid()
    )
    or public.is_admin()
  );

create or replace function public.get_booked_times(p_page_id uuid, p_date date)
returns table(time time)
language sql
stable
security definer
set search_path = public
as $$
  select appointments.time
  from public.appointments
  where appointments.page_id = p_page_id
    and appointments.date = p_date
    and appointments.status <> 'cancelled'
    and (
      exists (
        select 1 from public.pages
        where pages.id = p_page_id
          and pages.activated
          and not pages.suspended
          and pages.activated_until >= current_date
      )
      or exists (
        select 1 from public.pages
        where pages.id = p_page_id
          and (pages.user_id = auth.uid() or public.is_admin())
      )
    );
$$;

create policy "appointments read owner or admin"
  on public.appointments for select
  using (
    exists (
      select 1 from public.pages
      where pages.id = appointments.page_id
        and (pages.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "appointments update owner or admin"
  on public.appointments for update
  using (
    exists (
      select 1 from public.pages
      where pages.id = appointments.page_id
        and (pages.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "appointments delete owner or admin"
  on public.appointments for delete
  using (
    exists (
      select 1 from public.pages
      where pages.id = appointments.page_id
        and (pages.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "invoices owner or admin read"
  on public.invoices for select
  using (
    exists (
      select 1 from public.pages
      where pages.id = invoices.page_id
        and (pages.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "invoices owner insert"
  on public.invoices for insert
  with check (
    exists (
      select 1 from public.pages
      where pages.id = invoices.page_id
        and (pages.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "invoices owner or admin update"
  on public.invoices for update
  using (
    exists (
      select 1 from public.pages
      where pages.id = invoices.page_id
        and (pages.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "invoices owner or admin delete"
  on public.invoices for delete
  using (
    exists (
      select 1 from public.pages
      where pages.id = invoices.page_id
        and (pages.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "activation keys authenticated read"
  on public.activation_keys for select
  using (auth.uid() is not null);

create policy "activation keys admin insert"
  on public.activation_keys for insert
  with check (public.is_admin());

create policy "activation keys authenticated use or admin"
  on public.activation_keys for update
  using (auth.uid() is not null or public.is_admin())
  with check (auth.uid() is not null or public.is_admin());
