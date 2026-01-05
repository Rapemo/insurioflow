-- Add missing columns to companies table
-- This migration adds all required columns that are expected by the TypeScript types

-- Add country column to companies table
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS country TEXT;

-- Add status column to companies table with default value
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- Add employee_count column to companies table with default value
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS employee_count INTEGER DEFAULT 1;

-- Add workpay_id column to companies table
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS workpay_id TEXT;

-- Add hubspot_id column to companies table
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS hubspot_id TEXT;

-- Drop constraint if it exists (PostgreSQL doesn't support IF NOT EXISTS for constraints)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'companies_status_check' 
        AND table_name = 'companies'
    ) THEN
        ALTER TABLE companies DROP CONSTRAINT companies_status_check;
    END IF;
END $$;

-- Add check constraint for status values
ALTER TABLE companies 
ADD CONSTRAINT companies_status_check 
CHECK (status IN ('active', 'pending', 'inactive'));

-- Add check constraint for employee_count (must be positive)
ALTER TABLE companies 
ADD CONSTRAINT companies_employee_count_check 
CHECK (employee_count > 0);

-- Update existing records to have default values
UPDATE companies 
SET 
    country = COALESCE(country, 'Unknown'),
    status = COALESCE(status, 'pending'),
    employee_count = COALESCE(employee_count, 1),
    workpay_id = COALESCE(workpay_id, NULL),
    hubspot_id = COALESCE(hubspot_id, NULL)
WHERE 
    country IS NULL OR 
    status IS NULL OR 
    employee_count IS NULL;

-- Create index for country column for better query performance
CREATE INDEX IF NOT EXISTS idx_companies_country ON companies(country);

-- Create index for status column for better query performance  
CREATE INDEX IF NOT EXISTS idx_companies_status ON companies(status);

-- Create index for employee_count column for better query performance
CREATE INDEX IF NOT EXISTS idx_companies_employee_count ON companies(employee_count);

-- Create index for workpay_id column for better query performance
CREATE INDEX IF NOT EXISTS idx_companies_workpay_id ON companies(workpay_id);

-- Create index for hubspot_id column for better query performance
CREATE INDEX IF NOT EXISTS idx_companies_hubspot_id ON companies(hubspot_id);

-- Add comment to columns for documentation
COMMENT ON COLUMN companies.country IS 'Country where the company is located';
COMMENT ON COLUMN companies.status IS 'Current status of the company (active, pending, inactive)';
COMMENT ON COLUMN companies.employee_count IS 'Number of employees in the company';
COMMENT ON COLUMN companies.workpay_id IS 'Integration ID for WorkPay system';
COMMENT ON COLUMN companies.hubspot_id IS 'Integration ID for HubSpot CRM';
