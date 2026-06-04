-- REPAIR & UPDATE SCRIPT: June 3, 2026
-- This script safely handles existing tables and ensures your admin permissions are correct.

-- 1. Ensure dynamic info fields exist in products table
DO $$ 
BEGIN 
    BEGIN
        ALTER TABLE products ADD COLUMN storage_instructions text;
    EXCEPTION
        WHEN duplicate_column THEN RAISE NOTICE 'column storage_instructions already exists in products, skipping';
    END;
    
    BEGIN
        ALTER TABLE products ADD COLUMN nutritional_info text;
    EXCEPTION
        WHEN duplicate_column THEN RAISE NOTICE 'column nutritional_info already exists in products, skipping';
    END;

    BEGIN
        ALTER TABLE products ADD COLUMN sourcing_info text;
    EXCEPTION
        WHEN duplicate_column THEN RAISE NOTICE 'column sourcing_info already exists in products, skipping';
    END;
END $$;

-- 2. Create tables if they don't exist
CREATE TABLE IF NOT EXISTS custom_autocomplete (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS page_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key TEXT UNIQUE NOT NULL,
  content JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Enable RLS
ALTER TABLE custom_autocomplete ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

-- 4. Set up Policies (using DROP POLICY to ensure fresh setup)
DROP POLICY IF EXISTS "Public can read custom_autocomplete" ON custom_autocomplete;
CREATE POLICY "Public can read custom_autocomplete" ON custom_autocomplete FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can manage custom_autocomplete" ON custom_autocomplete;
CREATE POLICY "Admin can manage custom_autocomplete" ON custom_autocomplete FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

DROP POLICY IF EXISTS "Public can read page_content" ON page_content;
CREATE POLICY "Public can read page_content" ON page_content FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can manage page_content" ON page_content;
CREATE POLICY "Admin can manage page_content" ON page_content FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- 5. DIAGNOSTIC: Ensure your user is actually an admin!
-- Run the query below, but REPLACE 'your-email@example.com' with your login email.
/*
UPDATE profiles 
SET is_admin = true 
WHERE email = 'your-email@example.com';
*/

-- 6. Initial Seed for About Page (if empty)
INSERT INTO page_content (page_key, content)
VALUES ('about', '{
  "hero": {"title": "Our Story", "tagline": "Bringing the goodness of nature to your table"},
  "story": {"heading": "From Farm to Table", "image": "", "paragraphs": ["Our journey...", "Our values...", "Our promise..."]},
  "process": {"heading": "Our Process", "tagline": "How we do it", "image": "", "steps": []},
  "values": []
}')
ON CONFLICT (page_key) DO NOTHING;
