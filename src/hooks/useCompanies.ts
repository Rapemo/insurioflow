// React Query hook for Companies - uses the database-agnostic API layer
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, Company, QueryOptions } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export const COMPANIES_QUERY_KEY = 'companies';

export function useCompanies(options?: QueryOptions) {
  return useQuery({
    queryKey: [COMPANIES_QUERY_KEY, options],
    queryFn: () => api.companies.getAll(options),
  });
}

export function useCompany(id: string) {
  return useQuery({
    queryKey: [COMPANIES_QUERY_KEY, id],
    queryFn: () => api.companies.getById(id),
    enabled: !!id,
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: Omit<Company, 'id' | 'created_at' | 'updated_at'>) => 
      api.companies.create(data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: [COMPANIES_QUERY_KEY] });
        toast({ title: 'Company created successfully' });
      } else {
        toast({ title: 'Error', description: response.error || 'Failed to create company', variant: 'destructive' });
      }
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Company> }) => 
      api.companies.update(id, data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: [COMPANIES_QUERY_KEY] });
        toast({ title: 'Company updated successfully' });
      } else {
        toast({ title: 'Error', description: response.error || 'Failed to update company', variant: 'destructive' });
      }
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeleteCompany() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => api.companies.delete(id),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: [COMPANIES_QUERY_KEY] });
        toast({ title: 'Company deleted successfully' });
      } else {
        toast({ title: 'Error', description: response.error || 'Failed to delete company', variant: 'destructive' });
      }
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
}
