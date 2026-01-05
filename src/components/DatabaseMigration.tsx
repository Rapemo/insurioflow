import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import FriendlyErrorAlert from '@/components/ui/FriendlyErrorAlert';
import { Database, Copy, ExternalLink, CheckCircle, AlertTriangle } from 'lucide-react';
import { getOperationSpecificError, ErrorTypes } from '@/utils/errorHandler';
import { checkCompaniesSchema } from '@/utils/checkSchema';

const DatabaseMigration = () => {
  const [copied, setCopied] = useState(false);
  const [copiedRecreate, setCopiedRecreate] = useState(false);
  const [error, setError] = useState<any>(null);
  const [schemaInfo, setSchemaInfo] = useState<any>(null);
  const [checkingSchema, setCheckingSchema] = useState(false);

  const migrationSQL = `-- Add missing columns to companies table
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
COMMENT ON COLUMN companies.hubspot_id IS 'Integration ID for HubSpot CRM';`;

  const recreationSQL = `-- Drop and recreate the companies table with correct schema
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
('Financial Services Group', 'Finance', 75, 'Australia', 'inactive', 'WP005', 'HS005');`;

  const handleCopySQL = async () => {
    try {
      await navigator.clipboard.writeText(migrationSQL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err: any) {
      setError(getOperationSpecificError(err, ErrorTypes.TABLE_CREATION));
    }
  };

  const handleCopyRecreateSQL = async () => {
    try {
      await navigator.clipboard.writeText(recreationSQL);
      setCopiedRecreate(true);
      setTimeout(() => setCopiedRecreate(false), 2000);
    } catch (err: any) {
      setError(getOperationSpecificError(err, ErrorTypes.TABLE_CREATION));
    }
  };

  const handleCheckSchema = async () => {
    setCheckingSchema(true);
    try {
      const result = await checkCompaniesSchema();
      setSchemaInfo(result);
    } catch (err: any) {
      setError(getOperationSpecificError(err, ErrorTypes.DATABASE_CONNECTION));
    } finally {
      setCheckingSchema(false);
    }
  };

  const openSupabaseSQL = () => {
    window.open('https://supabase.com/dashboard/project/zberkdnwjkzqjfvzgxkv/sql', '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="h-5 w-5 mr-2" />
          Database Schema Migration
        </CardTitle>
        <CardDescription>
          Add missing columns to the companies table to fix client creation
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <FriendlyErrorAlert error={error} />
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800">Schema Mismatch Detected</h4>
              <p className="text-sm text-yellow-700 mt-1">
                The companies table is missing the <code className="bg-yellow-100 px-1 rounded">country</code> and{' '}
                <code className="bg-yellow-100 px-1 rounded">status</code> columns that are required by the application.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium">Steps to fix:</h4>
          
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="bg-blue-50">1</Badge>
            <span className="text-sm">Check current database schema</span>
            <Button variant="outline" size="sm" onClick={handleCheckSchema} disabled={checkingSchema}>
              {checkingSchema ? 'Checking...' : 'Check Schema'}
            </Button>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="bg-blue-50">2</Badge>
            <span className="text-sm">Copy the SQL migration script below</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="bg-blue-50">3</Badge>
            <span className="text-sm">Open Supabase SQL Editor</span>
            <Button variant="outline" size="sm" onClick={openSupabaseSQL}>
              <ExternalLink className="h-3 w-3 mr-1" />
              Open Editor
            </Button>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="bg-blue-50">4</Badge>
            <span className="text-sm">Paste and run the SQL script</span>
          </div>
        </div>

        {schemaInfo && (
          <div className="bg-gray-50 border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Current Schema:</h4>
            {schemaInfo.error ? (
              <p className="text-sm text-red-600">Error: {schemaInfo.error}</p>
            ) : (
              <div>
                <p className="text-sm text-gray-700 mb-2">Found {schemaInfo.columns?.length || 0} columns:</p>
                {schemaInfo.columns && schemaInfo.columns.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {schemaInfo.columns.map((col: string) => (
                      <Badge key={col} variant="outline" className="text-xs">
                        {col}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No columns found or table is empty</p>
                )}
              </div>
            )}
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">SQL Migration Script:</h4>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCopySQL}
              className={copied ? 'bg-green-50 border-green-200' : ''}
            >
              {copied ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-1" />
                  Copy SQL
                </>
              )}
            </Button>
          </div>
          
          <div className="bg-gray-50 border rounded-lg p-4">
            <pre className="text-xs font-mono text-gray-700 whitespace-pre-wrap">
              {migrationSQL}
            </pre>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">What this migration does:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Adds <code className="bg-blue-100 px-1 rounded">country</code> column (TEXT)</li>
            <li>• Adds <code className="bg-blue-100 px-1 rounded">status</code> column (TEXT, default: 'pending')</li>
            <li>• Adds <code className="bg-blue-100 px-1 rounded">employee_count</code> column (INTEGER, default: 1)</li>
            <li>• Adds <code className="bg-blue-100 px-1 rounded">workpay_id</code> column (TEXT, nullable)</li>
            <li>• Adds <code className="bg-blue-100 px-1 rounded">hubspot_id</code> column (TEXT, nullable)</li>
            <li>• Adds constraints for valid status and positive employee count</li>
            <li>• Updates existing records with default values</li>
            <li>• Creates indexes for better query performance</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatabaseMigration;
