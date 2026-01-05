import { supabase } from '@/integrations/supabase/client';

export const checkCompaniesSchema = async () => {
  try {
    // Try to get column information
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Schema check error:', error);
      return { error: error.message, columns: null };
    }
    
    if (data && data.length > 0) {
      const columns = Object.keys(data[0]);
      console.log('Companies table columns:', columns);
      return { error: null, columns };
    } else {
      console.log('Companies table is empty, but we can check the schema');
      return { error: null, columns: [] };
    }
  } catch (err: any) {
    console.error('Unexpected error:', err);
    return { error: err.message, columns: null };
  }
};
