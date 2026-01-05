-- Drop and recreate the companies table with correct schema
-- This will delete all existing data in the companies table

-- Drop the existing companies table
DROP TABLE IF EXISTS companies CASCADE;

-- Create the companies table with the correct schema
CREATE TABLE companies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    industry TEXT NOT NULL,
    employee_count INTEGER NOT NULL DEFAULT 1,
    country TEXT NOT NULL DEFAULT 'Unknown',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'inactive')),
    workpay_id TEXT,
    hubspot_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_companies_name ON companies(name);
CREATE INDEX idx_companies_industry ON companies(industry);
CREATE INDEX idx_companies_country ON companies(country);
CREATE INDEX idx_companies_status ON companies(status);
CREATE INDEX idx_companies_employee_count ON companies(employee_count);
CREATE INDEX idx_companies_workpay_id ON companies(workpay_id);
CREATE INDEX idx_companies_hubspot_id ON companies(hubspot_id);
CREATE INDEX idx_companies_created_at ON companies(created_at);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_companies_updated_at 
    BEFORE UPDATE ON companies 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE companies IS 'Companies/clients in the insurance system';
COMMENT ON COLUMN companies.id IS 'Unique identifier for the company';
COMMENT ON COLUMN companies.name IS 'Company name';
COMMENT ON COLUMN companies.industry IS 'Industry the company operates in';
COMMENT ON COLUMN companies.employee_count IS 'Number of employees in the company';
COMMENT ON COLUMN companies.country IS 'Country where the company is located';
COMMENT ON COLUMN companies.status IS 'Current status of the company (active, pending, inactive)';
COMMENT ON COLUMN companies.workpay_id IS 'Integration ID for WorkPay system';
COMMENT ON COLUMN companies.hubspot_id IS 'Integration ID for HubSpot CRM';
COMMENT ON COLUMN companies.created_at IS 'When the company record was created';
COMMENT ON COLUMN companies.updated_at IS 'When the company record was last updated';

-- Enable Row Level Security (RLS)
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow anonymous users to read companies (for public access)
CREATE POLICY "Allow anonymous read access" ON companies
    FOR SELECT USING (true);

-- Allow authenticated users to insert companies
CREATE POLICY "Allow authenticated insert access" ON companies
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update companies
CREATE POLICY "Allow authenticated update access" ON companies
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete companies
CREATE POLICY "Allow authenticated delete access" ON companies
    FOR DELETE USING (auth.role() = 'authenticated');

-- Insert sample data for testing
INSERT INTO companies (name, industry, employee_count, country, status, workpay_id, hubspot_id) VALUES
('Acme Corporation', 'Technology', 150, 'United States', 'active', 'WP001', 'HS001'),
('Global Insurance Ltd', 'Insurance', 500, 'United Kingdom', 'active', 'WP002', 'HS002'),
('Healthcare Solutions Inc', 'Healthcare', 250, 'Canada', 'pending', 'WP003', 'HS003'),
('Manufacturing Co', 'Manufacturing', 1000, 'Germany', 'active', 'WP004', 'HS004'),
('Financial Services Group', 'Finance', 75, 'Australia', 'inactive', 'WP005', 'HS005');
