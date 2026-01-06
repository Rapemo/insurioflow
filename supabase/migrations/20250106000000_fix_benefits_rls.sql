-- Fix RLS policies for benefits table to allow anonymous inserts
-- This migration allows unauthenticated users to add benefits for development purposes

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Enable read access for all users" ON public.benefits;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.benefits;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.benefits;

-- Create more permissive policies for development
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
