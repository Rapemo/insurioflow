-- Update existing records with proper status and country values
-- This script updates existing companies that might have null/incorrect values

-- First, let's check the current schema
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'companies' 
ORDER BY ordinal_position;

-- Update existing records to have proper default values
UPDATE companies 
SET 
    country = COALESCE(country, 'Kenya'),
    status = COALESCE(NULLIF(status, ''), 'pending')
WHERE 
    country IS NULL OR country = '' OR 
    status IS NULL OR status = '';

-- Show the updated records
SELECT id, name, country, status, employee_count, industry 
FROM companies 
ORDER BY created_at DESC;

-- If you want to set specific values for certain companies:
-- UPDATE companies SET country = 'Kenya', status = 'active' WHERE name = 'Your Company Name';
