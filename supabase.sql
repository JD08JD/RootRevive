-- Supabase schema for RootRevive
-- Paste this into the Supabase SQL editor.

-- Enable UUID support
create extension if not exists "pgcrypto";

-- Profiles table for admin roles and user metadata
create table if not exists profiles (
  id uuid primary key references auth.users(id),
  email text unique,
  display_name text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- Products table
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  name text not null,
  description text,
  price numeric not null,
  category text,
  image_url text,
  benefits text[],
  featured boolean default false,
  stock integer default 0,
  is_organic boolean default false,
  is_active boolean not null default true,
  created_by uuid references auth.users(id)
);

-- Enable row level security
alter table profiles enable row level security;
alter table products enable row level security;

-- RLS: allow users to manage their own profile
create policy "Users can manage own profile"
  on profiles
  for all
  using ( auth.uid() = id );

-- RLS: public read-only access to products
create policy "Public can read products"
  on products
  for select
  using ( true );

-- RLS: admin users can manage all products
create policy "Admin can manage products"
  on products
  for all
  using (
    exists (
      select 1 from profiles
      where id = auth.uid()
        and is_admin = true
    )
  );

-- Optional: create a sample admin profile if the auth user exists
-- Replace the UUID below with a real auth user ID after creating the user in Supabase Auth.
-- insert into profiles (id, email, display_name, is_admin)
-- values ('00000000-0000-0000-0000-000000000000', 'admin@example.com', 'Admin User', true);
