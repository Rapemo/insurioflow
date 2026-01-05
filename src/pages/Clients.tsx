import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge, getStatusType } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Company } from '@/types/insurance';
import { Plus, Search, Filter, Download, RefreshCw, Building2, Edit } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const Clients = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const columns = [
    {
      key: 'name',
      header: 'Company',
      render: (company: Company) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">{company.name}</p>
            <p className="text-xs text-muted-foreground">{company.industry}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'employeeCount',
      header: 'Employees',
      render: (company: Company) => (
        <span className="font-medium">{company.employeeCount.toLocaleString()}</span>
      ),
    },
    {
      key: 'country',
      header: 'Country',
    },
    {
      key: 'workpayId',
      header: 'WorkPay ID',
      render: (company: Company) => (
        <span className="font-mono text-xs text-muted-foreground">
          {company.workpayId || '—'}
        </span>
      ),
    },
    {
      key: 'hubspotId',
      header: 'HubSpot ID',
      render: (company: Company) => (
        <span className="font-mono text-xs text-muted-foreground">
          {company.hubspotId || '—'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (company: Company) => (
        <StatusBadge
          status={getStatusType(company.status)}
          label={company.status.charAt(0).toUpperCase() + company.status.slice(1)}
        />
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (company: Company) => (
        <span className="text-muted-foreground">{formatDate(company.createdAt)}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (company: Company) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/clients/${company.id}/edit`)}
          className="h-8 w-8 p-0"
        >
          <Edit className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching companies:', error);
        return;
      }

      // Transform data to match Company interface
      const transformedData: Company[] = (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        industry: item.industry,
        employeeCount: item.employee_count,
        country: item.country,
        workpayId: item.workpay_id,
        hubspotId: item.hubspot_id,
        status: item.status,
        createdAt: item.created_at,
      }));

      setCompanies(transformedData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || company.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AppLayout title="Clients" subtitle="Manage client companies and their data">
      <div className="space-y-6 animate-fade-in">
        {/* Header Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchCompanies}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm" onClick={() => navigate('/clients/create')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <DataTable
            data={filteredCompanies}
            columns={columns}
            onRowClick={(company) => console.log('View company:', company.id)}
          />
        </div>

        {/* Summary Footer */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>Showing {filteredCompanies.length} of {companies.length} companies</p>
          <p>Total employees: {companies.reduce((sum, c) => sum + c.employeeCount, 0).toLocaleString()}</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Clients;
