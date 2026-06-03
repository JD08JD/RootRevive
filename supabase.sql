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

-- Categories table
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  slug text unique not null,
  image_url text,
  description text,
  color text default '#4CAF50',
  icon text default 'Leaf',
  display_order integer default 0
);

-- Enable row level security
alter table profiles enable row level security;
alter table products enable row level security;
alter table categories enable row level security;

-- RLS: public read-only access to products
drop policy if exists "Public can read products" on products;
create policy "Public can read products"
  on products
  for select
  using ( true );

-- RLS: public read-only access to categories
drop policy if exists "Public can read categories" on categories;
create policy "Public can read categories"
  on categories
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

-- RLS: admin users can manage all categories
drop policy if exists "Admin can manage categories" on categories;
create policy "Admin can manage categories"
  on categories
  for all
  using (
    exists (
      select 1 from profiles
      where id = auth.uid()
        and is_admin = true
    )
  );

-- Seed initial categories
insert into categories (name, slug, image_url, color, icon, display_order)
values 
  ('Dried Fruits', 'fruits', 'https://images.unsplash.com/photo-1776188590471-db74f543cf52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmllZCUyMGZydWl0cyUyMGFzc29ydG1lbnQlMjBuYXR1cmFsfGVufDF8fHx8MTc3NjI0NTE1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', '#FFA726', 'Apple', 0),
  ('Dehydrated Vegetables', 'vegetables', 'https://images.unsplash.com/photo-1646827153974-acb5bc2393b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWh5ZHJhdGVkJTIwdmVnZXRhYmxlcyUyMGhlYWx0aHl8ZW58MXx8fHwxNzc2MjQ1MTUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', '#4CAF50', 'Carrot', 1),
  ('Herbal Products', 'herbs', 'https://images.unsplash.com/photo-1757802412806-433e4e60eec7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZXJiYWwlMjB0ZWElMjBvcmdhbmljJTIwbGVhdmVzfGVufDF8fHx8MTc3NjI0NTE1Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', '#8BC34A', 'Leaf', 2)
on conflict (slug) do nothing;

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
