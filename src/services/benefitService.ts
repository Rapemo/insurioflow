// This service is disabled as benefits table doesn't exist in the current database schema
// Please create the benefits table in Supabase before using this service

export const getBenefits = async () => {
  console.warn('Benefits service is disabled - table does not exist in database');
  return { data: [], error: null };
};

export const addBenefit = async (benefit: any) => {
  console.warn('Benefits service is disabled - table does not exist in database');
  return { data: null, error: new Error('Benefits table not found') };
};

export const updateBenefit = async (id: string, updates: any) => {
  console.warn('Benefits service is disabled - table does not exist in database');
  return { data: null, error: new Error('Benefits table not found') };
};

export const deleteBenefit = async (id: string) => {
  console.warn('Benefits service is disabled - table does not exist in database');
  return { error: new Error('Benefits table not found') };
};
