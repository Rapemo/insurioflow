import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge, getStatusType } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockPolicies, formatCurrency, formatDate } from '@/data/mockData';
import { Policy } from '@/types/insurance';
import { Search, Filter, Download, FileCheck, Eye, MoreHorizontal } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const statusLabels: Record<string, string> = {
  pending_approval: 'Pending Approval',
  active: 'Active',
  expired: 'Expired',
  cancelled: 'Cancelled',
};

const columns = [
  {
    key: 'policyNumber',
    header: 'Policy Number',
    render: (policy: Policy) => (
      <span className="font-mono text-sm font-medium text-primary">{policy.policyNumber}</span>
    ),
  },
  {
    key: 'companyName',
    header: 'Company',
    render: (policy: Policy) => (
      <div>
        <p className="font-medium text-foreground">{policy.companyName}</p>
        <p className="text-xs text-muted-foreground">{policy.employeesCount} employees</p>
      </div>
    ),
  },
  {
    key: 'productType',
    header: 'Product',
    render: (policy: Policy) => (
      <span className="inline-flex items-center px-2 py-1 rounded-md bg-secondary text-xs font-medium">
        {policy.productType}
      </span>
    ),
  },
  {
    key: 'provider',
    header: 'Provider',
  },
  {
    key: 'totalPremium',
    header: 'Premium',
    render: (policy: Policy) => (
      <span className="font-semibold">{formatCurrency(policy.totalPremium)}</span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (policy: Policy) => (
      <StatusBadge
        status={getStatusType(policy.status)}
        label={statusLabels[policy.status]}
      />
    ),
  },
  {
    key: 'endDate',
    header: 'Expiry',
    render: (policy: Policy) => (
      <span className="text-muted-foreground">{formatDate(policy.endDate)}</span>
    ),
  },
  {
    key: 'actions',
    header: '',
    render: (policy: Policy) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>View Details</DropdownMenuItem>
          <DropdownMenuItem>View Documents</DropdownMenuItem>
          <DropdownMenuItem>Add Endorsement</DropdownMenuItem>
          <DropdownMenuItem>Initiate Renewal</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

const Policies = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredPolicies = mockPolicies.filter((policy) => {
    const matchesSearch =
      policy.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.policyNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || policy.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPremium = filteredPolicies.reduce((sum, policy) => sum + policy.totalPremium, 0);

  return (
    <AppLayout title="Policies" subtitle="Manage active and pending policies">
      <div className="space-y-6 animate-fade-in">
        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="stat-card">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3">
                <FileCheck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{mockPolicies.length}</p>
                <p className="text-sm text-muted-foreground">Total Policies</p>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-success/10 p-3">
                <FileCheck className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockPolicies.filter((p) => p.status === 'active').length}
                </p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-warning/10 p-3">
                <FileCheck className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockPolicies.filter((p) => p.status === 'pending_approval').length}
                </p>
                <p className="text-sm text-muted-foreground">Pending Approval</p>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(totalPremium)}</p>
              <p className="text-sm text-muted-foreground">Total Premium</p>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search policies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending_approval">Pending Approval</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
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
            data={filteredPolicies}
            columns={columns}
            onRowClick={(policy) => console.log('View policy:', policy.id)}
          />
        </div>

        {/* Summary Footer */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>Showing {filteredPolicies.length} of {mockPolicies.length} policies</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Policies;
