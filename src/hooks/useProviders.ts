import { useQuery } from '@tanstack/react-query';
import { Provider } from '@/lib/api/types';

// Mock providers data for now - replace with real API when available
const mockProviders: Provider[] = [
  {
    id: 'provider-001',
    name: 'Global Insurance Co',
    type: 'insurer',
    country: 'US',
    api_enabled: true,
    status: 'active',
    contact_email: 'contact@globalins.com',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'provider-002',
    name: 'Secure Health Partners',
    type: 'insurer',
    country: 'US',
    api_enabled: true,
    status: 'active',
    contact_email: 'info@securehealth.com',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'provider-003',
    name: 'Premium Life Insurance',
    type: 'insurer',
    country: 'US',
    api_enabled: true,
    status: 'active',
    contact_email: 'quotes@premiumlife.com',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

export function useProviders() {
  return useQuery({
    queryKey: ['providers'],
    queryFn: async () => {
      // TODO: Replace with real API call when providers repository is implemented
      // const result = await api.providers.getAll();
      // return result.data || [];
      return mockProviders;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

export function useActiveProviders() {
  return useQuery({
    queryKey: ['providers', 'active'],
    queryFn: async () => {
      // TODO: Replace with real API call when providers repository is implemented
      // const result = await api.providers.getAll();
      // return result.data?.filter(provider => provider.status === 'active') || [];
      return mockProviders.filter(provider => provider.status === 'active');
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}
