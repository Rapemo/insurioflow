import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatusBadge, getStatusType } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockDeals, formatCurrency, formatDate } from '@/data/mockData';
import { Deal } from '@/types/insurance';
import { cn } from '@/lib/utils';
import { Search, Filter, RefreshCw, Plus, MoreHorizontal, ArrowRight } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const stageConfig: Record<string, { label: string; color: string }> = {
  lead: { label: 'Lead', color: 'bg-muted' },
  qualified: { label: 'Qualified', color: 'bg-info' },
  quote: { label: 'Quote', color: 'bg-primary' },
  negotiation: { label: 'Negotiation', color: 'bg-warning' },
  closed_won: { label: 'Closed Won', color: 'bg-success' },
  closed_lost: { label: 'Closed Lost', color: 'bg-destructive' },
};

const stages = ['lead', 'qualified', 'quote', 'negotiation', 'closed_won'];

const Sales = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  const filteredDeals = mockDeals.filter(
    (deal) =>
      deal.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDealsByStage = (stage: string) =>
    filteredDeals.filter((deal) => deal.stage === stage);

  const totalPipelineValue = filteredDeals
    .filter((d) => !['closed_won', 'closed_lost'].includes(d.stage))
    .reduce((sum, deal) => sum + deal.value * (deal.probability / 100), 0);

  return (
    <AppLayout title="Sales Pipeline" subtitle="Track deals from HubSpot and manage opportunities">
      <div className="space-y-6 animate-fade-in">
        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="stat-card">
            <p className="text-sm text-muted-foreground">Total Deals</p>
            <p className="text-3xl font-bold text-foreground mt-1">{mockDeals.length}</p>
          </div>
          <div className="stat-card">
            <p className="text-sm text-muted-foreground">Weighted Pipeline</p>
            <p className="text-3xl font-bold text-foreground mt-1">
              {formatCurrency(totalPipelineValue)}
            </p>
          </div>
          <div className="stat-card">
            <p className="text-sm text-muted-foreground">Won This Month</p>
            <p className="text-3xl font-bold text-success mt-1">
              {mockDeals.filter((d) => d.stage === 'closed_won').length}
            </p>
          </div>
          <div className="stat-card">
            <p className="text-sm text-muted-foreground">Avg Deal Size</p>
            <p className="text-3xl font-bold text-foreground mt-1">
              {formatCurrency(
                mockDeals.reduce((sum, d) => sum + d.value, 0) / mockDeals.length
              )}
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search deals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync HubSpot
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Deal
            </Button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => {
            const stageDeals = getDealsByStage(stage);
            const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
            const config = stageConfig[stage];

            return (
              <div
                key={stage}
                className="flex-shrink-0 w-72 bg-secondary/30 rounded-xl p-4"
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={cn('w-3 h-3 rounded-full', config.color)} />
                    <span className="font-medium text-foreground">{config.label}</span>
                    <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      {stageDeals.length}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {formatCurrency(stageValue)}
                </p>

                {/* Deal Cards */}
                <div className="space-y-3">
                  {stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      className="bg-card rounded-lg border border-border p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {deal.companyName}
                          </p>
                          <p className="text-lg font-bold text-primary mt-1">
                            {formatCurrency(deal.value)}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Move Stage</DropdownMenuItem>
                            <DropdownMenuItem>Create Quote</DropdownMenuItem>
                            <DropdownMenuItem>View in HubSpot</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{deal.assignedTo}</span>
                        <span>{deal.probability}% prob</span>
                      </div>
                      <div className="mt-2">
                        <div className="h-1.5 rounded-full bg-muted">
                          <div
                            className="h-1.5 rounded-full bg-primary"
                            style={{ width: `${deal.probability}%` }}
                          />
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Close: {formatDate(deal.expectedCloseDate)}
                      </p>
                      {deal.hubspotDealId && (
                        <p className="mt-1 text-xs font-mono text-muted-foreground">
                          HS: {deal.hubspotDealId}
                        </p>
                      )}
                    </div>
                  ))}

                  {stageDeals.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No deals in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
};

export default Sales;
