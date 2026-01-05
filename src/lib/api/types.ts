// Database-agnostic API types
// These interfaces define the contract between the frontend and any backend implementation

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface QueryOptions {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, unknown>;
}

// Repository interfaces - these define what operations are available
// Each repository can be implemented with any database backend

export interface ICompanyRepository {
  getAll(options?: QueryOptions): Promise<PaginatedResponse<Company>>;
  getById(id: string): Promise<ApiResponse<Company>>;
  create(data: Omit<Company, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Company>>;
  update(id: string, data: Partial<Company>): Promise<ApiResponse<Company>>;
  delete(id: string): Promise<ApiResponse<void>>;
}

export interface IEmployeeRepository {
  getAll(options?: QueryOptions): Promise<PaginatedResponse<Employee>>;
  getById(id: string): Promise<ApiResponse<Employee>>;
  getByCompanyId(companyId: string, options?: QueryOptions): Promise<PaginatedResponse<Employee>>;
  create(data: Omit<Employee, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Employee>>;
  update(id: string, data: Partial<Employee>): Promise<ApiResponse<Employee>>;
  delete(id: string): Promise<ApiResponse<void>>;
}

export interface IPolicyRepository {
  getAll(options?: QueryOptions): Promise<PaginatedResponse<Policy>>;
  getById(id: string): Promise<ApiResponse<Policy>>;
  getByCompanyId(companyId: string, options?: QueryOptions): Promise<PaginatedResponse<Policy>>;
  create(data: Omit<Policy, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Policy>>;
  update(id: string, data: Partial<Policy>): Promise<ApiResponse<Policy>>;
  delete(id: string): Promise<ApiResponse<void>>;
}

export interface IClaimRepository {
  getAll(options?: QueryOptions): Promise<PaginatedResponse<Claim>>;
  getById(id: string): Promise<ApiResponse<Claim>>;
  getByPolicyId(policyId: string, options?: QueryOptions): Promise<PaginatedResponse<Claim>>;
  create(data: Omit<Claim, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Claim>>;
  update(id: string, data: Partial<Claim>): Promise<ApiResponse<Claim>>;
  delete(id: string): Promise<ApiResponse<void>>;
}

export interface IQuoteRepository {
  getAll(options?: QueryOptions): Promise<PaginatedResponse<Quote>>;
  getById(id: string): Promise<ApiResponse<Quote>>;
  getByCompanyId(companyId: string, options?: QueryOptions): Promise<PaginatedResponse<Quote>>;
  create(data: Omit<Quote, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Quote>>;
  update(id: string, data: Partial<Quote>): Promise<ApiResponse<Quote>>;
  delete(id: string): Promise<ApiResponse<void>>;
}

export interface ICommissionRepository {
  getAll(options?: QueryOptions): Promise<PaginatedResponse<Commission>>;
  getById(id: string): Promise<ApiResponse<Commission>>;
  getByPolicyId(policyId: string): Promise<ApiResponse<Commission[]>>;
  create(data: Omit<Commission, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Commission>>;
  update(id: string, data: Partial<Commission>): Promise<ApiResponse<Commission>>;
  delete(id: string): Promise<ApiResponse<void>>;
}

export interface IDealRepository {
  getAll(options?: QueryOptions): Promise<PaginatedResponse<Deal>>;
  getById(id: string): Promise<ApiResponse<Deal>>;
  getByStage(stage: string, options?: QueryOptions): Promise<PaginatedResponse<Deal>>;
  create(data: Omit<Deal, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Deal>>;
  update(id: string, data: Partial<Deal>): Promise<ApiResponse<Deal>>;
  delete(id: string): Promise<ApiResponse<void>>;
}

export interface IRenewalRepository {
  getAll(options?: QueryOptions): Promise<PaginatedResponse<Renewal>>;
  getById(id: string): Promise<ApiResponse<Renewal>>;
  getByStatus(status: string, options?: QueryOptions): Promise<PaginatedResponse<Renewal>>;
  create(data: Omit<Renewal, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Renewal>>;
  update(id: string, data: Partial<Renewal>): Promise<ApiResponse<Renewal>>;
  delete(id: string): Promise<ApiResponse<void>>;
}

export interface IProviderRepository {
  getAll(options?: QueryOptions): Promise<PaginatedResponse<Provider>>;
  getById(id: string): Promise<ApiResponse<Provider>>;
  getByType(type: string, options?: QueryOptions): Promise<PaginatedResponse<Provider>>;
  create(data: Omit<Provider, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Provider>>;
  update(id: string, data: Partial<Provider>): Promise<ApiResponse<Provider>>;
  delete(id: string): Promise<ApiResponse<void>>;
}

// Entity types (database-agnostic)
export interface Company {
  id: string;
  name: string;
  industry: string;
  employee_count: number;
  country: string;
  status: 'active' | 'pending' | 'inactive';
  workpay_id?: string;
  hubspot_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: string;
  company_id: string;
  first_name: string;
  last_name: string;
  email: string;
  department: string;
  position: string;
  salary: number;
  date_of_birth: string;
  employment_date: string;
  status: 'active' | 'terminated' | 'on_leave';
  created_at: string;
  updated_at: string;
}

export interface Policy {
  id: string;
  company_id: string;
  provider_id: string;
  policy_number: string;
  product_type: string;
  premium: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'pending' | 'expired' | 'cancelled';
  covered_employees: number;
  created_at: string;
  updated_at: string;
}

export interface Claim {
  id: string;
  policy_id: string;
  employee_id: string;
  claim_number: string;
  claim_type: string;
  amount: number;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'paid';
  submitted_date: string;
  resolved_date?: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Quote {
  id: string;
  company_id: string;
  provider_id?: string;
  quote_number: string;
  product_type: string;
  premium: number;
  status: 'draft' | 'pending' | 'sent' | 'accepted' | 'rejected' | 'expired';
  valid_until: string;
  employee_count: number;
  created_at: string;
  updated_at: string;
}

export interface Commission {
  id: string;
  policy_id: string;
  broker_id?: string;
  amount: number;
  percentage: number;
  status: 'pending' | 'calculated' | 'paid';
  pay_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Deal {
  id: string;
  company_id: string;
  hubspot_deal_id?: string;
  name: string;
  value: number;
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  owner: string;
  close_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Renewal {
  id: string;
  policy_id: string;
  renewal_date: string;
  status: 'upcoming' | 'in_progress' | 'completed' | 'lapsed';
  new_premium?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Provider {
  id: string;
  name: string;
  type: 'insurer' | 'underwriter' | 'broker';
  country: string;
  api_enabled: boolean;
  status: 'active' | 'inactive';
  contact_email?: string;
  created_at: string;
  updated_at: string;
}
