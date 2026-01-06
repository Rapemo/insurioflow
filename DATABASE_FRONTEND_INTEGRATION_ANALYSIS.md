# Database-Frontend Integration Analysis

## Critical Schema Mismatches Found

### 1. QuoteService Issues
**Database Schema:**
- `provider_id` (UUID, references providers table)
- `created_at`, `updated_at` (TIMESTAMPTZ)
- `employee_count` (INTEGER)
- Status values: `draft, pending, sent, accepted, rejected, expired`

**Frontend Interface Issues:**
- Expects `provider` (string) instead of `provider_id`
- Expects `created_date`, `updated_date` instead of `created_at`, `updated_at`
- Expects `employees_count` instead of `employee_count`
- Status enum missing `sent, accepted` values

### 2. PolicyService Issues
**Database Schema:**
- `provider_id` (UUID, references providers table)
- `premium` (NUMERIC)
- `covered_employees` (INTEGER)
- `created_at`, `updated_at` (TIMESTAMPTZ)

**Frontend Interface Issues:**
- Expects `provider` (string) instead of `provider_id`
- Expects `total_premium` instead of `premium`
- Expects `employees_count` instead of `covered_employees`
- Expects `created_date`, `updated_date` instead of `created_at`, `updated_at`

### 3. ClaimService Issues
**Database Schema:**
- `policy_id` (UUID, references policies table)
- `employee_id` (UUID, references employees table)
- `created_at`, `updated_at` (TIMESTAMPTZ)
- `resolved_date` (DATE, nullable)

**Frontend Interface Issues:**
- Tries to join `companies` directly instead of through `policies`
- Expects `created_date`, `updated_date` instead of `created_at`, `updated_at`
- Missing `resolved_date` field

## Required Fixes

### 1. Update Quote Interface
```typescript
export interface Quote {
  id: string;
  company_id: string;
  quote_number: string;
  product_type: string;
  provider_id: string;  // Changed from provider
  premium: number;
  status: 'draft' | 'pending' | 'sent' | 'accepted' | 'rejected' | 'expired';
  valid_until: string;
  employee_count: number;  // Changed from employees_count
  created_at: string;    // Changed from created_date
  updated_at: string;    // Changed from updated_date
  // Joined fields
  company_name?: string;
  provider_name?: string;
}
```

### 2. Update Policy Interface
```typescript
export interface Policy {
  id: string;
  company_id: string;
  policy_number: string;
  product_type: string;
  provider_id: string;     // Changed from provider
  premium: number;         // Changed from total_premium
  status: string;
  start_date: string;
  end_date: string;
  covered_employees: number; // Changed from employees_count
  created_at: string;      // Changed from created_date
  updated_at: string;      // Changed from updated_date
  // Joined fields
  company_name?: string;
  provider_name?: string;
}
```

### 3. Update Claim Interface
```typescript
export interface Claim {
  id: string;
  policy_id: string;       // Changed from company_id
  employee_id: string;
  claim_number: string;     // Changed from policy_number
  claim_type: string;
  amount: number;
  description: string;
  status: string;
  submitted_date: string;
  created_at: string;      // Changed from created_date
  updated_at: string;      // Changed from updated_date
  resolved_date?: string;   // Added missing field
  // Joined fields
  company_name?: string;
  employee_name?: string;
}
```

### 4. Update Service Methods
- Fix all joins to use proper relationships
- Add friendly error handling to all methods
- Fix field mappings in data transformations
- Update create/update methods to use correct field names

## Missing Service Files
- `employeeService.ts` - for employees table
- `providerService.ts` - for providers table  
- `commissionService.ts` - for commissions table
- `dealService.ts` - for deals table
- `renewalService.ts` - for renewals table

## Next Steps
1. Fix all interface definitions to match database schema
2. Update all service methods with proper error handling
3. Fix joins to use correct relationships
4. Create missing service files
5. Test all CRUD operations
6. Update frontend components to use new field names
