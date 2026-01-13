import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge, getStatusType } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency, formatDate } from '@/data/mockData';
import { Quote } from '@/lib/api/types';
import { Plus, Search, Filter, Download, FileText, Eye, Copy, RefreshCw, Loader2 } from 'lucide-react';
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
} from '@/components/ui/dialog';
import { useQuotes, useQuote, useUpdateQuote, useDeleteQuote } from '@/hooks/useQuotes';
import { quoteService } from '@/services/quoteService';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import FriendlyErrorAlert from '@/components/ui/FriendlyErrorAlert';

const statusLabels: Record<string, string> = {
  draft: 'Draft',
  pending: 'Pending',
  sent: 'Sent',
  accepted: 'Accepted',
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
        <p className="font-medium text-foreground">{quote.company_id || 'N/A'}</p>
        <p className="text-xs text-muted-foreground">{quote.employee_count} employees</p>
      </div>
    ),
  },
  {
    key: 'productType',
    header: 'Product',
    render: (quote: Quote) => (
      <span className="inline-flex items-center px-2 py-1 rounded-md bg-secondary text-xs font-medium">
        {quote.product_type}
      </span>
    ),
  },
  {
    key: 'provider',
    header: 'Provider',
    render: (quote: Quote) => (
      <span>{quote.provider_id || 'N/A'}</span>
    ),
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
      <span className="text-muted-foreground">{formatDate(quote.valid_until)}</span>
    ),
  },
  {
    key: 'actions',
    header: '',
    render: (quote: Quote) => (
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => handleViewQuote(quote.id)}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => handleCopyQuote(quote.id)}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

const Quotations = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isViewQuoteOpen, setIsViewQuoteOpen] = useState(false);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Use React Query hooks for data management
  const { 
    data: quotesResponse, 
    isLoading: loading, 
    error,
    refetch 
  } = useQuotes();

  const quotes = quotesResponse?.data || [];

  const { data: selectedQuote } = useQuote(selectedQuoteId || '');
  
  const updateQuoteMutation = useUpdateQuote();
  const deleteQuoteMutation = useDeleteQuote();

  const filteredQuotes = quotes.filter((quote) => {
    const matchesSearch = 
      quote.quote_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.product_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.company_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPremium = filteredQuotes.reduce((sum, quote) => sum + quote.premium, 0);

  const handleViewQuote = (quoteId: string) => {
    setSelectedQuoteId(quoteId);
    setIsViewQuoteOpen(true);
  };

  const handleCopyQuote = async (quoteId: string) => {
    try {
      const { data, error } = await quoteService.copyQuote(quoteId);
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to copy quote",
          variant: "destructive"
        });
        return;
      }

      if (data) {
        // Invalidate queries to refresh the list
        queryClient.invalidateQueries({ queryKey: ['quotes'] });
        toast({
          title: "Success",
          description: `Quote copied successfully. New quote ID: ${data.quote_number}`
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy quote",
        variant: "destructive"
      });
    }
  };

  const handleStatusChange = async (quoteId: string, newStatus: Quote['status']) => {
    updateQuoteMutation.mutate(
      { id: quoteId, data: { status: newStatus } },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: `Quote status updated to ${newStatus}`
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to update quote status",
            variant: "destructive"
          });
        }
      }
    );
  };

  return (
    <AppLayout title="Quotations" subtitle="Create and manage insurance quotes">
      <div className="space-y-6 animate-fade-in">
        {/* Error Display */}
        {error && (
          <FriendlyErrorAlert error={error as any} />
        )}

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="stat-card">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                {loading ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">Loading...</span>
                  </div>
                ) : (
                  <>
                    <p className="text-2xl font-bold text-foreground">{quotes.length}</p>
                    <p className="text-sm text-muted-foreground">Total Quotes</p>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-success/10 p-3">
                <FileText className="h-6 w-6 text-success" />
              </div>
              <div>
                {loading ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">Loading...</span>
                  </div>
                ) : (
                  <>
                    <p className="text-2xl font-bold text-foreground">
                      {quotes.filter((q) => q.status === 'accepted').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Approved</p>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-warning/10 p-3">
                <FileText className="h-6 w-6 text-warning" />
              </div>
              <div>
                {loading ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">Loading...</span>
                  </div>
                ) : (
                  <>
                    <p className="text-2xl font-bold text-foreground">
                      {quotes.filter((q) => q.status === 'pending').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div>
              {loading ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Loading...</span>
                </div>
              ) : (
                <>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(totalPremium)}</p>
                  <p className="text-sm text-muted-foreground">Total Premium Value</p>
                </>
              )}
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
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => refetch()}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
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
          <p>Showing {filteredQuotes.length} of {quotes.length} quotes</p>
        </div>

        {/* View Quote Dialog */}
        <Dialog open={isViewQuoteOpen} onOpenChange={setIsViewQuoteOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Quote Details</DialogTitle>
              <DialogDescription>
                View quote information and manage actions
              </DialogDescription>
            </DialogHeader>
            {selectedQuote?.data && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Quote Number</Label>
                    <p className="font-mono text-sm">{selectedQuote.data.quote_number}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                    <StatusBadge status={getStatusType(selectedQuote.data.status)} label={statusLabels[selectedQuote.data.status]} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Company</Label>
                    <p className="font-medium">{selectedQuote.data.company_name || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Provider</Label>
                    <p className="font-medium">{selectedQuote.data.provider}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Product Type</Label>
                    <p className="font-medium">{selectedQuote.data.product_type}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Employees Covered</Label>
                    <p className="font-medium">{selectedQuote.data.employee_count}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Premium</Label>
                    <p className="font-semibold text-lg">{formatCurrency(selectedQuote.data.premium)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Valid Until</Label>
                    <p className="font-medium">{formatDate(selectedQuote.data.valid_until)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Created Date</Label>
                    <p className="font-medium">{formatDate(selectedQuote.data.created_at)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
                    <p className="font-medium">{formatDate(selectedQuote.data.updated_at)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Change Status</Label>
                    <Select
                      value={selectedQuote.data.status}
                      onValueChange={(value) => handleStatusChange(selectedQuote.data.id, value as Quote['status'])}
                      disabled={updateQuoteMutation.isPending}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Quick Actions</Label>
                    <div className="flex gap-2 mt-2">
                      {selectedQuote.data.status === 'pending' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleStatusChange(selectedQuote.data.id, 'accepted')}
                          disabled={updateQuoteMutation.isPending}
                        >
                          Accept
                        </Button>
                      )}
                      {selectedQuote.data.status === 'accepted' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleStatusChange(selectedQuote.data.id, 'rejected')}
                          disabled={updateQuoteMutation.isPending}
                        >
                          Reject
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsViewQuoteOpen(false)}>
                Close
              </Button>
              {selectedQuote && (
                <Button onClick={() => handleCopyQuote(selectedQuote.id)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Quote
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default Quotations;
