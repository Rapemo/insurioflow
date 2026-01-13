-- Disable triggers that might be causing deal creation on quote insert
-- Run this in Supabase SQL Editor

-- Check for triggers on quotes table
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_condition,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'quotes'
    AND trigger_schema = 'public';

-- Disable triggers temporarily (if they exist)
-- Note: You may need to run these individually if they exist

-- Disable quote creation trigger (if exists)
-- ALTER TABLE quotes DISABLE TRIGGER quote_creation_trigger;

-- Disable quote-deal automation trigger (if exists)  
-- ALTER TABLE quotes DISABLE TRIGGER quote_deal_automation_trigger;

-- Or drop the triggers entirely
-- DROP TRIGGER IF EXISTS quote_creation_trigger ON quotes;
-- DROP TRIGGER IF EXISTS quote_deal_automation_trigger ON quotes;

-- Test quote creation without triggers
-- After testing, you can re-enable with:
-- ALTER TABLE quotes ENABLE TRIGGER quote_creation_trigger;
