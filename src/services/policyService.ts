// Legacy policyService - DEPRECATED
// Use policyApiService from '@/api' instead
// This file is kept for backward compatibility

import { policyApiService, type Policy, type CreatePolicyData, type UpdatePolicyData } from '@/api';

// Re-export for backward compatibility
export const policyService = {
  getPolicies: () => policyApiService.getPoliciesWithDetails(),
  getPolicyById: (id: string) => policyApiService.getById(id),
  createPolicy: (data: CreatePolicyData) => policyApiService.createPolicy(data),
  updatePolicy: (id: string, data: UpdatePolicyData) => policyApiService.updatePolicy(id, data),
  deletePolicy: (id: string) => policyApiService.deletePolicy(id),
  getPoliciesByCompany: (companyId: string) => policyApiService.getByCompany(companyId),
  getPoliciesByStatus: (status: string) => policyApiService.getByStatus(status),
  searchPolicies: (query: string) => policyApiService.searchByPolicyNumber(query),
  getPolicyStats: () => policyApiService.getPolicyStats()
};

// Re-export types for backward compatibility
export type { Policy, CreatePolicyData, UpdatePolicyData } from '@/api';
