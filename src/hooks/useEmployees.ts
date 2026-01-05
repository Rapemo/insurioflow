// React Query hook for Employees - uses the database-agnostic API layer
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, Employee, QueryOptions } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export const EMPLOYEES_QUERY_KEY = 'employees';

export function useEmployees(options?: QueryOptions) {
  return useQuery({
    queryKey: [EMPLOYEES_QUERY_KEY, options],
    queryFn: () => api.employees.getAll(options),
  });
}

export function useEmployee(id: string) {
  return useQuery({
    queryKey: [EMPLOYEES_QUERY_KEY, id],
    queryFn: () => api.employees.getById(id),
    enabled: !!id,
  });
}

export function useEmployeesByCompany(companyId: string, options?: QueryOptions) {
  return useQuery({
    queryKey: [EMPLOYEES_QUERY_KEY, 'company', companyId, options],
    queryFn: () => api.employees.getByCompanyId(companyId, options),
    enabled: !!companyId,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => 
      api.employees.create(data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: [EMPLOYEES_QUERY_KEY] });
        toast({ title: 'Employee created successfully' });
      } else {
        toast({ title: 'Error', description: response.error || 'Failed to create employee', variant: 'destructive' });
      }
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Employee> }) => 
      api.employees.update(id, data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: [EMPLOYEES_QUERY_KEY] });
        toast({ title: 'Employee updated successfully' });
      } else {
        toast({ title: 'Error', description: response.error || 'Failed to update employee', variant: 'destructive' });
      }
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => api.employees.delete(id),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: [EMPLOYEES_QUERY_KEY] });
        toast({ title: 'Employee deleted successfully' });
      } else {
        toast({ title: 'Error', description: response.error || 'Failed to delete employee', variant: 'destructive' });
      }
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
}
