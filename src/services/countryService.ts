import { supabase } from '@/integrations/supabase/client';
import { getFriendlyErrorMessage } from '@/utils/errorHandler';

export interface Country {
  id: string;
  code: string;
  name: string;
  currency: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface CreateCountryData {
  code: string;
  name: string;
  currency: string;
  status?: Country['status'];
}

export const getCountries = async (): Promise<{ data: Country[] | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching countries:', error);
      return { data: null, error: getFriendlyErrorMessage(error) };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error fetching countries:', error);
    return { data: null, error: getFriendlyErrorMessage(error) };
  }
};

export const addCountry = async (country: CreateCountryData): Promise<{ data: Country | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('countries')
      .insert({
        ...country,
        status: country.status || 'active'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating country:', error);
      return { data: null, error: getFriendlyErrorMessage(error) };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error creating country:', error);
    return { data: null, error: getFriendlyErrorMessage(error) };
  }
};

export const updateCountry = async (id: string, updates: Partial<CreateCountryData>): Promise<{ data: Country | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('countries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating country:', error);
      return { data: null, error: getFriendlyErrorMessage(error) };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error updating country:', error);
    return { data: null, error: getFriendlyErrorMessage(error) };
  }
};

export const deleteCountry = async (id: string): Promise<{ error: any }> => {
  try {
    const { error } = await supabase
      .from('countries')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting country:', error);
      return { error: getFriendlyErrorMessage(error) };
    }

    return { error: null };
  } catch (error) {
    console.error('Unexpected error deleting country:', error);
    return { error: getFriendlyErrorMessage(error) };
  }
};
