import { supabase } from '@/integrations/supabase/client';

const TABLE_NAMES = [
  'companies',
  'employees', 
  'policies',
  'claims',
  'quotes',
  'commissions',
  'deals',
  'renewals',
  'providers'
] as const;

export const checkDatabaseTables = async () => {
  const results: { [key: string]: boolean } = {};

  for (const table of TABLE_NAMES) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.error(`Error checking table ${table}:`, error);
        results[table] = false;
      } else {
        console.log(`Table ${table} exists`);
        results[table] = true;
      }
    } catch (err) {
      console.error(`Failed to check table ${table}:`, err);
      results[table] = false;
    }
  }

  return results;
};
