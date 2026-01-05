import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge, getStatusType } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockCommissions, formatCurrency, formatDate } from '@/data/mockData';
import { Commission } from '@/types/insurance';
import { Search, Filter, Download, DollarSign, Calculator } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  calculated: 'Calculated',
  approved: 'Approved',
  paid: 'Paid',
};

const columns = [
  {
    key: 'id',
    header: 'Commission ID',
    render: (commission: Commission) => (
      <span className="font-mono text-sm font-medium text-primary">{commission.id}</span>
    ),
  },
  {
    key: 'companyName',
    header: 'Deal',
    render: (commission: Commission) => (
      <div>
        <p className="font-medium text-foreground">{commission.companyName}</p>
        <p className="text-xs text-muted-foreground">{commission.dealId}</p>
      </div>
    ),
  },
  {
    key: 'salesRep',
    header: 'Sales Rep',
  },
  {
    key: 'broker',
    header: 'Broker',
    render: (commission: Commission) => (
      <span className="text-muted-foreground">{commission.broker || '—'}</span>
    ),
  },
  {
    key: 'premium',
    header: 'Premium',
    render: (commission: Commission) => (
      <span className="font-medium">{formatCurrency(commission.premium)}</span>
    ),
  },
  {
    key: 'commissionRate',
    header: 'Rate',
    render: (commission: Commission) => (
      <span className="font-medium">{commission.commissionRate}%</span>
    ),
  },
  {
    key: 'commissionAmount',
    header: 'Amount',
    render: (commission: Commission) => (
      <span className="font-semibold text-success">
        {formatCurrency(commission.commissionAmount)}
      </span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (commission: Commission) => (
      <StatusBadge
        status={getStatusType(commission.status)}
        label={statusLabels[commission.status]}
      />
    ),
  },
  {
    key: 'payoutDate',
    header: 'Payout Date',
    render: (commission: Commission) => (
      <span className="text-muted-foreground">
        {commission.payoutDate ? formatDate(commission.payoutDate) : '—'}
      </span>
    ),
  },
];

const Commissions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredCommissions = mockCommissions.filter((commission) => {
    const matchesSearch =
      commission.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      commission.salesRep.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || commission.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCommission = mockCommissions.reduce((sum, c) => sum + c.commissionAmount, 0);
  const pendingCommission = mockCommissions
    .filter((c) => c.status !== 'paid')
    .reduce((sum, c) => sum + c.commissionAmount, 0);
  const paidCommission = mockCommissions
    .filter((c) => c.status === 'paid')
    .reduce((sum, c) => sum + c.commissionAmount, 0);

  return (
    <AppLayout title="Commissions" subtitle="Track and manage commission payments">
      <div className="space-y-6 animate-fade-in">
        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="stat-card">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(totalCommission)}
                </p>
                <p className="text-sm text-muted-foreground">Total Commission</p>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-warning/10 p-3">
                <Calculator className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(pendingCommission)}
                </p>
                <p className="text-sm text-muted-foreground">Pending Payout</p>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-success/10 p-3">
                <DollarSign className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(paidCommission)}
                </p>
                <p className="text-sm text-muted-foreground">Paid Out</p>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div>
              <p className="text-2xl font-bold text-foreground">
                {(
                  (mockCommissions.reduce((sum, c) => sum + c.commissionRate, 0) /
                    mockCommissions.length) ||
                  0
                ).toFixed(1)}
                %
              </p>
              <p className="text-sm text-muted-foreground">Avg Commission Rate</p>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search commissions..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="calculated">Calculated</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Calculator className="h-4 w-4 mr-2" />
              Calculate All
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <DataTable
            data={filteredCommissions}
            columns={columns}
            onRowClick={(commission) => console.log('View commission:', commission.id)}
          />
        </div>

        {/* Summary Footer */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>Showing {filteredCommissions.length} of {mockCommissions.length} commissions</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Commissions;
