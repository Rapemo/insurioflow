-- Fix Row Level Security policies for companies table
-- This migration updates the RLS policies to allow client creation

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Allow anonymous read access" ON companies;
DROP POLICY IF EXISTS "Allow authenticated insert access" ON companies;
DROP POLICY IF EXISTS "Allow authenticated update access" ON companies;
DROP POLICY IF EXISTS "Allow authenticated delete access" ON companies;

-- Create more permissive policies
-- Allow all operations (for development/testing)
CREATE POLICY "Enable all operations for companies" ON companies
    FOR ALL USING (true) WITH CHECK (true);

-- Alternative: If you want more restrictive policies, uncomment below:
-- -- Allow anyone to read companies
-- CREATE POLICY "Allow read access" ON companies
--     FOR SELECT USING (true);

-- -- Allow authenticated users to insert companies
-- CREATE POLICY "Allow insert access" ON companies
--     FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- -- Allow authenticated users to update companies
-- CREATE POLICY "Allow update access" ON companies
--     FOR UPDATE USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- -- Allow authenticated users to delete companies
-- CREATE POLICY "Allow delete access" ON companies
--     FOR DELETE USING (auth.role() = 'authenticated' OR auth.role() = 'anon');
