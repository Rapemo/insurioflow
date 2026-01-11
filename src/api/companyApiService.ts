import { BaseService } from './baseService';
import { ApiResponse, PaginationParams, FilterParams } from './apiClient';
import { supabase } from '@/integrations/supabase/client';

// Company interfaces
export interface Company {
  id: string;
  name: string;
  type: string;
  status: string;
  country: string;
  contact_email: string;
  api_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCompanyData {
  name: string;
  type: string;
  country: string;
  contact_email: string;
  api_enabled?: boolean;
}

export interface UpdateCompanyData {
  name?: string;
  type?: string;
  status?: string;
  country?: string;
  contact_email?: string;
  api_enabled?: boolean;
}

/**
 * Company API Service - Clean separation between frontend and backend
 */
class CompanyApiService extends BaseService<Company, CreateCompanyData, UpdateCompanyData> {
  protected tableName = 'companies';

  /**
   * Get companies with employee count
   */
  async getCompaniesWithEmployeeCount(
    filters?: FilterParams,
    pagination?: PaginationParams
  ): Promise<ApiResponse<Company & { employee_count?: number }[]>> {
    return this.customQuery(async () => {
      let query: any = supabase
        .from(this.tableName)
        .select(`
          *,
          employees(count)
        `);

      // Apply filters
      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      // Apply pagination
      if (pagination?.orderBy) {
        query = query.order(pagination.orderBy, { 
          ascending: pagination.ascending ?? true 
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
      
      // Transform data to include employee count
      const transformedData = (result.data || []).map((item: any) => ({
        ...item,
        employee_count: item.employees?.[0]?.count || 0
      }));

      return { data: transformedData, error: result.error };
    });
  }

  /**
   * Get company by ID with employees
   */
  async getCompanyWithEmployees(id: string): Promise<ApiResponse<Company & { employees?: any[] }>> {
    return this.customQuery(async () => {
      const { data, error } = await supabase
        .from(this.tableName)
        .select(`
          *,
          employees(*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching company with employees:', error);
        return { data: null, error };
      }

      return { data, error: null };
    });
  }

  /**
   * Create company with initial admin
   */
  async createCompanyWithAdmin(
    companyData: CreateCompanyData,
    adminEmail: string,
    adminFullName: string
  ): Promise<ApiResponse<{ company: Company; admin: any }>> {
    return this.customQuery(async () => {
      // Create company
      const { data: company, error: companyError } = await supabase
        .from(this.tableName)
        .insert([companyData])
        .select()
        .single();

      if (companyError) {
        console.error('Error creating company:', companyError);
        return { data: null, error: companyError };
      }

      // Create admin user
      const { data: admin, error: adminError } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: Math.random().toString(36).slice(-8),
        email_confirm: true,
        user_metadata: {
          full_name: adminFullName,
          company_id: company.id
        }
      });

      if (adminError) {
        console.error('Error creating admin user:', adminError);
        // Rollback company creation
        await supabase.from(this.tableName).delete().eq('id', company.id);
        return { data: null, error: adminError };
      }

      // Create admin profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([{
          user_id: admin.user!.id,
          role: 'admin',
          company_id: company.id,
          full_name: adminFullName
        }]);

      if (profileError) {
        console.error('Error creating admin profile:', profileError);
        // Rollback
        await supabase.auth.admin.deleteUser(admin.user!.id);
        await supabase.from(this.tableName).delete().eq('id', company.id);
        return { data: null, error: profileError };
      }

      return {
        data: {
          company,
          admin: admin.user
        },
        error: null
      };
    });
  }

  /**
   * Get company statistics
   */
  async getCompanyStats(id: string): Promise<ApiResponse<{
    employeeCount: number;
    policyCount: number;
    activePolicies: number;
    totalPremium: number;
  }>> {
    return this.customQuery(async () => {
      // Get employee count
      const { count: employeeCount } = await supabase
        .from('employees')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', id);

      // Get policy count
      const { count: policyCount } = await supabase
        .from('policies')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', id);

      // Get active policies
      const { count: activePolicies } = await supabase
        .from('policies')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', id)
        .eq('status', 'active');

      // Get total premium
      const { data: policies } = await supabase
        .from('policies')
        .select('premium')
        .eq('company_id', id)
        .eq('status', 'active');

      const totalPremium = policies?.reduce((sum: number, policy: any) => 
        sum + (policy.premium || 0), 0
      );

      return {
        data: {
          employeeCount: employeeCount || 0,
          policyCount: policyCount || 0,
          activePolicies: activePolicies || 0,
          totalPremium: totalPremium || 0
        },
        error: null
      };
    });
  }

  /**
   * Search companies by name
   */
  async searchCompanies(
    query: string,
    pagination?: PaginationParams
  ): Promise<ApiResponse<Company[]>> {
    return this.search(query, pagination);
  }

  /**
   * Get companies by status
   */
  async getCompaniesByStatus(
    status: string,
    pagination?: PaginationParams
  ): Promise<ApiResponse<Company[]>> {
    return this.getByStatus(status, pagination);
  }

  /**
   * Update company status
   */
  async updateCompanyStatus(id: string, status: string): Promise<ApiResponse<Company>> {
    return this.update(id, { status });
  }

  /**
   * Toggle API access
   */
  async toggleApiAccess(id: string): Promise<ApiResponse<Company>> {
    return this.customQuery(async () => {
      // Get current company
      const { data: current, error: fetchError } = await supabase
        .from(this.tableName)
        .select('api_enabled')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Error fetching company:', fetchError);
        return { data: null, error: fetchError };
      }

      // Toggle API access
      const { data, error } = await supabase
        .from(this.tableName)
        .update({ api_enabled: !current.api_enabled })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error toggling API access:', error);
        return { data: null, error };
      }

      return { data, error: null };
    });
  }
}

// Export singleton instance
export const companyApiService = new CompanyApiService();
export type { Company, CreateCompanyData, UpdateCompanyData };
