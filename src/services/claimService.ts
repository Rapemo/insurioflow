import { supabase } from '@/integrations/supabase/client';
import { getFriendlyErrorMessage } from '@/utils/errorHandler';

export interface Claim {
  id: string;
  policy_id: string;
  employee_id: string;
  claim_number: string;
  claim_type: string;
  amount: number;
  description: string;
  status: string;
  submitted_date: string;
  created_at: string;
  updated_at: string;
  resolved_date?: string;
  // Joined fields
  company_name?: string;
  employee_name?: string;
}

export interface CreateClaimData {
  policy_id: string;
  employee_id: string;
  claim_type: string;
  amount: number;
  description: string;
}

export const claimService = {
  async getClaims(): Promise<{ data: Claim[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('claims')
        .select(`
          *,
          policies!inner(companies(name))
        `)
        .order('submitted_date', { ascending: false });

      if (error) {
        console.error('Error fetching claims:', error);
        return { data: null, error: getFriendlyErrorMessage(error) };
      }

      const transformedData: Claim[] = (data || []).map((item: any) => ({
        id: item.id,
        policy_id: item.policy_id,
        employee_id: item.employee_id,
        claim_number: item.claim_number,
        claim_type: item.claim_type,
        amount: item.amount,
        description: item.description,
        status: item.status,
        submitted_date: item.submitted_date,
        created_at: item.created_at,
        updated_at: item.updated_at,
        resolved_date: item.resolved_date,
        company_name: item.policies?.companies?.name,
        employee_name: undefined
      }));

      return { data: transformedData, error: null };
    } catch (error) {
      console.error('Unexpected error fetching claims:', error);
      return { data: null, error: getFriendlyErrorMessage(error) };
    }
  },

  async getClaimById(id: string): Promise<{ data: Claim | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('claims')
        .select(`
          *,
          policies!inner(companies(name))
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching claim:', error);
        return { data: null, error: getFriendlyErrorMessage(error) };
      }

      const transformedData: Claim = {
        id: data.id,
        policy_id: data.policy_id,
        employee_id: data.employee_id,
        claim_number: data.claim_number,
        claim_type: data.claim_type,
        amount: data.amount,
        description: data.description,
        status: data.status,
        submitted_date: data.submitted_date,
        created_at: data.created_at,
        updated_at: data.updated_at,
        resolved_date: data.resolved_date,
        company_name: data.policies?.companies?.name,
        employee_name: undefined
      };

      return { data: transformedData, error: null };
    } catch (error) {
      console.error('Unexpected error fetching claim:', error);
      return { data: null, error: getFriendlyErrorMessage(error) };
    }
  },

  async createClaim(claimData: CreateClaimData): Promise<{ data: Claim | null; error: any }> {
    try {
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('claims')
        .insert({
          ...claimData,
          claim_number: `CLM-${Date.now()}`,
          status: 'submitted',
          submitted_date: now,
          created_at: now,
          updated_at: now
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating claim:', error);
        return { data: null, error: getFriendlyErrorMessage(error) };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Unexpected error creating claim:', error);
      return { data: null, error: getFriendlyErrorMessage(error) };
    }
  },

  async updateClaimStatus(id: string, status: Claim['status']): Promise<{ data: Claim | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('claims')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating claim status:', error);
        return { data: null, error: getFriendlyErrorMessage(error) };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Unexpected error updating claim status:', error);
      return { data: null, error: getFriendlyErrorMessage(error) };
    }
  },

  async deleteClaim(id: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('claims')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting claim:', error);
        return { error: getFriendlyErrorMessage(error) };
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected error deleting claim:', error);
      return { error: getFriendlyErrorMessage(error) };
    }
  }
};
