// Supabase implementation of Employee Repository
import { supabase } from '@/integrations/supabase/client';
import { BaseRepository } from '../base';
import { 
  Employee, 
  IEmployeeRepository, 
  ApiResponse, 
  PaginatedResponse, 
  QueryOptions 
} from '../../types';

export class SupabaseEmployeeRepository extends BaseRepository<Employee> implements IEmployeeRepository {
  private readonly tableName = 'employees';

  async getAll(options: QueryOptions = {}): Promise<PaginatedResponse<Employee>> {
    try {
      const { page = 1, pageSize = 10, sortBy = 'created_at', sortOrder = 'desc', filters = {} } = options;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from(this.tableName as any)
        .select('*', { count: 'exact' });

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query = query.eq(key, value);
        }
      });

      const { data, error, count } = await query
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(from, to);

      if (error) throw error;

      return this.paginatedResponse(data as unknown as Employee[], count || 0, options);
    } catch (error) {
      return this.paginatedErrorResponse(this.handleError(error));
    }
  }

  async getById(id: string): Promise<ApiResponse<Employee>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName as any)
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return this.errorResponse('Employee not found');

      return this.successResponse(data as unknown as Employee);
    } catch (error) {
      return this.errorResponse(this.handleError(error));
    }
  }

  async getByCompanyId(companyId: string, options: QueryOptions = {}): Promise<PaginatedResponse<Employee>> {
    try {
      const { page = 1, pageSize = 10, sortBy = 'created_at', sortOrder = 'desc' } = options;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await supabase
        .from(this.tableName as any)
        .select('*', { count: 'exact' })
        .eq('company_id', companyId)
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(from, to);

      if (error) throw error;

      return this.paginatedResponse(data as unknown as Employee[], count || 0, options);
    } catch (error) {
      return this.paginatedErrorResponse(this.handleError(error));
    }
  }

  async create(employeeData: Omit<Employee, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Employee>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName as any)
        .insert(employeeData as any)
        .select()
        .single();

      if (error) throw error;

      return this.successResponse(data as unknown as Employee);
    } catch (error) {
      return this.errorResponse(this.handleError(error));
    }
  }

  async update(id: string, employeeData: Partial<Employee>): Promise<ApiResponse<Employee>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName as any)
        .update({ ...employeeData, updated_at: new Date().toISOString() } as any)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return this.successResponse(data as unknown as Employee);
    } catch (error) {
      return this.errorResponse(this.handleError(error));
    }
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from(this.tableName as any)
        .delete()
        .eq('id', id);

      if (error) throw error;

      return this.successResponse(undefined);
    } catch (error) {
      return this.errorResponse(this.handleError(error));
    }
  }
}
