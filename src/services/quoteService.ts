import { supabase } from '@/integrations/supabase/client';

export interface Quote {
  id: string;
  company_id: string;
  quote_number: string;
  product_type: string;
  provider: string;
  premium: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'expired';
  valid_until: string;
  employees_count: number;
  created_date: string;
  updated_date: string;
  // Joined fields
  company_name?: string;
}

export interface CreateQuoteData {
  company_id: string;
  product_type: string;
  provider: string;
  premium: number;
  valid_until: string;
  employees_count: number;
}

export const quoteService = {
  async getQuotes(): Promise<{ data: Quote[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          companies(name)
        `)
        .order('created_date', { ascending: false });

      if (error) throw error;

      const transformedData: Quote[] = (data || []).map((item: any) => ({
        id: item.id,
        company_id: item.company_id,
        quote_number: item.quote_number,
        product_type: item.product_type,
        provider: item.provider,
        premium: item.premium,
        status: item.status,
        valid_until: item.valid_until,
        employees_count: item.employees_count,
        created_date: item.created_date,
        updated_date: item.updated_date,
        company_name: item.companies?.name
      }));

      return { data: transformedData, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getQuoteById(id: string): Promise<{ data: Quote | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          companies(name, industry, country)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      const transformedData: Quote = {
        id: data.id,
        company_id: data.company_id,
        quote_number: data.quote_number,
        product_type: data.product_type,
        provider: data.provider,
        premium: data.premium,
        status: data.status,
        valid_until: data.valid_until,
        employees_count: data.employees_count,
        created_date: data.created_date,
        updated_date: data.updated_date,
        company_name: data.companies?.name
      };

      return { data: transformedData, error: null };
    } catch (error) {
      return { data: null, error };
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
          created_date: now,
          updated_date: now
        })
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateQuoteStatus(id: string, status: Quote['status']): Promise<{ data: Quote | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .update({
          status,
          updated_date: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async copyQuote(id: string): Promise<{ data: Quote | null; error: any }> {
    try {
      // First get the original quote
      const { data: originalQuote, error: fetchError } = await this.getQuoteById(id);
      
      if (fetchError || !originalQuote) {
        return { data: null, error: fetchError };
      }

      // Create a copy with new quote number
      const { data, error } = await this.createQuote({
        company_id: originalQuote.company_id,
        product_type: originalQuote.product_type,
        provider: originalQuote.provider,
        premium: originalQuote.premium,
        valid_until: originalQuote.valid_until,
        employees_count: originalQuote.employees_count
      });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }
};
