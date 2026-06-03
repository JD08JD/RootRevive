-- MIGRATION UPDATE: June 3, 2026
-- Run these queries in your Supabase SQL Editor to update your existing database.

-- 1. Add dynamic info fields to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS storage_instructions text,
ADD COLUMN IF NOT EXISTS nutritional_info text,
ADD COLUMN IF NOT EXISTS sourcing_info text;

-- 2. Create custom autocomplete table
CREATE TABLE IF NOT EXISTS custom_autocomplete (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  name TEXT NOT NULL UNIQUE
);

-- 3. Enable RLS for the new table
ALTER TABLE custom_autocomplete ENABLE ROW LEVEL SECURITY;

-- 4. Set up policies for custom_autocomplete
DROP POLICY IF EXISTS "Public can read custom_autocomplete" ON custom_autocomplete;
CREATE POLICY "Public can read custom_autocomplete"
  ON custom_autocomplete
  FOR SELECT
  USING ( true );

DROP POLICY IF EXISTS "Admin can manage custom_autocomplete" ON custom_autocomplete;
CREATE POLICY "Admin can manage custom_autocomplete"
  ON custom_autocomplete
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND is_admin = true
    )
  );
