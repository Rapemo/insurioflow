import { supabase } from '@/integrations/supabase/client';

export interface Claim {
  id: string;
  company_id: string;
  employee_id: string;
  policy_number: string;
  claim_type: string;
  amount: number;
  description: string;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'paid';
  submitted_date: string;
  updated_date: string;
  // Joined fields
  company_name?: string;
  employee_name?: string;
}

export interface CreateClaimData {
  company_id: string;
  employee_id: string;
  policy_number: string;
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
          companies(name),
          employees(first_name, last_name)
        `)
        .order('submitted_date', { ascending: false });

      if (error) throw error;

      const transformedData: Claim[] = (data || []).map((item: any) => ({
        id: item.id,
        company_id: item.company_id,
        employee_id: item.employee_id,
        policy_number: item.policy_number,
        claim_type: item.claim_type,
        amount: item.amount,
        description: item.description,
        status: item.status,
        submitted_date: item.submitted_date,
        updated_date: item.updated_date,
        company_name: item.companies?.name,
        employee_name: item.employees ? `${item.employees.first_name} ${item.employees.last_name}` : undefined
      }));

      return { data: transformedData, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getClaimById(id: string): Promise<{ data: Claim | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('claims')
        .select(`
          *,
          companies(name),
          employees(first_name, last_name, email)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      const transformedData: Claim = {
        id: data.id,
        company_id: data.company_id,
        employee_id: data.employee_id,
        policy_number: data.policy_number,
        claim_type: data.claim_type,
        amount: data.amount,
        description: data.description,
        status: data.status,
        submitted_date: data.submitted_date,
        updated_date: data.updated_date,
        company_name: data.companies?.name,
        employee_name: data.employees ? `${data.employees.first_name} ${data.employees.last_name}` : undefined
      };

      return { data: transformedData, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async createClaim(claimData: CreateClaimData): Promise<{ data: Claim | null; error: any }> {
    try {
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('claims')
        .insert({
          ...claimData,
          status: 'submitted',
          submitted_date: now,
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

  async updateClaimStatus(id: string, status: Claim['status']): Promise<{ data: Claim | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('claims')
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

  async deleteClaim(id: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('claims')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      return { error };
    }
  }
};
