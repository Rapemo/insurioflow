import { supabase } from '@/integrations/supabase/client';
import { getFriendlyErrorMessage } from '@/utils/errorHandler';

export interface Quote {
  id: string;
  company_id: string;
  quote_number: string;
  product_type: string;
  provider_id: string;
  premium: number;
  status: 'draft' | 'pending' | 'sent' | 'accepted' | 'rejected' | 'expired';
  valid_until: string;
  employee_count: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  company_name?: string;
  provider_name?: string;
}

export interface CreateQuoteData {
  company_id: string;
  product_type: string;
  provider_id: string;
  premium: number;
  valid_until: string;
  employee_count: number;
}

export const quoteService = {
  async getQuotes(): Promise<{ data: Quote[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching quotes:', error);
        return { data: null, error: getFriendlyErrorMessage(error) };
      }

      const transformedData: Quote[] = (data || []).map((item: any) => ({
        id: item.id,
        company_id: item.company_id,
        quote_number: item.quote_number,
        product_type: item.product_type,
        provider_id: item.provider_id,
        premium: item.premium,
        status: item.status as Quote['status'],
        valid_until: item.valid_until,
        employee_count: item.employee_count,
        created_at: item.created_at,
        updated_at: item.updated_at,
        company_name: undefined, // Will be fetched separately if needed
        provider_name: undefined // Will be fetched separately if needed
      }));

      return { data: transformedData, error: null };
    } catch (error) {
      console.error('Unexpected error fetching quotes:', error);
      return { data: null, error: getFriendlyErrorMessage(error) };
    }
  },

  async getQuoteById(id: string): Promise<{ data: Quote | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching quote:', error);
        return { data: null, error: getFriendlyErrorMessage(error) };
      }

      const transformedData: Quote = {
        id: data.id,
        company_id: data.company_id,
        quote_number: data.quote_number,
        product_type: data.product_type,
        provider_id: data.provider_id,
        premium: data.premium,
        status: data.status as Quote['status'],
        valid_until: data.valid_until,
        employee_count: data.employee_count,
        created_at: data.created_at,
        updated_at: data.updated_at,
        company_name: undefined, // Will be fetched separately if needed
        provider_name: undefined // Will be fetched separately if needed
      };

      return { data: transformedData, error: null };
    } catch (error) {
      console.error('Unexpected error fetching quote:', error);
      return { data: null, error: getFriendlyErrorMessage(error) };
    }
  },

  async createQuote(quoteData: CreateQuoteData): Promise<{ data: Quote | null; error: any }> {
    try {
      const now = new Date().toISOString();
      const quoteNumber = `Q-${Date.now()}`;
      
      const { data, error } = await supabase
        .from('quotes')
        .insert({
          ...quoteData,
          quote_number: quoteNumber,
          status: 'draft',
          created_at: now,
          updated_at: now
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating quote:', error);
        return { data: null, error: getFriendlyErrorMessage(error) };
      }

      return { data: data as Quote, error: null };
    } catch (error) {
      console.error('Unexpected error creating quote:', error);
      return { data: null, error: getFriendlyErrorMessage(error) };
    }
  },

  async updateQuoteStatus(id: string, status: Quote['status']): Promise<{ data: Quote | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating quote status:', error);
        return { data: null, error: getFriendlyErrorMessage(error) };
      }

      return { data: data as Quote, error: null };
    } catch (error) {
      console.error('Unexpected error updating quote status:', error);
      return { data: null, error: getFriendlyErrorMessage(error) };
    }
  },

  async deleteQuote(id: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting quote:', error);
        return { error: getFriendlyErrorMessage(error) };
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected error deleting quote:', error);
      return { error: getFriendlyErrorMessage(error) };
    }
  }
};
