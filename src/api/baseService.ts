import { apiClient, ApiResponse, PaginationParams, FilterParams } from './apiClient';

/**
 * Base service class with common CRUD operations
 */
export abstract class BaseService<T, CreateT = any, UpdateT = any> {
  protected abstract tableName: string;

  /**
   * Get all records with optional filtering and pagination
   */
  async getAll(
    filters?: FilterParams,
    pagination?: PaginationParams
  ): Promise<ApiResponse<T[]>> {
    return apiClient.select<T>(this.tableName, undefined, filters, pagination);
  }

  /**
   * Get a single record by ID
   */
  async getById(id: string): Promise<ApiResponse<T>> {
    return apiClient.selectOne<T>(this.tableName, id);
  }

  /**
   * Create a new record
   */
  async create(data: CreateT): Promise<ApiResponse<T>> {
    return apiClient.insert<T>(this.tableName, data);
  }

  /**
   * Update an existing record
   */
  async update(id: string, data: UpdateT): Promise<ApiResponse<T>> {
    return apiClient.update<T>(this.tableName, id, data);
  }

  /**
   * Delete a record
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(this.tableName, id);
  }

  /**
   * Search records by name or other text fields
   */
  async search(query: string, pagination?: PaginationParams): Promise<ApiResponse<T[]>> {
    return this.getAll({ search: query }, pagination);
  }

  /**
   * Get records by status
   */
  async getByStatus(status: string, pagination?: PaginationParams): Promise<ApiResponse<T[]>> {
    return this.getAll({ status }, pagination);
  }

  /**
   * Custom query for complex operations
   */
  protected async customQuery<R>(
    operation: () => Promise<{ data: R | null; error: any }>
  ): Promise<ApiResponse<R>> {
    return apiClient.fetch(operation);
  }
}
