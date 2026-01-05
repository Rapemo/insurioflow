// Supabase implementation of Company Repository
import { supabase } from '@/integrations/supabase/client';
import { BaseRepository } from '../base';
import { 
  Company, 
  ICompanyRepository, 
  ApiResponse, 
  PaginatedResponse, 
  QueryOptions 
} from '../../types';

export class SupabaseCompanyRepository extends BaseRepository<Company> implements ICompanyRepository {
  private readonly tableName = 'companies';

  async getAll(options: QueryOptions = {}): Promise<PaginatedResponse<Company>> {
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

      return this.paginatedResponse(data as unknown as Company[], count || 0, options);
    } catch (error) {
      return this.paginatedErrorResponse(this.handleError(error));
    }
  }

  async getById(id: string): Promise<ApiResponse<Company>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName as any)
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return this.errorResponse('Company not found');

      return this.successResponse(data as unknown as Company);
    } catch (error) {
      return this.errorResponse(this.handleError(error));
    }
  }

  async create(companyData: Omit<Company, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Company>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName as any)
        .insert(companyData as any)
        .select()
        .single();

      if (error) throw error;

      return this.successResponse(data as unknown as Company);
    } catch (error) {
      return this.errorResponse(this.handleError(error));
    }
  }

  async update(id: string, companyData: Partial<Company>): Promise<ApiResponse<Company>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName as any)
        .update({ ...companyData, updated_at: new Date().toISOString() } as any)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return this.successResponse(data as unknown as Company);
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
