import { supabase } from '@/integrations/supabase/client';
import { getFriendlyErrorMessage } from '@/utils/errorHandler';
import { Quote as QuoteType, ApiResponse } from '@/lib/api/types';
import { createActivityFromEvent } from '@/hooks/useActivities';
import { activityService } from '@/services/activityService';
import { quoteDealService } from '@/services/quoteDealService';

export interface Quote extends QuoteType {
  // Joined fields
  company_name?: string;
  provider_name?: string;
}

export interface CreateQuoteData {
  company_id: string;
  product_type: string;
  provider_id?: string;
  premium: number;
  valid_until?: string;
  employee_count?: number;
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
        product_type: (item as any).policy_type || item.product_type,
        provider_id: item.provider_id,
        premium: (item as any).premium_amount || item.premium,
        status: item.status as Quote['status'],
        valid_until: item.valid_until,
        employee_count: item.employee_count,
        created_at: item.created_at,
        updated_at: item.updated_at
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
        product_type: (data as any).policy_type || data.product_type,
        provider_id: data.provider_id,
        premium: (data as any).premium_amount || data.premium,
        status: data.status as Quote['status'],
        valid_until: data.valid_until,
        employee_count: data.employee_count,
        created_at: data.created_at,
        updated_at: data.updated_at
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
          company_id: quoteData.company_id,
          quote_number: quoteNumber,
          product_type: quoteData.product_type,
          policy_type: quoteData.product_type || 'General',
          premium_amount: quoteData.premium || 0,
          status: 'draft',
          valid_until: quoteData.valid_until || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          employee_count: quoteData.employee_count || 1,
          provider_id: quoteData.provider_id || null,
          created_at: now,
          updated_at: now
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating quote:', error);
        return { data: null, error: getFriendlyErrorMessage(error) };
      }

      // Transform the response to match the expected Quote interface
      const transformedQuote: Quote = {
        id: data.id,
        company_id: data.company_id,
        quote_number: data.quote_number,
        product_type: (data as any).policy_type || data.product_type,
        provider_id: data.provider_id,
        premium: (data as any).premium_amount || data.premium,
        status: data.status as Quote['status'],
        valid_until: data.valid_until,
        employee_count: data.employee_count,
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      // Log quote creation activity
      if (data) {
        const activityData = createActivityFromEvent(
          'quote_created',
          'quote',
          data.id,
          `Quote ${quoteNumber} created`,
          `Quote ${quoteNumber} created successfully for ${quoteData.company_id}`,
          quoteData.company_id,
          quoteData.premium
        );

        await activityService.createActivity(activityData);
      }

      return { data: transformedQuote, error: null };
    } catch (error) {
      console.error('Unexpected error creating quote:', error);
      return { data: null, error: getFriendlyErrorMessage(error) };
    }
  },

  async updateQuoteStatus(id: string, status: Quote['status']): Promise<{ data: Quote | null; error: any }> {
    try {
      const { data: currentQuote, error: fetchError } = await supabase
        .from('quotes')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Error fetching quote:', fetchError);
        return { data: null, error: getFriendlyErrorMessage(fetchError) };
      }

      if (!currentQuote) {
        return { data: null, error: 'Quote not found' };
      }

      const oldStatus = currentQuote.status;
      
      const { data, error: updateError } = await supabase
        .from('quotes')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating quote status:', updateError);
        return { data: null, error: getFriendlyErrorMessage(updateError) };
      }

      // Transform the response
      const transformedQuote: Quote = {
        id: data.id,
        company_id: data.company_id,
        quote_number: data.quote_number,
        product_type: (data as any).policy_type || data.product_type,
        provider_id: data.provider_id,
        premium: (data as any).premium_amount || data.premium,
        status: data.status as Quote['status'],
        valid_until: data.valid_until,
        employee_count: data.employee_count,
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      // Log quote status update activity
      if (data && oldStatus !== status) {
        const activityData = createActivityFromEvent(
          status === 'accepted' ? 'quote_accepted' : 'quote_updated',
          'quote',
          id,
          `Quote status updated to ${status}`,
          `Quote ${currentQuote.quote_number} status changed from ${oldStatus} to ${status}`,
          currentQuote.company_id,
          (currentQuote as any).premium_amount || currentQuote.premium
        );

        await activityService.createActivity(activityData);

        // Trigger deal automation based on quote status change
        try {
          await quoteDealService.updateDealStageFromQuote(transformedQuote, oldStatus, status);
        } catch (dealError) {
          console.error('Error updating deal stage from quote:', dealError);
          // Don't fail the quote update if deal automation fails
        }
      }

      return { data: transformedQuote, error: null };
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
