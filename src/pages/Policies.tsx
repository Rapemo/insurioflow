import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge, getStatusType } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mockPolicies, formatCurrency, formatDate } from '@/data/mockData';
import { Policy } from '@/types/insurance';
import { Search, Filter, Download, FileCheck, Eye, MoreHorizontal, Calendar, FileText, RefreshCw } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { policyService } from '@/services/policyService';
import { useToast } from '@/hooks/use-toast';

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
      <div>
        <span className="font-mono text-sm font-medium text-primary">{policy.policy_number}</span>
      </div>
    ),
  },
  {
    key: 'companyName',
    header: 'Company',
    render: (policy: Policy) => (
      <div>
        <p className="font-medium text-foreground">{policy.company_name || 'N/A'}</p>
        <p className="text-xs text-muted-foreground">{policy.employees_count} employees</p>
      </div>
    ),
  },
  {
    key: 'productType',
    header: 'Product',
    render: (policy: Policy) => (
      <span className="inline-flex items-center px-2 py-1 rounded-md bg-secondary text-xs font-medium">
        {policy.product_type}
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
      <span className="font-semibold">{formatCurrency(policy.total_premium)}</span>
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
      <span className="text-muted-foreground">{formatDate(policy.end_date)}</span>
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
          <DropdownMenuItem onClick={() => handleViewPolicy(policy.id)}>
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem>
            <FileText className="h-4 w-4 mr-2" />
            View Documents
          </DropdownMenuItem>
          <DropdownMenuItem>
            <FileCheck className="h-4 w-4 mr-2" />
            Add Endorsement
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => {
            setSelectedPolicy(policy);
            setIsViewPolicyOpen(true);
          }}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Initiate Renewal
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

const Policies = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isViewPolicyOpen, setIsViewPolicyOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const { data, error } = await policyService.getPolicies();
      
      if (error) {
        setError(error.message);
        toast({
          title: "Error",
          description: "Failed to fetch policies",
          variant: "destructive"
        });
        return;
      }

      if (data) {
        setPolicies(data);
      }
    } catch (err) {
      setError('Failed to load policies');
      toast({
        title: "Error",
        description: "Failed to load policies",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredPolicies = policies.filter((policy) => {
    const matchesSearch =
      (policy.company_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.policy_number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || policy.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPremium = filteredPolicies.reduce((sum, policy) => sum + policy.total_premium, 0);

  const handleViewPolicy = async (policyId: string) => {
    try {
      const { data, error } = await policyService.getPolicyById(policyId);
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch policy details",
          variant: "destructive"
        });
        return;
      }

      if (data) {
        setSelectedPolicy(data);
        setIsViewPolicyOpen(true);
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch policy details",
        variant: "destructive"
      });
    }
  };

  const handleRenewPolicy = async () => {
    if (!selectedPolicy) return;
    
    try {
      const newEndDate = new Date(selectedPolicy.end_date);
      newEndDate.setFullYear(newEndDate.getFullYear() + 1);
      
      const { data, error } = await policyService.renewPolicy(
        selectedPolicy.id,
        newEndDate.toISOString()
      );
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to renew policy",
          variant: "destructive"
        });
        return;
      }

      if (data) {
        setPolicies(policies.map(p => p.id === data.id ? data : p));
        setSelectedPolicy(data);
        toast({
          title: "Success",
          description: "Policy renewed successfully"
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to renew policy",
        variant: "destructive"
      });
    }
  };

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
                <p className="text-2xl font-bold text-foreground">{policies.length}</p>
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
                  {policies.filter((p) => p.status === 'active').length}
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
                  {policies.filter((p) => p.status === 'pending_approval').length}
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
          <p>Showing {filteredPolicies.length} of {policies.length} policies</p>
        </div>

        {/* View Policy Dialog */}
        <Dialog open={isViewPolicyOpen} onOpenChange={setIsViewPolicyOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Policy Details</DialogTitle>
              <DialogDescription>
                View and manage policy information
              </DialogDescription>
            </DialogHeader>
            {selectedPolicy && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Policy Number</Label>
                    <p className="font-mono text-sm">{selectedPolicy.policy_number}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                    <StatusBadge status={getStatusType(selectedPolicy.status)} label={statusLabels[selectedPolicy.status]} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Company</Label>
                    <p className="font-medium">{selectedPolicy.company_name || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Provider</Label>
                    <p className="font-medium">{selectedPolicy.provider}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Product Type</Label>
                    <p className="font-medium">{selectedPolicy.product_type}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Employees Covered</Label>
                    <p className="font-medium">{selectedPolicy.employees_count}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Total Premium</Label>
                    <p className="font-semibold text-lg">{formatCurrency(selectedPolicy.total_premium)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">End Date</Label>
                    <p className="font-medium">{formatDate(selectedPolicy.end_date)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Start Date</Label>
                    <p className="font-medium">{formatDate(selectedPolicy.start_date)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Created Date</Label>
                    <p className="font-medium">{formatDate(selectedPolicy.created_date)}</p>
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsViewPolicyOpen(false)}>
                Close
              </Button>
              {selectedPolicy && selectedPolicy.status === 'active' && (
                <Button onClick={handleRenewPolicy}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Renew Policy
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default Policies;
