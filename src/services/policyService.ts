import { supabase } from '@/integrations/supabase/client';
import { getFriendlyErrorMessage } from '@/utils/errorHandler';

export interface Policy {
  id: string;
  company_id: string;
  policy_number: string;
  product_type: string;
  provider_id: string;
  premium: number;
  status: string;
  start_date: string;
  end_date: string;
  covered_employees: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  company_name?: string;
  provider_name?: string;
}

export interface CreatePolicyData {
  company_id: string;
  product_type: string;
  provider_id: string;
  premium: number;
  start_date: string;
  end_date: string;
  covered_employees: number;
}

export const policyService = {
  async getPolicies(): Promise<{ data: Policy[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('policies')
        .select(`
          *,
          companies(name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching policies:', error);
        return { data: null, error: getFriendlyErrorMessage(error) };
      }

      const transformedData: Policy[] = (data || []).map((item: any) => ({
        id: item.id,
        company_id: item.company_id,
        policy_number: item.policy_number,
        product_type: item.product_type,
        provider_id: item.provider_id,
        premium: item.premium,
        status: item.status,
        start_date: item.start_date,
        end_date: item.end_date,
        covered_employees: item.covered_employees,
        created_at: item.created_at,
        updated_at: item.updated_at,
        company_name: item.companies?.name
      }));

      return { data: transformedData, error: null };
    } catch (error) {
      console.error('Unexpected error fetching policies:', error);
      return { data: null, error: getFriendlyErrorMessage(error) };
    }
  },

  async getPolicyById(id: string): Promise<{ data: Policy | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('policies')
        .select(`
          *,
          companies(name, industry)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching policy:', error);
        return { data: null, error: getFriendlyErrorMessage(error) };
      }

      const transformedData: Policy = {
        id: data.id,
        company_id: data.company_id,
        policy_number: data.policy_number,
        product_type: data.product_type,
        provider_id: data.provider_id,
        premium: data.premium,
        status: data.status,
        start_date: data.start_date,
        end_date: data.end_date,
        covered_employees: data.covered_employees,
        created_at: data.created_at,
        updated_at: data.updated_at,
        company_name: data.companies?.name
      };

      return { data: transformedData, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async createPolicy(policyData: CreatePolicyData): Promise<{ data: Policy | null; error: any }> {
    try {
      const now = new Date().toISOString();
      const policyNumber = `POL-${Date.now()}`;
      
      const { data, error } = await supabase
        .from('policies')
        .insert({
          ...policyData,
          policy_number: `POL-${Date.now()}`,
          status: 'pending_approval',
          created_at: now,
          updated_at: now
        })
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updatePolicyStatus(id: string, status: Policy['status']): Promise<{ data: Policy | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('policies')
        .update({
          status,
          updated_at: new Date().toISOString()
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

  async renewPolicy(id: string, newEndDate: string): Promise<{ data: Policy | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('policies')
        .update({
          end_date: newEndDate,
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};
