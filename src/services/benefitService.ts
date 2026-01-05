import { createClient } from '@/integrations/supabase/client';
import { Database } from '@/types/supabase';

type Benefit = Database['public']['Tables']['benefits']['Row'];
type BenefitInsert = Database['public']['Tables']['benefits']['Insert'];

const supabase = createClient();

export const getBenefits = async (): Promise<{ data: Benefit[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('benefits')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching benefits:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error fetching benefits:', error);
    return { data: null, error: error as Error };
  }
};

export const addBenefit = async (benefit: Omit<BenefitInsert, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await supabase
      .from('benefits')
      .insert([benefit])
      .select()
      .single();

    if (error) {
      console.error('Error adding benefit:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error adding benefit:', error);
    return { data: null, error: error as Error };
  }
};

export const updateBenefit = async (id: string, updates: Partial<BenefitInsert>) => {
  try {
    const { data, error } = await supabase
      .from('benefits')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating benefit:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error updating benefit:', error);
    return { data: null, error: error as Error };
  }
};

export const deleteBenefit = async (id: string) => {
  try {
    const { error } = await supabase
      .from('benefits')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting benefit:', error);
      return { error: new Error(error.message) };
    }

    return { error: null };
  } catch (error) {
    console.error('Unexpected error deleting benefit:', error);
    return { error: error as Error };
  }
};
