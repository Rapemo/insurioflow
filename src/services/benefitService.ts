import { supabase } from '@/integrations/supabase/client';
import { getFriendlyErrorMessage } from '@/utils/errorHandler';

export interface Benefit {
  id: string;
  name: string;
  type: 'medical' | 'dental' | 'vision' | 'life' | 'disability' | 'wellness';
  status: 'active' | 'inactive';
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBenefitData {
  name: string;
  type: Benefit['type'];
  status?: Benefit['status'];
  description?: string;
}

export const getBenefits = async (): Promise<{ data: Benefit[] | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('benefits')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching benefits:', error);
      return { data: null, error: getFriendlyErrorMessage(error) };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error fetching benefits:', error);
    return { data: null, error: getFriendlyErrorMessage(error) };
  }
};

export const addBenefit = async (benefit: CreateBenefitData): Promise<{ data: Benefit | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('benefits')
      .insert({
        ...benefit,
        status: benefit.status || 'active'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating benefit:', error);
      return { data: null, error: getFriendlyErrorMessage(error) };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error creating benefit:', error);
    return { data: null, error: getFriendlyErrorMessage(error) };
  }
};

export const updateBenefit = async (id: string, updates: Partial<CreateBenefitData>): Promise<{ data: Benefit | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('benefits')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating benefit:', error);
      return { data: null, error: getFriendlyErrorMessage(error) };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error updating benefit:', error);
    return { data: null, error: getFriendlyErrorMessage(error) };
  }
};

export const deleteBenefit = async (id: string): Promise<{ error: any }> => {
  try {
    const { error } = await supabase
      .from('benefits')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting benefit:', error);
      return { error: getFriendlyErrorMessage(error) };
    }

    return { error: null };
  } catch (error) {
    console.error('Unexpected error deleting benefit:', error);
    return { error: getFriendlyErrorMessage(error) };
  }
};
