// React Query hook for Claims - uses the database-agnostic API layer
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, Claim, QueryOptions } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export const CLAIMS_QUERY_KEY = 'claims';

export function useClaims(options?: QueryOptions) {
  return useQuery({
    queryKey: [CLAIMS_QUERY_KEY, options],
    queryFn: () => api.claims.getAll(options),
  });
}

export function useClaim(id: string) {
  return useQuery({
    queryKey: [CLAIMS_QUERY_KEY, id],
    queryFn: () => api.claims.getById(id),
    enabled: !!id,
  });
}

export function useClaimsByPolicy(policyId: string, options?: QueryOptions) {
  return useQuery({
    queryKey: [CLAIMS_QUERY_KEY, 'policy', policyId, options],
    queryFn: () => api.claims.getByPolicyId(policyId, options),
    enabled: !!policyId,
  });
}

export function useCreateClaim() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: Omit<Claim, 'id' | 'created_at' | 'updated_at'>) => 
      api.claims.create(data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: [CLAIMS_QUERY_KEY] });
        toast({ title: 'Claim submitted successfully' });
      } else {
        toast({ title: 'Error', description: response.error || 'Failed to submit claim', variant: 'destructive' });
      }
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateClaim() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Claim> }) => 
      api.claims.update(id, data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: [CLAIMS_QUERY_KEY] });
        toast({ title: 'Claim updated successfully' });
      } else {
        toast({ title: 'Error', description: response.error || 'Failed to update claim', variant: 'destructive' });
      }
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeleteClaim() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => api.claims.delete(id),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: [CLAIMS_QUERY_KEY] });
        toast({ title: 'Claim deleted successfully' });
      } else {
        toast({ title: 'Error', description: response.error || 'Failed to delete claim', variant: 'destructive' });
      }
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
}
