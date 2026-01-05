// React Query hook for Quotes - uses the database-agnostic API layer
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, Quote, QueryOptions } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export const QUOTES_QUERY_KEY = 'quotes';

export function useQuotes(options?: QueryOptions) {
  return useQuery({
    queryKey: [QUOTES_QUERY_KEY, options],
    queryFn: () => api.quotes.getAll(options),
  });
}

export function useQuote(id: string) {
  return useQuery({
    queryKey: [QUOTES_QUERY_KEY, id],
    queryFn: () => api.quotes.getById(id),
    enabled: !!id,
  });
}

export function useQuotesByCompany(companyId: string, options?: QueryOptions) {
  return useQuery({
    queryKey: [QUOTES_QUERY_KEY, 'company', companyId, options],
    queryFn: () => api.quotes.getByCompanyId(companyId, options),
    enabled: !!companyId,
  });
}

export function useCreateQuote() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: Omit<Quote, 'id' | 'created_at' | 'updated_at'>) => 
      api.quotes.create(data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: [QUOTES_QUERY_KEY] });
        toast({ title: 'Quote created successfully' });
      } else {
        toast({ title: 'Error', description: response.error || 'Failed to create quote', variant: 'destructive' });
      }
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateQuote() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Quote> }) => 
      api.quotes.update(id, data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: [QUOTES_QUERY_KEY] });
        toast({ title: 'Quote updated successfully' });
      } else {
        toast({ title: 'Error', description: response.error || 'Failed to update quote', variant: 'destructive' });
      }
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeleteQuote() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => api.quotes.delete(id),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: [QUOTES_QUERY_KEY] });
        toast({ title: 'Quote deleted successfully' });
      } else {
        toast({ title: 'Error', description: response.error || 'Failed to delete quote', variant: 'destructive' });
      }
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
}
