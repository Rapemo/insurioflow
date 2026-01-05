import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge, getStatusType } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { mockClaims, formatCurrency, formatDate } from '@/data/mockData';
import { Claim } from '@/types/insurance';
import { Plus, Search, Filter, Download, ClipboardList, Eye, X } from 'lucide-react';
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
import { claimService, CreateClaimData } from '@/services/claimService';
import { useToast } from '@/hooks/use-toast';

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
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => handleViewClaim(claim.id)}
      >
        <Eye className="h-4 w-4" />
      </Button>
    ),
  },
];

const Claims = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddClaimOpen, setIsAddClaimOpen] = useState(false);
  const [isViewClaimOpen, setIsViewClaimOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const [newClaim, setNewClaim] = useState<CreateClaimData>({
    company_id: '',
    employee_id: '',
    policy_number: '',
    claim_type: 'medical',
    amount: 0,
    description: ''
  });

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const { data, error } = await claimService.getClaims();
      
      if (error) {
        setError(error.message);
        toast({
          title: "Error",
          description: "Failed to fetch claims",
          variant: "destructive"
        });
        return;
      }

      if (data) {
        setClaims(data);
      }
    } catch (err) {
      setError('Failed to load claims');
      toast({
        title: "Error",
        description: "Failed to load claims",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredClaims = claims.filter((claim) => {
    const matchesSearch = 
      (claim.companyName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (claim.employee_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || claim.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalAmount = filteredClaims.reduce((sum, claim) => sum + claim.amount, 0);

  const handleAddClaim = async () => {
    try {
      const { data, error } = await claimService.createClaim(newClaim);
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      if (data) {
        setClaims([data, ...claims]);
        setNewClaim({
          company_id: '',
          employee_id: '',
          policy_number: '',
          claim_type: 'medical',
          amount: 0,
          description: ''
        });
        setIsAddClaimOpen(false);
        toast({
          title: "Success",
          description: "Claim created successfully"
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create claim",
        variant: "destructive"
      });
    }
  };

  const handleViewClaim = async (claimId: string) => {
    try {
      const { data, error } = await claimService.getClaimById(claimId);
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch claim details",
          variant: "destructive"
        });
        return;
      }

      if (data) {
        setSelectedClaim(data);
        setIsViewClaimOpen(true);
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch claim details",
        variant: "destructive"
      });
    }
  };

  return (
    <AppLayout title="Claims" subtitle="Track and manage insurance claims">
      <div className="space-y-6 animate-fade-in">
        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {['submitted', 'under_review', 'approved', 'rejected', 'paid'].map((status) => {
            const count = claims.filter((c) => c.status === status).length;
            const amount = claims
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
            <Button size="sm" onClick={() => setIsAddClaimOpen(true)}>
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
          <p>Showing {filteredClaims.length} of {claims.length} claims</p>
          <p className="font-medium">Total: {formatCurrency(totalAmount)}</p>
        </div>

        {/* Add Claim Dialog */}
        <Dialog open={isAddClaimOpen} onOpenChange={setIsAddClaimOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>New Claim</DialogTitle>
              <DialogDescription>
                Submit a new insurance claim
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="company_id" className="text-right">
                  Company ID
                </Label>
                <Input
                  id="company_id"
                  value={newClaim.company_id}
                  onChange={(e) => setNewClaim({...newClaim, company_id: e.target.value})}
                  className="col-span-3"
                  placeholder="Enter company ID"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="employee_id" className="text-right">
                  Employee ID
                </Label>
                <Input
                  id="employee_id"
                  value={newClaim.employee_id}
                  onChange={(e) => setNewClaim({...newClaim, employee_id: e.target.value})}
                  className="col-span-3"
                  placeholder="Enter employee ID"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="policy_number" className="text-right">
                  Policy Number
                </Label>
                <Input
                  id="policy_number"
                  value={newClaim.policy_number}
                  onChange={(e) => setNewClaim({...newClaim, policy_number: e.target.value})}
                  className="col-span-3"
                  placeholder="Enter policy number"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="claim_type" className="text-right">
                  Claim Type
                </Label>
                <Select
                  value={newClaim.claim_type}
                  onValueChange={(value) => setNewClaim({...newClaim, claim_type: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select claim type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="dental">Dental</SelectItem>
                    <SelectItem value="vision">Vision</SelectItem>
                    <SelectItem value="life">Life</SelectItem>
                    <SelectItem value="disability">Disability</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={newClaim.amount}
                  onChange={(e) => setNewClaim({...newClaim, amount: parseFloat(e.target.value) || 0})}
                  className="col-span-3"
                  placeholder="Enter amount"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={newClaim.description}
                  onChange={(e) => setNewClaim({...newClaim, description: e.target.value})}
                  className="col-span-3"
                  placeholder="Enter claim description"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddClaimOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddClaim}
                disabled={!newClaim.company_id.trim() || !newClaim.employee_id.trim() || !newClaim.policy_number.trim() || newClaim.amount <= 0}
              >
                Submit Claim
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Claim Dialog */}
        <Dialog open={isViewClaimOpen} onOpenChange={setIsViewClaimOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Claim Details</DialogTitle>
              <DialogDescription>
                View and manage claim information
              </DialogDescription>
            </DialogHeader>
            {selectedClaim && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Claim ID</Label>
                    <p className="font-mono text-sm">{selectedClaim.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                    <StatusBadge status={getStatusType(selectedClaim.status)} label={statusLabels[selectedClaim.status]} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Company</Label>
                    <p className="font-medium">{selectedClaim.company_name || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Employee</Label>
                    <p className="font-medium">{selectedClaim.employee_name || 'N/A'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Policy Number</Label>
                    <p className="font-mono text-sm">{selectedClaim.policy_number}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Claim Type</Label>
                    <p className="font-medium">{selectedClaim.claim_type}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Amount</Label>
                    <p className="font-semibold text-lg">{formatCurrency(selectedClaim.amount)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Submitted Date</Label>
                    <p className="font-medium">{formatDate(selectedClaim.submitted_date)}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                  <p className="text-sm">{selectedClaim.description}</p>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsViewClaimOpen(false)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default Claims;
