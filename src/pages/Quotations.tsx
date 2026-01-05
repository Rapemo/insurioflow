import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge, getStatusType } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { quoteService } from '@/services/quoteService';
import { useToast } from '@/hooks/use-toast';

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
        <p className="font-medium text-foreground">{quote.company_name || 'N/A'}</p>
        <p className="text-xs text-muted-foreground">{quote.employees_count} employees</p>
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
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const { data, error } = await quoteService.getQuotes();
      
      if (error) {
        setError(error.message);
        toast({
          title: "Error",
          description: "Failed to fetch quotes",
          variant: "destructive"
        });
        return;
      }

      if (data) {
        setQuotes(data);
      }
    } catch (err) {
      setError('Failed to load quotes');
      toast({
        title: "Error",
        description: "Failed to load quotes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredQuotes = quotes.filter((quote) => {
    const matchesSearch = 
      (quote.company_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPremium = filteredQuotes.reduce((sum, quote) => sum + quote.premium, 0);

  const handleViewQuote = async (quoteId: string) => {
    try {
      const { data, error } = await quoteService.getQuoteById(quoteId);
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch quote details",
          variant: "destructive"
        });
        return;
      }

      if (data) {
        setSelectedQuote(data);
        setIsViewQuoteOpen(true);
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch quote details",
        variant: "destructive"
      });
    }
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
        setQuotes([data, ...quotes]);
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
                <p className="text-2xl font-bold text-foreground">{quotes.length}</p>
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
                  {quotes.filter((q) => q.status === 'approved').length}
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
                  {quotes.filter((q) => q.status === 'pending').length}
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
            {selectedQuote && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Quote Number</Label>
                    <p className="font-mono text-sm">{selectedQuote.quote_number}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                    <StatusBadge status={getStatusType(selectedQuote.status)} label={statusLabels[selectedQuote.status]} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Company</Label>
                    <p className="font-medium">{selectedQuote.company_name || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Provider</Label>
                    <p className="font-medium">{selectedQuote.provider}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Product Type</Label>
                    <p className="font-medium">{selectedQuote.product_type}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Employees Covered</Label>
                    <p className="font-medium">{selectedQuote.employees_count}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Premium</Label>
                    <p className="font-semibold text-lg">{formatCurrency(selectedQuote.premium)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Valid Until</Label>
                    <p className="font-medium">{formatDate(selectedQuote.valid_until)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Created Date</Label>
                    <p className="font-medium">{formatDate(selectedQuote.created_date)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
                    <p className="font-medium">{formatDate(selectedQuote.updated_date)}</p>
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
