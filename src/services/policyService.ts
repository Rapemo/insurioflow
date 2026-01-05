import { supabase } from '@/integrations/supabase/client';

export interface Policy {
  id: string;
  company_id: string;
  policy_number: string;
  product_type: string;
  provider: string;
  total_premium: number;
  status: 'pending_approval' | 'active' | 'expired' | 'cancelled';
  start_date: string;
  end_date: string;
  employees_count: number;
  created_date: string;
  updated_date: string;
  // Joined fields
  company_name?: string;
}

export interface CreatePolicyData {
  company_id: string;
  product_type: string;
  provider: string;
  total_premium: number;
  start_date: string;
  end_date: string;
  employees_count: number;
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
        .order('created_date', { ascending: false });

      if (error) throw error;

      const transformedData: Policy[] = (data || []).map((item: any) => ({
        id: item.id,
        company_id: item.company_id,
        policy_number: item.policy_number,
        product_type: item.product_type,
        provider: item.provider,
        total_premium: item.total_premium,
        status: item.status,
        start_date: item.start_date,
        end_date: item.end_date,
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

      if (error) throw error;

      const transformedData: Policy = {
        id: data.id,
        company_id: data.company_id,
        policy_number: data.policy_number,
        product_type: data.product_type,
        provider: data.provider,
        total_premium: data.total_premium,
        status: data.status,
        start_date: data.start_date,
        end_date: data.end_date,
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

  async createPolicy(policyData: CreatePolicyData): Promise<{ data: Policy | null; error: any }> {
    try {
      const now = new Date().toISOString();
      const policyNumber = `POL-${Date.now()}`;
      
      const { data, error } = await supabase
        .from('policies')
        .insert({
          ...policyData,
          policy_number: policyNumber,
          status: 'pending_approval',
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

  async updatePolicyStatus(id: string, status: Policy['status']): Promise<{ data: Policy | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('policies')
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

  async renewPolicy(id: string, newEndDate: string): Promise<{ data: Policy | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('policies')
        .update({
          end_date: newEndDate,
          status: 'active',
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
  }
};
