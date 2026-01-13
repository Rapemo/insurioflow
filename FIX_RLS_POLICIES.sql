-- Fix Row Level Security Policies for Quote Creation
-- Run this in Supabase SQL Editor

-- Drop existing policies and create new ones that allow inserts
DROP POLICY IF EXISTS "Users can view all data" ON quotes;

-- Create proper policies for quotes table
CREATE POLICY "Enable insert for all users" ON quotes FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable select for all users" ON quotes FOR SELECT USING (true);
CREATE POLICY "Enable update for all users" ON quotes FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON quotes FOR DELETE USING (true);

-- Fix policies for other tables if needed
DROP POLICY IF EXISTS "Users can view all data" ON deals;
CREATE POLICY "Enable insert for all users" ON deals FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable select for all users" ON deals FOR SELECT USING (true);
CREATE POLICY "Enable update for all users" ON deals FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON deals FOR DELETE USING (true);

DROP POLICY IF EXISTS "Users can view all data" ON customers;
CREATE POLICY "Enable insert for all users" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable select for all users" ON customers FOR SELECT USING (true);
CREATE POLICY "Enable update for all users" ON customers FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON customers FOR DELETE USING (true);

DROP POLICY IF EXISTS "Users can view all data" ON activities;
CREATE POLICY "Enable insert for all users" ON activities FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable select for all users" ON activities FOR SELECT USING (true);
CREATE POLICY "Enable update for all users" ON activities FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON activities FOR DELETE USING (true);

DROP POLICY IF EXISTS "Users can view all data" ON customer_interactions;
CREATE POLICY "Enable insert for all users" ON customer_interactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable select for all users" ON customer_interactions FOR SELECT USING (true);
CREATE POLICY "Enable update for all users" ON customer_interactions FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON customer_interactions FOR DELETE USING (true);

DROP POLICY IF EXISTS "Users can view all data" ON quote_deal_link;
CREATE POLICY "Enable insert for all users" ON quote_deal_link FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable select for all users" ON quote_deal_link FOR SELECT USING (true);
CREATE POLICY "Enable update for all users" ON quote_deal_link FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON quote_deal_link FOR DELETE USING (true);

-- Verify policies are working
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public'
    AND tablename IN ('quotes', 'deals', 'customers', 'activities', 'customer_interactions', 'quote_deal_link')
ORDER BY tablename, policyname;
