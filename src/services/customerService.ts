import { Customer, CustomerInteraction, ICustomerRepository, ICustomerInteractionRepository, QueryOptions, PaginatedResponse, ApiResponse } from '@/lib/api/types';
import { getFriendlyErrorMessage } from '@/utils/errorHandler';
import { supabase } from '@/integrations/supabase/client';

// Export types for use in other files
export type { Customer, CustomerInteraction };

// Real database customers service - connected to Supabase
export const customerService = {
  async getCustomers(options: QueryOptions = {}): Promise<{ data: Customer[] | null; error: any }> {
    try {
      let query = supabase
        .from('customers')
        .select(`
          *,
          companies(name)
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (options.filters) {
        if (options.filters.company_id) {
          query = query.eq('company_id', options.filters.company_id as string);
        }
        if (options.filters.is_primary !== undefined) {
          query = query.eq('is_primary', options.filters.is_primary);
        }
        if (options.filters.search) {
          const search = String(options.filters.search).toLowerCase();
          query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,companies.name.ilike.%${search}%`);
        }
      }

      // Apply pagination
      if (options.page && options.pageSize) {
        const from = (options.page - 1) * options.pageSize;
        const to = from + options.pageSize - 1;
        query = query.range(from, to);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching customers:', error);
        return {
          data: null,
          error: getFriendlyErrorMessage(error)
        };
      }

      // Transform data to handle company name properly
      const transformedData = (data || []).map((customer: any) => ({
        ...customer,
        company_name: customer.companies?.name || null
      }));

      return {
        data: transformedData as Customer[],
        error: null
      };
    } catch (error) {
      console.error('Error fetching customers:', error);
      return {
        data: null,
        error: 'Failed to fetch customers'
      };
    }
  },

  async getCustomerById(id: string): Promise<{ data: Customer | null; error: any }> {
    try {
      const customer = mockCustomers.find(c => c.id === id);
      
      if (!customer) {
        return {
          data: null,
          error: 'Customer not found'
        };
      }

      return {
        data: customer,
        error: null
      };
    } catch (error) {
      console.error('Error fetching customer:', error);
      return {
        data: null,
        error: 'Failed to fetch customer'
      };
    }
  },

  async getCustomersByCompany(companyId: string, options: QueryOptions = {}): Promise<{ data: Customer[] | null; error: any }> {
    try {
      const companyCustomers = mockCustomers.filter(customer => customer.company_id === companyId);
      
      // Apply additional filters
      let filteredCustomers = companyCustomers;
      
      if (options.filters) {
        if (options.filters.is_primary !== undefined) {
          filteredCustomers = filteredCustomers.filter(customer => customer.is_primary === options.filters.is_primary);
        }
        if (options.filters.search) {
          const search = options.filters.search.toLowerCase();
          filteredCustomers = filteredCustomers.filter(customer => 
            customer.first_name.toLowerCase().includes(search) ||
            customer.last_name.toLowerCase().includes(search) ||
            customer.email.toLowerCase().includes(search)
          );
        }
      }

      return {
        data: filteredCustomers,
        error: null
      };
    } catch (error) {
      console.error('Error fetching company customers:', error);
      return {
        data: null,
        error: 'Failed to fetch company customers'
      };
    }
  },

  async createCustomer(customerData: Omit<Customer, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Customer | null; error: any }> {
    try {
      const now = new Date().toISOString();
      const newCustomer: Customer = {
        ...customerData,
        id: `cust-${Date.now()}`,
        created_at: now,
        updated_at: now
      };

      const { data, error } = await supabase
        .from('customers')
        .insert([newCustomer])
        .select()
        .single();

      if (error) {
        console.error('Error creating customer:', error);
        return {
          data: null,
          error: getFriendlyErrorMessage(error)
        };
      }

      return {
        data: data as Customer,
        error: null
      };
    } catch (error) {
      console.error('Unexpected error creating customer:', error);
      return {
        data: null,
        error: 'Failed to create customer'
      };
    }
  },

  async updateCustomer(id: string, customerData: Partial<Customer>): Promise<{ data: Customer | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .update({
          ...customerData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating customer:', error);
        return {
          data: null,
          error: getFriendlyErrorMessage(error)
        };
      }

      return {
        data: data as Customer,
        error: null
      };
    } catch (error) {
      console.error('Unexpected error updating customer:', error);
      return {
        data: null,
        error: 'Failed to update customer'
      };
    }
  },

  async deleteCustomer(id: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting customer:', error);
        return {
          error: getFriendlyErrorMessage(error)
        };
      }

      return {
        error: null
      };
    } catch (error) {
      console.error('Unexpected error deleting customer:', error);
      return {
        error: 'Failed to delete customer'
      };
    }
  },

  // Customer interactions
  async getCustomerInteractions(options: QueryOptions = {}): Promise<{ data: CustomerInteraction[] | null; error: any }> {
    try {
      // Mock interactions data
      const mockInteractions: CustomerInteraction[] = [
        {
          id: 'int-001',
          customer_id: 'cust-001',
          type: 'call',
          subject: 'Initial consultation call',
          description: 'Discussed insurance requirements and company needs',
          outcome: 'Positive - scheduled follow-up meeting',
          next_action: 'Send quote proposal',
          scheduled_date: '2024-01-25T10:00:00Z',
          completed_date: '2024-01-20T14:30:00Z',
          assigned_to: 'John Doe',
          created_by: 'user-001',
          created_at: '2024-01-20T10:00:00Z',
          updated_at: '2024-01-20T10:00:00Z',
          customer_name: 'John Anderson',
          created_by_name: 'John Doe'
        },
        {
          id: 'int-002',
          customer_id: 'cust-002',
          type: 'meeting',
          subject: 'Quote presentation meeting',
          description: 'Presented group medical insurance options',
          outcome: 'Under consideration',
          next_action: 'Follow up next week',
          scheduled_date: '2024-01-18T15:00:00Z',
          completed_date: '2024-01-18T16:30:00Z',
          assigned_to: 'Jane Smith',
          created_by: 'user-002',
          created_at: '2024-01-18T10:00:00Z',
          updated_at: '2024-01-18T10:00:00Z',
          customer_name: 'Sarah Johnson',
          created_by_name: 'Jane Smith'
        }
      ];

      // Apply filters
      let filteredInteractions = mockInteractions;
      
      if (options.filters) {
        if (options.filters.customer_id) {
          filteredInteractions = filteredInteractions.filter(interaction => interaction.customer_id === options.filters.customer_id);
        }
        if (options.filters.type) {
          filteredInteractions = filteredInteractions.filter(interaction => interaction.type === options.filters.type);
        }
        if (options.filters.assigned_to) {
          filteredInteractions = filteredInteractions.filter(interaction => 
            interaction.assigned_to && interaction.assigned_to.toLowerCase().includes(options.filters.assigned_to.toLowerCase())
          );
        }
      }

      // Sort by created_at descending
      filteredInteractions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      return {
        data: filteredInteractions,
        error: null
      };
    } catch (error) {
      console.error('Error fetching customer interactions:', error);
      return {
        data: null,
        error: 'Failed to fetch customer interactions'
      };
    }
  },

  async createCustomerInteraction(interactionData: Omit<CustomerInteraction, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: CustomerInteraction | null; error: any }> {
    try {
      const now = new Date().toISOString();
      const newInteraction: CustomerInteraction = {
        ...interactionData,
        id: `int-${Date.now()}`,
        created_at: now,
        updated_at: now
      };

      const { data, error } = await supabase
        .from('customer_interactions')
        .insert([newInteraction])
        .select()
        .single();

      if (error) {
        console.error('Error creating customer interaction:', error);
        return {
          data: null,
          error: getFriendlyErrorMessage(error)
        };
      }

      return {
        data: data as CustomerInteraction,
        error: null
      };
    } catch (error) {
      console.error('Unexpected error creating customer interaction:', error);
      return {
        data: null,
        error: 'Failed to create customer interaction'
      };
    }
  }
};
