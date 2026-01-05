// React Query hook for Policies - uses the database-agnostic API layer
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, Policy, QueryOptions } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export const POLICIES_QUERY_KEY = 'policies';

export function usePolicies(options?: QueryOptions) {
  return useQuery({
    queryKey: [POLICIES_QUERY_KEY, options],
    queryFn: () => api.policies.getAll(options),
  });
}

export function usePolicy(id: string) {
  return useQuery({
    queryKey: [POLICIES_QUERY_KEY, id],
    queryFn: () => api.policies.getById(id),
    enabled: !!id,
  });
}

export function usePoliciesByCompany(companyId: string, options?: QueryOptions) {
  return useQuery({
    queryKey: [POLICIES_QUERY_KEY, 'company', companyId, options],
    queryFn: () => api.policies.getByCompanyId(companyId, options),
    enabled: !!companyId,
  });
}

export function useCreatePolicy() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: Omit<Policy, 'id' | 'created_at' | 'updated_at'>) => 
      api.policies.create(data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: [POLICIES_QUERY_KEY] });
        toast({ title: 'Policy created successfully' });
      } else {
        toast({ title: 'Error', description: response.error || 'Failed to create policy', variant: 'destructive' });
      }
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdatePolicy() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Policy> }) => 
      api.policies.update(id, data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: [POLICIES_QUERY_KEY] });
        toast({ title: 'Policy updated successfully' });
      } else {
        toast({ title: 'Error', description: response.error || 'Failed to update policy', variant: 'destructive' });
      }
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeletePolicy() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => api.policies.delete(id),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: [POLICIES_QUERY_KEY] });
        toast({ title: 'Policy deleted successfully' });
      } else {
        toast({ title: 'Error', description: response.error || 'Failed to delete policy', variant: 'destructive' });
      }
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
}
