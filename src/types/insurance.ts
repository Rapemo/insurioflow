// Core Entity Types for Insurance Platform

export type UserRole = 'sales' | 'ops' | 'hr_admin' | 'insurer' | 'broker' | 'finance' | 'leadership';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  company?: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  employeeCount: number;
  country: string;
  workpayId?: string;
  hubspotId?: string;
  status: 'active' | 'pending' | 'inactive';
  createdAt: string;
}

export interface Employee {
  id: string;
  companyId: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  salary: number;
  department: string;
  jobTitle: string;
  hireDate: string;
  status: 'active' | 'terminated' | 'on_leave';
  dependents: number;
}

export interface Quote {
  id: string;
  companyId: string;
  companyName: string;
  productType: string;
  provider: string;
  premium: number;
  employeesCount: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'expired';
  validUntil: string;
  createdAt: string;
  benefits: BenefitConfig[];
}

export interface BenefitConfig {
  id: string;
  name: string;
  type: 'medical' | 'dental' | 'vision' | 'life' | 'disability' | 'wellness';
  coverageLevel: string;
  premium: number;
  deductible?: number;
}

export interface Policy {
  id: string;
  companyId: string;
  companyName: string;
  quoteId: string;
  provider: string;
  policyNumber: string;
  productType: string;
  status: 'pending_approval' | 'active' | 'expired' | 'cancelled';
  startDate: string;
  endDate: string;
  totalPremium: number;
  employeesCount: number;
  documents: Document[];
}

export interface Claim {
  id: string;
  policyId: string;
  policyNumber: string;
  companyName: string;
  employeeName: string;
  claimType: string;
  amount: number;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'paid';
  submittedDate: string;
  description: string;
  documents: Document[];
}

export interface Commission {
  id: string;
  dealId: string;
  companyName: string;
  broker?: string;
  salesRep: string;
  premium: number;
  commissionRate: number;
  commissionAmount: number;
  status: 'pending' | 'calculated' | 'approved' | 'paid';
  payoutDate?: string;
}

export interface Deal {
  id: string;
  companyId: string;
  companyName: string;
  hubspotDealId?: string;
  stage: 'lead' | 'qualified' | 'quote' | 'negotiation' | 'closed_won' | 'closed_lost';
  value: number;
  probability: number;
  assignedTo: string;
  createdAt: string;
  expectedCloseDate: string;
}

export interface Renewal {
  id: string;
  policyId: string;
  policyNumber: string;
  companyName: string;
  currentPremium: number;
  renewalPremium?: number;
  status: 'upcoming' | 'in_progress' | 'quoted' | 'renewed' | 'lapsed';
  renewalDate: string;
  daysUntilRenewal: number;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface Provider {
  id: string;
  name: string;
  type: 'insurer' | 'broker';
  country: string;
  products: string[];
  apiEnabled: boolean;
  status: 'active' | 'inactive';
}

export interface DashboardStats {
  totalPolicies: number;
  activePolicies: number;
  totalPremium: number;
  pendingClaims: number;
  upcomingRenewals: number;
  openDeals: number;
  monthlyCommission: number;
  lossRatio: number;
}
