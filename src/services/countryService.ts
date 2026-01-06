import { createClient } from '@/integrations/supabase/client';
import { Database } from '@/types/supabase';

type Country = Database['public']['Tables']['countries']['Row'];
type CountryInsert = Database['public']['Tables']['countries']['Insert'];

const supabase = createClient();

export const getCountries = async (): Promise<{ data: Country[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching countries:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error fetching countries:', error);
    return { data: null, error: error as Error };
  }
};

export const addCountry = async (country: Omit<CountryInsert, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await supabase
      .from('countries')
      .insert([country])
      .select()
      .single();

    if (error) {
      console.error('Error adding country:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error adding country:', error);
    return { data: null, error: error as Error };
  }
};

export const updateCountry = async (id: string, updates: Partial<CountryInsert>) => {
  try {
    const { data, error } = await supabase
      .from('countries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating country:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error updating country:', error);
    return { data: null, error: error as Error };
  }
};

export const deleteCountry = async (id: string) => {
  try {
    const { error } = await supabase
      .from('countries')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting country:', error);
      return { error: new Error(error.message) };
    }

    return { error: null };
  } catch (error) {
    console.error('Unexpected error deleting country:', error);
    return { error: error as Error };
  }
};
