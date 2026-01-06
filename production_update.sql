-- Production Database Update Script
-- Run this in your Supabase SQL Editor to update production

-- 1. Fix benefits table RLS policies
DROP POLICY IF EXISTS "Enable read access for all users" ON public.benefits;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.benefits;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.benefits;

CREATE POLICY "Enable read access for all users"
  ON public.benefits
  FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for all users"
  ON public.benefits
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable update for all users"
  ON public.benefits
  FOR UPDATE
  USING (true);

CREATE POLICY "Enable delete for all users"
  ON public.benefits
  FOR DELETE
  USING (true);

-- 2. Create countries table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE CHECK (length(code) = 2),
  name TEXT NOT NULL,
  currency TEXT NOT NULL CHECK (length(currency) = 3),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;

-- Create policies for countries table
DROP POLICY IF EXISTS "Enable read access for all users" ON public.countries;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.countries;
DROP POLICY IF EXISTS "Enable update for all users" ON public.countries;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.countries;

CREATE POLICY "Enable read access for all users"
  ON public.countries
  FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for all users"
  ON public.countries
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable update for all users"
  ON public.countries
  FOR UPDATE
  USING (true);

CREATE POLICY "Enable delete for all users"
  ON public.countries
  FOR DELETE
  USING (true);

-- Create trigger to update updated_at column (if function doesn't exist)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_countries_updated_at
BEFORE UPDATE ON public.countries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial data (only if table is empty)
INSERT INTO public.countries (code, name, currency, status)
SELECT 
  unnest(ARRAY['KE', 'NG', 'TZ', 'RW', 'UG']),
  unnest(ARRAY['Kenya', 'Nigeria', 'Tanzania', 'Rwanda', 'Uganda']),
  unnest(ARRAY['KES', 'NGN', 'TZS', 'RWF', 'UGX']),
  unnest(ARRAY['active', 'active', 'active', 'active', 'inactive'])
ON CONFLICT (code) DO NOTHING;

-- Verify the changes
SELECT 'Benefits table policies updated successfully' as status;
SELECT 'Countries table created and populated successfully' as status;
