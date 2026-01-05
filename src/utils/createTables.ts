import { supabase } from '@/integrations/supabase/client';

export const createMissingTables = async () => {
  const tables = [
    {
      name: 'commissions',
      sql: `
        CREATE TABLE IF NOT EXISTS commissions (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          policy_id UUID REFERENCES policies(id) ON DELETE CASCADE,
          broker_id UUID,
          amount DECIMAL(10,2) NOT NULL,
          percentage DECIMAL(5,2) NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'calculated', 'paid')),
          pay_date TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `
    },
    {
      name: 'deals',
      sql: `
        CREATE TABLE IF NOT EXISTS deals (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
          hubspot_deal_id TEXT,
          name TEXT NOT NULL,
          value DECIMAL(12,2) NOT NULL,
          stage TEXT NOT NULL DEFAULT 'lead' CHECK (stage IN ('lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost')),
          owner TEXT NOT NULL,
          close_date TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `
    },
    {
      name: 'renewals',
      sql: `
        CREATE TABLE IF NOT EXISTS renewals (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          policy_id UUID REFERENCES policies(id) ON DELETE CASCADE,
          renewal_date TIMESTAMP WITH TIME ZONE NOT NULL,
          status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'in_progress', 'completed', 'lapsed')),
          new_premium DECIMAL(10,2),
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `
    },
    {
      name: 'providers',
      sql: `
        CREATE TABLE IF NOT EXISTS providers (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name TEXT NOT NULL,
          type TEXT NOT NULL CHECK (type IN ('insurer', 'underwriter', 'broker')),
          country TEXT NOT NULL,
          api_enabled BOOLEAN DEFAULT false,
          status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
          contact_email TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `
    }
  ];

  // Since we can't execute arbitrary SQL via RPC without custom functions,
  // we'll return the SQL statements for manual execution
  return {
    tables: tables.map(t => ({ name: t.name, sql: t.sql })),
    message: "Please execute these SQL statements in the Supabase SQL Editor or use the migration file.",
    migrationFile: "supabase/migrations/20240115000001_create_missing_tables.sql"
  };
};
