-- ============================================================
-- SUPABASE DATABASE SCHEMA — Portfolio Admin Panel
-- ============================================================
-- Run this entire script in your Supabase SQL Editor:
-- Dashboard → SQL Editor → New Query → Paste → Run
-- ============================================================


-- ── 1. PROJECTS TABLE ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL,
  title       TEXT        NOT NULL,
  description TEXT,
  tech_stack  TEXT[]      DEFAULT '{}',
  demo_url    TEXT,
  github_url  TEXT,
  image_url   TEXT,
  featured    BOOLEAN     DEFAULT false
);

-- ── 2. PROFILE TABLE (single row, id = 1) ────────────────────────────────
CREATE TABLE IF NOT EXISTS profile (
  id           INT         PRIMARY KEY DEFAULT 1,
  full_name    TEXT,
  title        TEXT,
  short_bio    TEXT,
  long_bio     TEXT,
  github_url   TEXT,
  linkedin_url TEXT,
  twitter_url  TEXT,
  website_url  TEXT,
  avatar_url   TEXT,
  updated_at   TIMESTAMPTZ DEFAULT now()
);

-- Ensure only one row can ever exist in the profile table
-- (The CHECK constraint ensures id must always be 1)
ALTER TABLE profile ADD CONSTRAINT profile_single_row CHECK (id = 1);

-- ── 3. MESSAGES TABLE ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS messages (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  name       TEXT,
  email      TEXT,
  subject    TEXT,
  message    TEXT,
  is_read    BOOLEAN     DEFAULT false
);


-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile  ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;


-- ── PROJECTS policies ─────────────────────────────────────────────────────
-- Portfolio visitors can read projects (public portfolio page)
CREATE POLICY "Public can read projects"
  ON projects FOR SELECT
  USING (true);

-- Only authenticated admins can insert/update/delete
CREATE POLICY "Admins can manage projects"
  ON projects FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');


-- ── PROFILE policies ──────────────────────────────────────────────────────
-- Portfolio visitors can read the profile
CREATE POLICY "Public can read profile"
  ON profile FOR SELECT
  USING (true);

-- Only authenticated admins can upsert profile
CREATE POLICY "Admins can manage profile"
  ON profile FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');


-- ── MESSAGES policies ─────────────────────────────────────────────────────
-- Anyone can insert a message (contact form submissions from portfolio visitors)
CREATE POLICY "Public can insert messages"
  ON messages FOR INSERT
  TO public
  WITH CHECK (true);

-- Only authenticated admins can read/delete messages
CREATE POLICY "Admins can manage messages"
  ON messages FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete messages"
  ON messages FOR DELETE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can update messages"
  ON messages FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');


-- ============================================================
-- SUPABASE STORAGE BUCKET SETUP
-- ============================================================
-- Run this in the SQL Editor OR create the bucket manually in:
-- Dashboard → Storage → New Bucket
-- ============================================================

-- Create the project-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to files in the bucket
CREATE POLICY "Public can view images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-images');

-- Only authenticated users can upload / delete images
CREATE POLICY "Admins can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'project-images' AND auth.role() = 'authenticated');

CREATE POLICY "Admins can delete images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'project-images' AND auth.role() = 'authenticated');

CREATE POLICY "Admins can update images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'project-images' AND auth.role() = 'authenticated');


-- ============================================================
-- SEED DATA (optional — remove if not needed)
-- ============================================================
-- Insert an empty profile row so upsert works immediately
INSERT INTO profile (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
