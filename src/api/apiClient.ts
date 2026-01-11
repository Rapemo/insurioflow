import { supabase } from '@/integrations/supabase/client';
import { getFriendlyErrorMessage, FriendlyError } from '@/utils/errorHandler';

// Standard API response type
export interface ApiResponse<T = any> {
  data: T | null;
  error: FriendlyError | null;
  success: boolean;
}

// Standard pagination type
export interface PaginationParams {
  page?: number;
  limit?: number;
  orderBy?: string;
  ascending?: boolean;
}

// Standard filter type
export interface FilterParams {
  search?: string;
  status?: string;
  company_id?: string;
  user_id?: string;
  role?: string;
}

/**
 * Base API client with standardized error handling and response format
 */
class ApiClient {
  private static instance: ApiClient;

  private constructor() {}

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  /**
   * Generic fetch method with error handling
   */
  public async fetch<T>(
    operation: () => Promise<{ data: T | null; error: any }>
  ): Promise<ApiResponse<T>> {
    try {
      const result = await operation();
      
      if (result.error) {
        console.error('API Error:', result.error);
        return {
          data: null,
          error: getFriendlyErrorMessage(result.error),
          success: false
        };
      }

      return {
        data: result.data,
        error: null,
        success: true
      };
    } catch (error: any) {
      console.error('Unexpected API Error:', error);
      return {
        data: null,
        error: getFriendlyErrorMessage(error),
        success: false
      };
    }
  }

  /**
   * Select records from a table
   */
  async select<T>(
    table: string,
    columns?: string,
    filters?: FilterParams,
    pagination?: PaginationParams
  ): Promise<ApiResponse<T[]>> {
    return this.fetch(async () => {
      let query: any = supabase.from(table).select(columns || '*');

      // Apply filters
      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.company_id) {
        query = query.eq('company_id', filters.company_id);
      }
      if (filters?.user_id) {
        query = query.eq('user_id', filters.user_id);
      }
      if (filters?.role) {
        query = query.eq('role', filters.role);
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

      return await query;
    });
  }

  /**
   * Select a single record
   */
  async selectOne<T>(
    table: string,
    id: string,
    columns?: string
  ): Promise<ApiResponse<T>> {
    return this.fetch(async () => {
      return await supabase
        .from(table)
        .select(columns || '*')
        .eq('id', id)
        .single();
    });
  }

  /**
   * Insert a record
   */
  async insert<T>(
    table: string,
    data: any,
    returning: string = '*'
  ): Promise<ApiResponse<T>> {
    return this.fetch(async () => {
      return await supabase
        .from(table)
        .insert([data])
        .select(returning)
        .single();
    });
  }

  /**
   * Update a record
   */
  async update<T>(
    table: string,
    id: string,
    data: any,
    returning: string = '*'
  ): Promise<ApiResponse<T>> {
    return this.fetch(async () => {
      return await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select(returning)
        .single();
    });
  }

  /**
   * Delete a record
   */
  async delete(
    table: string,
    id: string
  ): Promise<ApiResponse<void>> {
    return this.fetch(async () => {
      const result = await supabase
        .from(table)
        .delete()
        .eq('id', id);
      
      return { data: null, error: result.error };
    });
  }

  /**
   * Custom RPC call
   */
  async rpc<T>(
    functionName: string,
    params?: any
  ): Promise<ApiResponse<T>> {
    return this.fetch(async () => {
      return await supabase.rpc(functionName, params);
    });
  }
}

// Export singleton instance
export const apiClient = ApiClient.getInstance();
