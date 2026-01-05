// Base repository with common functionality
import { ApiResponse, PaginatedResponse, QueryOptions } from '../types';

export abstract class BaseRepository<T> {
  protected handleError(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return 'An unexpected error occurred';
  }

  protected successResponse<R>(data: R): ApiResponse<R> {
    return {
      data,
      error: null,
      success: true,
    };
  }

  protected errorResponse<R>(error: string): ApiResponse<R> {
    return {
      data: null,
      error,
      success: false,
    };
  }

  protected paginatedResponse<R>(
    data: R[],
    total: number,
    options: QueryOptions = {}
  ): PaginatedResponse<R> {
    const page = options.page || 1;
    const pageSize = options.pageSize || 10;
    
    return {
      data,
      error: null,
      success: true,
      total,
      page,
      pageSize,
      hasMore: page * pageSize < total,
    };
  }

  protected paginatedErrorResponse<R>(error: string): PaginatedResponse<R> {
    return {
      data: null,
      error,
      success: false,
      total: 0,
      page: 1,
      pageSize: 10,
      hasMore: false,
    };
  }
}
