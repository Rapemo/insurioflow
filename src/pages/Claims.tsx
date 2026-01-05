import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge, getStatusType } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockClaims, formatCurrency, formatDate } from '@/data/mockData';
import { Claim } from '@/types/insurance';
import { Plus, Search, Filter, Download, ClipboardList, Eye } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const statusLabels: Record<string, string> = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  approved: 'Approved',
  rejected: 'Rejected',
  paid: 'Paid',
};

const columns = [
  {
    key: 'id',
    header: 'Claim ID',
    render: (claim: Claim) => (
      <span className="font-mono text-sm font-medium text-primary">{claim.id}</span>
    ),
  },
  {
    key: 'companyName',
    header: 'Company',
    render: (claim: Claim) => (
      <div>
        <p className="font-medium text-foreground">{claim.companyName}</p>
        <p className="text-xs text-muted-foreground">{claim.policyNumber}</p>
      </div>
    ),
  },
  {
    key: 'employeeName',
    header: 'Employee',
  },
  {
    key: 'claimType',
    header: 'Type',
    render: (claim: Claim) => (
      <span className="inline-flex items-center px-2 py-1 rounded-md bg-secondary text-xs font-medium">
        {claim.claimType}
      </span>
    ),
  },
  {
    key: 'amount',
    header: 'Amount',
    render: (claim: Claim) => (
      <span className="font-semibold">{formatCurrency(claim.amount)}</span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (claim: Claim) => (
      <StatusBadge
        status={getStatusType(claim.status)}
        label={statusLabels[claim.status]}
      />
    ),
  },
  {
    key: 'submittedDate',
    header: 'Submitted',
    render: (claim: Claim) => (
      <span className="text-muted-foreground">{formatDate(claim.submittedDate)}</span>
    ),
  },
  {
    key: 'actions',
    header: '',
    render: (claim: Claim) => (
      <Button variant="ghost" size="sm">
        <Eye className="h-4 w-4" />
      </Button>
    ),
  },
];

const Claims = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredClaims = mockClaims.filter((claim) => {
    const matchesSearch = 
      claim.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || claim.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalAmount = filteredClaims.reduce((sum, claim) => sum + claim.amount, 0);

  return (
    <AppLayout title="Claims" subtitle="Track and manage insurance claims">
      <div className="space-y-6 animate-fade-in">
        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {['submitted', 'under_review', 'approved', 'rejected', 'paid'].map((status) => {
            const count = mockClaims.filter((c) => c.status === status).length;
            const amount = mockClaims
              .filter((c) => c.status === status)
              .reduce((sum, c) => sum + c.amount, 0);
            return (
              <div
                key={status}
                className="stat-card cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => setStatusFilter(status)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-foreground">{count}</p>
                    <p className="text-xs text-muted-foreground">{statusLabels[status]}</p>
                  </div>
                  <StatusBadge status={getStatusType(status)} label={statusLabels[status]} />
                </div>
                <p className="mt-2 text-sm font-medium text-muted-foreground">
                  {formatCurrency(amount)}
                </p>
              </div>
            );
          })}
        </div>

        {/* Header Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search claims..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
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
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Claim
            </Button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <DataTable
            data={filteredClaims}
            columns={columns}
            onRowClick={(claim) => console.log('View claim:', claim.id)}
          />
        </div>

        {/* Summary Footer */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>Showing {filteredClaims.length} of {mockClaims.length} claims</p>
          <p className="font-medium">Total: {formatCurrency(totalAmount)}</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Claims;
