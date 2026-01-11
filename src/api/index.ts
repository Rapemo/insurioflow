// API Client and Base Service
export { apiClient } from './apiClient';
export { BaseService } from './baseService';
export type { ApiResponse, PaginationParams, FilterParams } from './apiClient';

// API Services
export { policyApiService } from './policyApiService';
export { userApiService } from './userApiService';
export { companyApiService } from './companyApiService';

// Service Types
export type { 
  Policy, 
  CreatePolicyData, 
  UpdatePolicyData 
} from './policyApiService';

export type { 
  AuthUser, 
  UserProfile, 
  CreateUserData, 
  UpdateUserData, 
  UserWithProfile 
} from './userApiService';

export type { 
  Company, 
  CreateCompanyData, 
  UpdateCompanyData 
} from './companyApiService';
