# Supabase Integration Plan for RootRevive

## Objectives
- Migrate product persistence from `localStorage` to Supabase database storage.
- Move authentication from manual local-demo auth to Supabase Auth.
- Add admin-specific authorization so only authorized admin users can create, update, or delete products.
- Keep public/product browsing open while protecting admin-critical operations.

## Current App Structure
- `src/app/context/AuthContext.tsx` uses demo admin credentials and `localStorage`.
- `src/app/context/ProductContext.tsx` stores product data in `localStorage` and uses an initial static seed.

## Proposed Supabase Architecture

### Tables
1. `products`
   - `id` UUID, primary key, default `gen_random_uuid()`
   - `created_at` timestamp with time zone, default `now()`
   - `updated_at` timestamp with time zone
   - `name` text
   - `description` text
   - `price` numeric
   - `category` text
   - `image_url` text
   - `stock` integer
   - `is_organic` boolean
   - `is_featured` boolean
   - `is_active` boolean
   - `created_by` uuid references `auth.users(id)`

2. `profiles`
   - `id` uuid, primary key, references `auth.users(id)`
   - `email` text
   - `display_name` text
   - `is_admin` boolean default false
   - `created_at` timestamp with time zone default `now()`

### Auth and Admin Model
- Use Supabase Auth for login, logout, session persistence, and auth state.
- Use `auth.users` for authentication credentials.
- Use `profiles.is_admin` to mark admin users.
- Protect admin operations with RLS policies.

## Database Schema SQL

```sql
-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Product table
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  name text not null,
  description text,
  price numeric not null,
  category text,
  image_url text,
  stock integer default 0,
  is_organic boolean default false,
  is_featured boolean default false,
  is_active boolean default true,
  created_by uuid references auth.users(id)
);

-- Profiles table for admin roles
create table if not exists profiles (
  id uuid primary key references auth.users(id),
  email text unique,
  display_name text,
  is_admin boolean default false,
  created_at timestamptz not null default now()
);
```

## Recommended RLS Policies

### Enable RLS
```sql
alter table products enable row level security;
alter table profiles enable row level security;
```

### Policies for `profiles`
```sql
create policy "Users can manage own profile"
  on profiles
  for all
  using ( auth.uid() = id );
```

### Policies for `products`
```sql
create policy "Public can read products"
  on products
  for select
  using ( true );

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
```

## Integration Steps

### 1. Create Supabase project
- Create a new project in Supabase.
- Go to `Settings` > `API` and copy `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
- Add `SUPABASE_SERVICE_ROLE_KEY` only for server-side admin tasks if needed, but do not store it in client code.

### 2. Add environment variables
- Create `.env` or `.env.local` with:
  - `VITE_SUPABASE_URL=https://your-project-ref.supabase.co`
  - `VITE_SUPABASE_ANON_KEY=your-anon-key`

### 3. Install Supabase client
- Add `@supabase/supabase-js` to the project.

### 4. Add Supabase client helper
Create `src/lib/supabaseClient.ts` with:
```ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

### 5. Update authentication flow
- Replace `AuthContext` local auth with Supabase auth.
- Use `supabase.auth.getSession()` and `supabase.auth.onAuthStateChange()`.
- Store `user` and `isAuthenticated` in context.
- Provide `login`, `logout`, and optionally `register`.
- On successful login, ensure the user has a `profile` row; create one if needed.

### 6. Update product context
- Replace localStorage product storage with Supabase `products` queries.
- Use `select` for initial load.
- Use `insert`, `update`, and `delete` for product mutations.
- Include `created_by` when inserting products.
- Add error handling for authorization failures.

### 7. Protect admin routes and UI
- Keep `ProtectedRoute` or admin page accessible only when `auth.user` exists and `profile.is_admin` is true.
- Hide product management actions from non-admin users.

### 8. Seed admin user and products (optional)
- Create an admin account in Supabase Auth.
- Insert a matching `profiles` row with `is_admin = true`.
- Optionally add seeded product rows for demo content.

## UI Changes
- `LoginPage.tsx`: authenticate using Supabase credentials.
- `AdminPageNew.tsx`: use Supabase-backed product CRUD.
- `ProductDetailPage.tsx` / `ProductsPage.tsx`: load products from Supabase instead of local state.

## Important Security Notes
- Do not store service role keys in client code.
- Use Supabase Auth for authentication state instead of localStorage.
- Use RLS policies to enforce admin-only product mutations.
- Keep `profiles.is_admin` as the source of truth for admin access.

## Suggested Future Enhancements
- Add `categories` table or `tags` table for structured filtering.
- Support image uploads with Supabase Storage and store `image_url` in `products`.
- Add a dedicated `orders` table for purchase history.
- Add auditing fields such as `updated_by` or `deleted_at`.

## Summary
This plan converts the existing local admin/product demo into a Supabase-backed app with:
- secure auth management,
- persisted product storage,
- admin authorization enforced by RLS,
- clean client integration via `@supabase/supabase-js`.
