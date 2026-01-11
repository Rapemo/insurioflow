// This service is disabled as countries table doesn't exist in the current database schema
// Please create the countries table in Supabase before using this service

export const getCountries = async () => {
  console.warn('Countries service is disabled - table does not exist in database');
  return { data: [], error: null };
};

export const addCountry = async (country: any) => {
  console.warn('Countries service is disabled - table does not exist in database');
  return { data: null, error: new Error('Countries table not found') };
};

export const updateCountry = async (id: string, updates: any) => {
  console.warn('Countries service is disabled - table does not exist in database');
  return { data: null, error: new Error('Countries table not found') };
};

export const deleteCountry = async (id: string) => {
  console.warn('Countries service is disabled - table does not exist in database');
  return { error: new Error('Countries table not found') };
};
