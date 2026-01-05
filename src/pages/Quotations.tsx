import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge, getStatusType } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockQuotes, formatCurrency, formatDate } from '@/data/mockData';
import { Quote } from '@/types/insurance';
import { Plus, Search, Filter, Download, FileText, Eye, Copy } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const statusLabels: Record<string, string> = {
  draft: 'Draft',
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  expired: 'Expired',
};

const columns = [
  {
    key: 'id',
    header: 'Quote ID',
    render: (quote: Quote) => (
      <span className="font-mono text-sm font-medium text-primary">{quote.id}</span>
    ),
  },
  {
    key: 'companyName',
    header: 'Company',
    render: (quote: Quote) => (
      <div>
        <p className="font-medium text-foreground">{quote.companyName}</p>
        <p className="text-xs text-muted-foreground">{quote.employeesCount} employees</p>
      </div>
    ),
  },
  {
    key: 'productType',
    header: 'Product',
    render: (quote: Quote) => (
      <span className="inline-flex items-center px-2 py-1 rounded-md bg-secondary text-xs font-medium">
        {quote.productType}
      </span>
    ),
  },
  {
    key: 'provider',
    header: 'Provider',
  },
  {
    key: 'premium',
    header: 'Premium',
    render: (quote: Quote) => (
      <span className="font-semibold">{formatCurrency(quote.premium)}</span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (quote: Quote) => (
      <StatusBadge
        status={getStatusType(quote.status)}
        label={statusLabels[quote.status]}
      />
    ),
  },
  {
    key: 'validUntil',
    header: 'Valid Until',
    render: (quote: Quote) => (
      <span className="text-muted-foreground">{formatDate(quote.validUntil)}</span>
    ),
  },
  {
    key: 'actions',
    header: '',
    render: (quote: Quote) => (
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

const Quotations = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredQuotes = mockQuotes.filter((quote) => {
    const matchesSearch = 
      quote.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPremium = filteredQuotes.reduce((sum, quote) => sum + quote.premium, 0);

  return (
    <AppLayout title="Quotations" subtitle="Create and manage insurance quotes">
      <div className="space-y-6 animate-fade-in">
        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="stat-card">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{mockQuotes.length}</p>
                <p className="text-sm text-muted-foreground">Total Quotes</p>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-success/10 p-3">
                <FileText className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockQuotes.filter((q) => q.status === 'approved').length}
                </p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-warning/10 p-3">
                <FileText className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockQuotes.filter((q) => q.status === 'pending').length}
                </p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(totalPremium)}</p>
              <p className="text-sm text-muted-foreground">Total Premium Value</p>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search quotes..."
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
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
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
            <Link to="/quotations/new">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Quote
              </Button>
            </Link>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <DataTable
            data={filteredQuotes}
            columns={columns}
            onRowClick={(quote) => console.log('View quote:', quote.id)}
          />
        </div>

        {/* Summary Footer */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>Showing {filteredQuotes.length} of {mockQuotes.length} quotes</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Quotations;
