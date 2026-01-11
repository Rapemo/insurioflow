import { BaseService } from './baseService';
import { ApiResponse, PaginationParams, FilterParams } from './apiClient';
import { supabase } from '@/integrations/supabase/client';

// Policy interfaces
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

export interface UpdatePolicyData {
  company_id?: string;
  product_type?: string;
  provider_id?: string;
  premium?: number;
  status?: string;
  start_date?: string;
  end_date?: string;
  covered_employees?: number;
}

/**
 * Policy API Service - Clean separation between frontend and backend
 */
class PolicyApiService extends BaseService<Policy, CreatePolicyData, UpdatePolicyData> {
  protected tableName = 'policies';

  /**
   * Get policies with company and provider joins
   */
  async getPoliciesWithDetails(
    filters?: FilterParams,
    pagination?: PaginationParams
  ): Promise<ApiResponse<Policy[]>> {
    return this.customQuery(async () => {
      let query: any = supabase
        .from('policies')
        .select('*');

      // Apply filters
      if (filters?.search) {
        query = query.ilike('policy_number', `%${filters.search}%`);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.company_id) {
        query = query.eq('company_id', filters.company_id);
      }

      // Apply pagination
      if (pagination?.orderBy) {
        query = query.order(pagination.orderBy, { 
          ascending: pagination.ascending ?? false 
        });
      }

      if (pagination?.limit) {
        query = query.limit(pagination.limit);
      }

      if (pagination?.page && pagination?.limit) {
        const offset = (pagination.page - 1) * pagination.limit;
        query = query.range(offset, offset + pagination.limit - 1);
      }

      const result = await query;
      
      // Transform data to include joined fields
      const transformedData = (result.data || []).map((item: any) => ({
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
        company_name: undefined, // Will be fetched separately if needed
        provider_name: undefined // Will be fetched separately if needed
      }));

      return { data: transformedData, error: result.error };
    });
  }

  /**
   * Get policies by company
   */
  async getByCompany(
    companyId: string,
    pagination?: PaginationParams
  ): Promise<ApiResponse<Policy[]>> {
    return this.getAll({ company_id: companyId }, pagination);
  }

  /**
   * Get policies by status
   */
  async getByStatus(
    status: string,
    pagination?: PaginationParams
  ): Promise<ApiResponse<Policy[]>> {
    return this.getByStatus(status, pagination);
  }

  /**
   * Search policies by policy number
   */
  async searchByPolicyNumber(
    policyNumber: string,
    pagination?: PaginationParams
  ): Promise<ApiResponse<Policy[]>> {
    return this.search(policyNumber, pagination);
  }

  /**
   * Create new policy
   */
  async createPolicy(data: CreatePolicyData): Promise<ApiResponse<Policy>> {
    return this.create(data);
  }

  /**
   * Update policy
   */
  async updatePolicy(
    id: string, 
    data: UpdatePolicyData
  ): Promise<ApiResponse<Policy>> {
    return this.update(id, data);
  }

  /**
   * Delete policy
   */
  async deletePolicy(id: string): Promise<ApiResponse<void>> {
    return this.delete(id);
  }

  /**
   * Get policy statistics
   */
  async getPolicyStats(): Promise<ApiResponse<{
    total: number;
    active: number;
    expired: number;
    totalPremium: number;
  }>> {
    return this.customQuery(async () => {
      // Get total count
      const { count: totalCount } = await supabase
        .from('policies')
        .select('*', { count: 'exact', head: true });

      // Get active count
      const { count: activeCount } = await supabase
        .from('policies')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Get expired count
      const { count: expiredCount } = await supabase
        .from('policies')
        .select('*', { count: 'exact', head: true })
        .lt('end_date', new Date().toISOString());

      // Get total premium sum
      const { data: premiumData } = await supabase
        .from('policies')
        .select('premium');

      const totalPremium = premiumData?.reduce((sum: number, policy: any) => 
        sum + (policy.premium || 0), 0
      );

      return {
        data: {
          total: totalCount || 0,
          active: activeCount || 0,
          expired: expiredCount || 0,
          totalPremium
        },
        error: null
      };
    });
  }
}

// Export singleton instance
export const policyApiService = new PolicyApiService();
