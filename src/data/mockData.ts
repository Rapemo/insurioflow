import { 
  Company, Employee, Quote, Policy, Claim, Commission, Deal, Renewal, Provider, DashboardStats 
} from '@/types/insurance';

export const mockStats: DashboardStats = {
  totalPolicies: 284,
  activePolicies: 256,
  totalPremium: 4825000,
  pendingClaims: 43,
  upcomingRenewals: 28,
  openDeals: 67,
  monthlyCommission: 142500,
  lossRatio: 62.4,
};

export const mockCompanies: Company[] = [
  { id: '1', name: 'Acme Corporation', industry: 'Technology', employeeCount: 450, country: 'Kenya', workpayId: 'WP-001', hubspotId: 'HS-001', status: 'active', createdAt: '2024-01-15' },
  { id: '2', name: 'Global Industries Ltd', industry: 'Manufacturing', employeeCount: 1200, country: 'Nigeria', workpayId: 'WP-002', hubspotId: 'HS-002', status: 'active', createdAt: '2024-02-20' },
  { id: '3', name: 'Premier Services', industry: 'Financial Services', employeeCount: 320, country: 'Kenya', workpayId: 'WP-003', status: 'pending', createdAt: '2024-03-10' },
  { id: '4', name: 'East Africa Logistics', industry: 'Logistics', employeeCount: 890, country: 'Tanzania', workpayId: 'WP-004', hubspotId: 'HS-004', status: 'active', createdAt: '2024-01-28' },
  { id: '5', name: 'TechStart Hub', industry: 'Technology', employeeCount: 75, country: 'Rwanda', workpayId: 'WP-005', status: 'active', createdAt: '2024-04-05' },
];

export const mockEmployees: Employee[] = [
  { id: '1', companyId: '1', firstName: 'John', lastName: 'Kamau', email: 'john.kamau@acme.co', dateOfBirth: '1985-03-15', salary: 150000, department: 'Engineering', jobTitle: 'Senior Developer', hireDate: '2020-06-01', status: 'active', dependents: 3 },
  { id: '2', companyId: '1', firstName: 'Sarah', lastName: 'Okonkwo', email: 'sarah.o@acme.co', dateOfBirth: '1990-07-22', salary: 120000, department: 'Marketing', jobTitle: 'Marketing Manager', hireDate: '2021-02-15', status: 'active', dependents: 2 },
  { id: '3', companyId: '1', firstName: 'Michael', lastName: 'Njoroge', email: 'm.njoroge@acme.co', dateOfBirth: '1988-11-08', salary: 180000, department: 'Finance', jobTitle: 'CFO', hireDate: '2019-01-10', status: 'active', dependents: 4 },
  { id: '4', companyId: '2', firstName: 'Grace', lastName: 'Achieng', email: 'grace@global.co', dateOfBirth: '1992-05-30', salary: 95000, department: 'Operations', jobTitle: 'Operations Lead', hireDate: '2022-03-01', status: 'active', dependents: 1 },
  { id: '5', companyId: '2', firstName: 'David', lastName: 'Mwangi', email: 'david@global.co', dateOfBirth: '1987-09-12', salary: 110000, department: 'HR', jobTitle: 'HR Director', hireDate: '2020-08-15', status: 'active', dependents: 2 },
];

export const mockQuotes: Quote[] = [
  { id: 'Q-001', companyId: '1', companyName: 'Acme Corporation', productType: 'Group Medical', provider: 'AAR Insurance', premium: 2400000, employeesCount: 450, status: 'approved', validUntil: '2024-12-31', createdAt: '2024-11-01', benefits: [] },
  { id: 'Q-002', companyId: '2', companyName: 'Global Industries Ltd', productType: 'Group Life', provider: 'Jubilee Insurance', premium: 1800000, employeesCount: 1200, status: 'pending', validUntil: '2024-12-15', createdAt: '2024-11-10', benefits: [] },
  { id: 'Q-003', companyId: '3', companyName: 'Premier Services', productType: 'Group Medical', provider: 'Britam', premium: 960000, employeesCount: 320, status: 'draft', validUntil: '2024-12-20', createdAt: '2024-11-15', benefits: [] },
  { id: 'Q-004', companyId: '4', companyName: 'East Africa Logistics', productType: 'Group Medical + Life', provider: 'CIC Insurance', premium: 3200000, employeesCount: 890, status: 'approved', validUntil: '2024-12-25', createdAt: '2024-11-05', benefits: [] },
  { id: 'Q-005', companyId: '5', companyName: 'TechStart Hub', productType: 'Group Medical', provider: 'Resolution Insurance', premium: 225000, employeesCount: 75, status: 'pending', validUntil: '2024-12-30', createdAt: '2024-11-18', benefits: [] },
];

export const mockPolicies: Policy[] = [
  { id: 'P-001', companyId: '1', companyName: 'Acme Corporation', quoteId: 'Q-001', provider: 'AAR Insurance', policyNumber: 'AAR-2024-00145', productType: 'Group Medical', status: 'active', startDate: '2024-01-01', endDate: '2024-12-31', totalPremium: 2400000, employeesCount: 450, documents: [] },
  { id: 'P-002', companyId: '2', companyName: 'Global Industries Ltd', quoteId: 'Q-002', provider: 'Jubilee Insurance', policyNumber: 'JUB-2024-00089', productType: 'Group Life', status: 'active', startDate: '2024-02-01', endDate: '2025-01-31', totalPremium: 1800000, employeesCount: 1200, documents: [] },
  { id: 'P-003', companyId: '4', companyName: 'East Africa Logistics', quoteId: 'Q-004', provider: 'CIC Insurance', policyNumber: 'CIC-2024-00234', productType: 'Group Medical + Life', status: 'active', startDate: '2024-03-01', endDate: '2025-02-28', totalPremium: 3200000, employeesCount: 890, documents: [] },
  { id: 'P-004', companyId: '5', companyName: 'TechStart Hub', quoteId: 'Q-005', provider: 'Resolution Insurance', policyNumber: 'RES-2024-00067', productType: 'Group Medical', status: 'pending_approval', startDate: '2024-12-01', endDate: '2025-11-30', totalPremium: 225000, employeesCount: 75, documents: [] },
];

export const mockClaims: Claim[] = [
  { id: 'CLM-001', policyId: 'P-001', policyNumber: 'AAR-2024-00145', companyName: 'Acme Corporation', employeeName: 'John Kamau', claimType: 'Inpatient', amount: 245000, status: 'under_review', submittedDate: '2024-11-15', description: 'Hospital admission for appendectomy', documents: [] },
  { id: 'CLM-002', policyId: 'P-001', policyNumber: 'AAR-2024-00145', companyName: 'Acme Corporation', employeeName: 'Sarah Okonkwo', claimType: 'Outpatient', amount: 15000, status: 'approved', submittedDate: '2024-11-10', description: 'General consultation and medication', documents: [] },
  { id: 'CLM-003', policyId: 'P-002', policyNumber: 'JUB-2024-00089', companyName: 'Global Industries Ltd', employeeName: 'Grace Achieng', claimType: 'Maternity', amount: 180000, status: 'paid', submittedDate: '2024-10-28', description: 'Maternity benefit claim', documents: [] },
  { id: 'CLM-004', policyId: 'P-003', policyNumber: 'CIC-2024-00234', companyName: 'East Africa Logistics', employeeName: 'Peter Oduya', claimType: 'Inpatient', amount: 520000, status: 'submitted', submittedDate: '2024-11-20', description: 'Emergency surgery', documents: [] },
  { id: 'CLM-005', policyId: 'P-001', policyNumber: 'AAR-2024-00145', companyName: 'Acme Corporation', employeeName: 'Michael Njoroge', claimType: 'Dental', amount: 35000, status: 'rejected', submittedDate: '2024-11-05', description: 'Dental procedure - not covered', documents: [] },
];

export const mockCommissions: Commission[] = [
  { id: 'COM-001', dealId: 'D-001', companyName: 'Acme Corporation', salesRep: 'James Mutua', premium: 2400000, commissionRate: 5, commissionAmount: 120000, status: 'paid', payoutDate: '2024-02-15' },
  { id: 'COM-002', dealId: 'D-002', companyName: 'Global Industries Ltd', broker: 'Alpha Brokers', salesRep: 'Jane Wanjiku', premium: 1800000, commissionRate: 4.5, commissionAmount: 81000, status: 'approved', payoutDate: '2024-03-01' },
  { id: 'COM-003', dealId: 'D-003', companyName: 'East Africa Logistics', salesRep: 'James Mutua', premium: 3200000, commissionRate: 5, commissionAmount: 160000, status: 'pending' },
  { id: 'COM-004', dealId: 'D-004', companyName: 'TechStart Hub', broker: 'Beta Insurance Brokers', salesRep: 'Peter Otieno', premium: 225000, commissionRate: 6, commissionAmount: 13500, status: 'calculated' },
];

export const mockDeals: Deal[] = [
  { id: 'D-001', companyId: '1', companyName: 'Acme Corporation', hubspotDealId: 'HS-D-001', stage: 'closed_won', value: 2400000, probability: 100, assignedTo: 'James Mutua', createdAt: '2024-01-05', expectedCloseDate: '2024-01-30' },
  { id: 'D-002', companyId: '2', companyName: 'Global Industries Ltd', hubspotDealId: 'HS-D-002', stage: 'closed_won', value: 1800000, probability: 100, assignedTo: 'Jane Wanjiku', createdAt: '2024-02-10', expectedCloseDate: '2024-02-28' },
  { id: 'D-003', companyId: '3', companyName: 'Premier Services', hubspotDealId: 'HS-D-003', stage: 'quote', value: 960000, probability: 60, assignedTo: 'James Mutua', createdAt: '2024-11-01', expectedCloseDate: '2024-12-15' },
  { id: 'D-004', companyId: '5', companyName: 'TechStart Hub', stage: 'negotiation', value: 225000, probability: 75, assignedTo: 'Peter Otieno', createdAt: '2024-10-20', expectedCloseDate: '2024-12-01' },
  { id: 'D-005', companyId: '4', companyName: 'East Africa Logistics', hubspotDealId: 'HS-D-005', stage: 'qualified', value: 3500000, probability: 40, assignedTo: 'Jane Wanjiku', createdAt: '2024-11-15', expectedCloseDate: '2025-01-31' },
];

export const mockRenewals: Renewal[] = [
  { id: 'R-001', policyId: 'P-001', policyNumber: 'AAR-2024-00145', companyName: 'Acme Corporation', currentPremium: 2400000, renewalPremium: 2640000, status: 'quoted', renewalDate: '2024-12-31', daysUntilRenewal: 33 },
  { id: 'R-002', policyId: 'P-002', policyNumber: 'JUB-2024-00089', companyName: 'Global Industries Ltd', currentPremium: 1800000, status: 'upcoming', renewalDate: '2025-01-31', daysUntilRenewal: 64 },
  { id: 'R-003', policyId: 'P-003', policyNumber: 'CIC-2024-00234', companyName: 'East Africa Logistics', currentPremium: 3200000, status: 'in_progress', renewalDate: '2025-02-28', daysUntilRenewal: 92 },
];

export const mockProviders: Provider[] = [
  { id: 'PR-001', name: 'AAR Insurance', type: 'insurer', country: 'Kenya', products: ['Group Medical', 'Individual Medical'], apiEnabled: true, status: 'active' },
  { id: 'PR-002', name: 'Jubilee Insurance', type: 'insurer', country: 'Kenya', products: ['Group Life', 'Group Medical', 'Pension'], apiEnabled: true, status: 'active' },
  { id: 'PR-003', name: 'Britam', type: 'insurer', country: 'Kenya', products: ['Group Medical', 'Group Life', 'Motor'], apiEnabled: false, status: 'active' },
  { id: 'PR-004', name: 'CIC Insurance', type: 'insurer', country: 'Kenya', products: ['Group Medical', 'Group Life', 'Agriculture'], apiEnabled: true, status: 'active' },
  { id: 'PR-005', name: 'Alpha Brokers', type: 'broker', country: 'Kenya', products: ['All Lines'], apiEnabled: false, status: 'active' },
  { id: 'PR-006', name: 'Beta Insurance Brokers', type: 'broker', country: 'Tanzania', products: ['Group Benefits'], apiEnabled: false, status: 'active' },
];

export const formatCurrency = (amount: number, currency: string = 'KES') => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};
