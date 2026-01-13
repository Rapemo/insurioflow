import { Deal, QueryOptions, PaginatedResponse, ApiResponse } from '@/lib/api/types';
import { getFriendlyErrorMessage } from '@/utils/errorHandler';
import { supabase } from '@/integrations/supabase/client';

// Mock data for development - will be replaced with real database calls
const mockDeals: Deal[] = [
  {
    id: 'deal-001',
    company_id: '1',
    name: 'Acme Corporation Insurance Renewal',
    value: 2400000,
    stage: 'negotiation',
    probability: 75,
    expected_close_date: '2024-03-15',
    assigned_to: 'John Doe',
    owner: 'John Doe',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z'
  },
  {
    id: 'deal-002',
    company_id: '2',
    name: 'Global Industries Ltd Group Medical',
    value: 1800000,
    stage: 'quote',
    probability: 60,
    expected_close_date: '2024-02-28',
    assigned_to: 'Jane Smith',
    owner: 'Jane Smith',
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-25T10:00:00Z'
  },
  {
    id: 'deal-003',
    company_id: '3',
    name: 'Premier Services Group Life',
    value: 960000,
    stage: 'qualified',
    probability: 40,
    expected_close_date: '2024-02-10',
    assigned_to: 'Bob Johnson',
    owner: 'Bob Johnson',
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-18T10:00:00Z'
  },
  {
    id: 'deal-004',
    company_id: '4',
    name: 'East Africa Logistics Fleet Insurance',
    value: 3200000,
    stage: 'closed_won',
    probability: 100,
    expected_close_date: '2024-01-05',
    assigned_to: 'Alice Brown',
    owner: 'Alice Brown',
    created_at: '2024-01-05T10:00:00Z',
    updated_at: '2024-01-05T10:00:00Z'
  },
  {
    id: 'deal-005',
    company_id: '5',
    name: 'TechStart Hub Cyber Insurance',
    value: 150000,
    stage: 'closed_lost',
    probability: 0,
    expected_close_date: '2024-02-01',
    assigned_to: 'Charlie Wilson',
    owner: 'Charlie Wilson',
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z'
  }
];

// Real database deals service - connected to Supabase
export const dealService = {
  async getDeals(options: QueryOptions = {}): Promise<{ data: Deal[] | null; error: any }> {
    try {
      let query = supabase
        .from('deals')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (options.filters) {
        if (options.filters.stage) {
          query = query.eq('stage', options.filters.stage as string);
        }
        if (options.filters.company_id) {
          query = query.eq('company_id', options.filters.company_id as string);
        }
        if (options.filters.assigned_to) {
          const search = String(options.filters.assigned_to).toLowerCase();
          query = query.ilike('assigned_to', `%${search}%`);
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
        console.error('Error fetching deals:', error);
        return {
          data: null,
          error: getFriendlyErrorMessage(error)
        };
      }

      return {
        data: data as Deal[],
        error: null
      };
    } catch (error) {
      console.error('Unexpected error fetching deals:', error);
      return {
        data: null,
        error: 'Failed to fetch deals'
      };
    }
  },

  async getDealById(id: string): Promise<{ data: Deal | null; error: any }> {
    try {
      const deal = mockDeals.find(d => d.id === id);
      
      if (!deal) {
        return {
          data: null,
          error: 'Deal not found'
        };
      }

      return {
        data: deal,
        error: null
      };
    } catch (error) {
      console.error('Error fetching deal:', error);
      return {
        data: null,
        error: 'Failed to fetch deal'
      };
    }
  },

  async createDeal(dealData: Omit<Deal, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Deal | null; error: any }> {
    try {
      const now = new Date().toISOString();
      const newDeal: Deal = {
        ...dealData,
        id: `deal-${Date.now()}`,
        created_at: now,
        updated_at: now
      };

      const { data, error } = await supabase
        .from('deals')
        .insert([newDeal])
        .select()
        .single();

      if (error) {
        console.error('Error creating deal:', error);
        return {
          data: null,
          error: getFriendlyErrorMessage(error)
        };
      }

      return {
        data: data as Deal,
        error: null
      };
    } catch (error) {
      console.error('Unexpected error creating deal:', error);
      return {
        data: null,
        error: 'Failed to create deal'
      };
    }
  },

  async updateDealStage(id: string, stage: Deal['stage']): Promise<{ data: Deal | null; error: any }> {
    try {
      const { data: currentDeal, error: fetchError } = await supabase
        .from('deals')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Error fetching deal:', fetchError);
        return {
          data: null,
          error: getFriendlyErrorMessage(fetchError)
        };
      }

      if (!currentDeal) {
        return {
          data: null,
          error: 'Deal not found'
        };
      }

      const { data, error: updateError } = await supabase
        .from('deals')
        .update({
          stage,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating deal stage:', updateError);
        return {
          data: null,
          error: getFriendlyErrorMessage(updateError)
        };
      }

      return {
        data: data as Deal,
        error: null
      };
    } catch (error) {
      console.error('Unexpected error updating deal stage:', error);
      return {
        data: null,
        error: 'Failed to update deal stage'
      };
    }
  },

  async deleteDeal(id: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('deals')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting deal:', error);
        return {
          error: getFriendlyErrorMessage(error)
        };
      }

      return {
        error: null
      };
    } catch (error) {
      console.error('Unexpected error deleting deal:', error);
      return {
        error: 'Failed to delete deal'
      };
    }
  },

  // Helper functions for calculations
  getWeightedPipeline(deals: Deal[]): number {
    return deals.reduce((total, deal) => {
      if (deal.stage === 'closed_won') {
        return total + deal.value;
      } else if (deal.stage === 'closed_lost') {
        return total;
      } else {
        return total + (deal.value * deal.probability / 100);
      }
    }, 0);
  },

  getDealsByStage(deals: Deal[]): Record<string, Deal[]> {
    const stages = ['lead', 'qualified', 'quote', 'negotiation', 'closed_won', 'closed_lost'] as const;
    
    return stages.reduce((acc, stage) => {
      acc[stage] = deals.filter(deal => deal.stage === stage);
      return acc;
    }, {} as Record<string, Deal[]>);
  }
};
