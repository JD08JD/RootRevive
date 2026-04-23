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
drop policy if exists "Users can manage own profile" on profiles;
create policy "Users can manage own profile"
  on profiles
  for all
  using ( auth.uid() = id );

-- RLS: public read-only access to products
drop policy if exists "Public can read products" on products;
create policy "Public can read products"
  on products
  for select
  using ( true );

-- RLS: admin users can manage all products
drop policy if exists "Admin can manage products" on products;
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

-- TEMPORARY: Allow authenticated users to insert products for testing
drop policy if exists "Authenticated users can insert products" on products;
create policy "Authenticated users can insert products"
  on products
  for insert
  with check (auth.uid() is not null);

-- Storage configuration
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Allow public access to images
drop policy if exists "Public Access" on storage.objects;
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'product-images' );

-- Allow authenticated users to upload images
drop policy if exists "Authenticated users can upload images" on storage.objects;
create policy "Authenticated users can upload images"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images' 
    and auth.role() = 'authenticated'
  );

-- Allow authenticated users to update/delete their own uploads
drop policy if exists "Users can update their own images" on storage.objects;
create policy "Users can update their own images"
  on storage.objects for update
  using ( bucket_id = 'product-images' and auth.uid() = owner );

drop policy if exists "Users can delete their own images" on storage.objects;
create policy "Users can delete their own images"
  on storage.objects for delete
  using ( bucket_id = 'product-images' and auth.uid() = owner );
