// API Layer - Database Agnostic Interface
// This is the main entry point for all data operations
// Swap the implementation by changing the imports below

import { SupabaseCompanyRepository } from './repositories/supabase/companyRepository';
import { SupabaseEmployeeRepository } from './repositories/supabase/employeeRepository';
import { SupabasePolicyRepository } from './repositories/supabase/policyRepository';
import { SupabaseClaimRepository } from './repositories/supabase/claimRepository';
import { SupabaseQuoteRepository } from './repositories/supabase/quoteRepository';

// Export types for use throughout the app
export * from './types';

// Repository instances - these are the only places where the database implementation is specified
// To switch databases, create new repository implementations and change the exports below

class ApiClient {
  // Singleton repositories
  private static _companies: SupabaseCompanyRepository | null = null;
  private static _employees: SupabaseEmployeeRepository | null = null;
  private static _policies: SupabasePolicyRepository | null = null;
  private static _claims: SupabaseClaimRepository | null = null;
  private static _quotes: SupabaseQuoteRepository | null = null;

  static get companies() {
    if (!this._companies) {
      this._companies = new SupabaseCompanyRepository();
    }
    return this._companies;
  }

  static get employees() {
    if (!this._employees) {
      this._employees = new SupabaseEmployeeRepository();
    }
    return this._employees;
  }

  static get policies() {
    if (!this._policies) {
      this._policies = new SupabasePolicyRepository();
    }
    return this._policies;
  }

  static get claims() {
    if (!this._claims) {
      this._claims = new SupabaseClaimRepository();
    }
    return this._claims;
  }

  static get quotes() {
    if (!this._quotes) {
      this._quotes = new SupabaseQuoteRepository();
    }
    return this._quotes;
  }
}

// Named export for easy usage: import { api } from '@/lib/api'
export const api = ApiClient;

// Example usage:
// const { data, error } = await api.companies.getAll({ page: 1, pageSize: 10 });
// const { data } = await api.employees.getByCompanyId('company-uuid');
// await api.policies.create({ ... });
