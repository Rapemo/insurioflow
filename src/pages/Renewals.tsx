import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge, getStatusType } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockRenewals, formatCurrency, formatDate } from '@/data/mockData';
import { Renewal } from '@/types/insurance';
import { cn } from '@/lib/utils';
import { Search, Filter, Download, RefreshCw, Bell, AlertCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const statusLabels: Record<string, string> = {
  upcoming: 'Upcoming',
  in_progress: 'In Progress',
  quoted: 'Quoted',
  renewed: 'Renewed',
  lapsed: 'Lapsed',
};

const columns = [
  {
    key: 'policyNumber',
    header: 'Policy Number',
    render: (renewal: Renewal) => (
      <span className="font-mono text-sm font-medium text-primary">{renewal.policyNumber}</span>
    ),
  },
  {
    key: 'companyName',
    header: 'Company',
  },
  {
    key: 'currentPremium',
    header: 'Current Premium',
    render: (renewal: Renewal) => (
      <span className="font-medium">{formatCurrency(renewal.currentPremium)}</span>
    ),
  },
  {
    key: 'renewalPremium',
    header: 'Renewal Premium',
    render: (renewal: Renewal) => (
      <span className="font-medium">
        {renewal.renewalPremium ? formatCurrency(renewal.renewalPremium) : '—'}
      </span>
    ),
  },
  {
    key: 'renewalDate',
    header: 'Renewal Date',
    render: (renewal: Renewal) => (
      <span className="text-muted-foreground">{formatDate(renewal.renewalDate)}</span>
    ),
  },
  {
    key: 'daysUntilRenewal',
    header: 'Days Left',
    render: (renewal: Renewal) => (
      <span
        className={cn(
          'font-semibold',
          renewal.daysUntilRenewal <= 30 ? 'text-destructive' : 
          renewal.daysUntilRenewal <= 60 ? 'text-warning' : 'text-foreground'
        )}
      >
        {renewal.daysUntilRenewal} days
      </span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (renewal: Renewal) => (
      <StatusBadge
        status={getStatusType(renewal.status)}
        label={statusLabels[renewal.status]}
      />
    ),
  },
  {
    key: 'actions',
    header: '',
    render: (renewal: Renewal) => (
      <Button variant="outline" size="sm">
        {renewal.status === 'upcoming' ? 'Start Renewal' : 'View'}
      </Button>
    ),
  },
];

const Renewals = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredRenewals = mockRenewals.filter((renewal) => {
    const matchesSearch = renewal.companyName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || renewal.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const urgentRenewals = mockRenewals.filter((r) => r.daysUntilRenewal <= 30);

  return (
    <AppLayout title="Renewals" subtitle="Track and manage policy renewals">
      <div className="space-y-6 animate-fade-in">
        {/* Alert Banner */}
        {urgentRenewals.length > 0 && (
          <div className="p-4 rounded-xl bg-warning/10 border border-warning/20">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-warning shrink-0" />
              <div>
                <p className="font-medium text-foreground">
                  {urgentRenewals.length} renewals due within 30 days
                </p>
                <p className="text-sm text-muted-foreground">
                  Action required to prevent policy lapses
                </p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">
                View Urgent
              </Button>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="stat-card">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3">
                <RefreshCw className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{mockRenewals.length}</p>
                <p className="text-sm text-muted-foreground">Total Renewals</p>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-destructive/10 p-3">
                <Bell className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{urgentRenewals.length}</p>
                <p className="text-sm text-muted-foreground">Due in 30 Days</p>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-success/10 p-3">
                <RefreshCw className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockRenewals.filter((r) => r.status === 'quoted').length}
                </p>
                <p className="text-sm text-muted-foreground">Quoted</p>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(
                  mockRenewals.reduce((sum, r) => sum + r.currentPremium, 0)
                )}
              </p>
              <p className="text-sm text-muted-foreground">Premium at Risk</p>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search renewals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="quoted">Quoted</SelectItem>
                <SelectItem value="renewed">Renewed</SelectItem>
                <SelectItem value="lapsed">Lapsed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <DataTable
            data={filteredRenewals}
            columns={columns}
            onRowClick={(renewal) => console.log('View renewal:', renewal.id)}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default Renewals;
