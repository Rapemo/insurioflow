import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Building2, 
  Phone, 
  Mail, 
  Calendar,
  TrendingUp,
  Activity,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  FileText,
  Shield,
  DollarSign,
  Target,
  MessageSquare,
  Clock,
  Star,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getFriendlyErrorMessage } from '@/utils/errorHandler';
import FriendlyErrorAlert from '@/components/ui/FriendlyErrorAlert';
import { diagnoseCRMTables } from '@/utils/diagnoseCRM';

interface CRMContact {
  id: string;
  type: 'company' | 'employee' | 'user';
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  role?: string;
  status: 'active' | 'inactive' | 'pending';
  lastActivity?: string;
  value?: number;
  avatar?: string;
  policiesCount?: number;
  claimsCount?: number;
  totalPremium?: number;
}

interface CRMActivity {
  id: string;
  contactId: string;
  contactName: string;
  type: 'policy' | 'claim' | 'quote' | 'call' | 'email' | 'note';
  title: string;
  description: string;
  date: string;
  amount?: number;
  status?: string;
}

interface CRMMetrics {
  totalContacts: number;
  activeCompanies: number;
  totalEmployees: number;
  policiesThisMonth: number;
  claimsThisMonth: number;
  revenueThisMonth: number;
  upcomingRenewals: number;
  hotLeads: number;
}

const CRM = () => {
  const [contacts, setContacts] = useState<CRMContact[]>([]);
  const [activities, setActivities] = useState<CRMActivity[]>([]);
  const [metrics, setMetrics] = useState<CRMMetrics>({
    totalContacts: 0,
    activeCompanies: 0,
    totalEmployees: 0,
    policiesThisMonth: 0,
    claimsThisMonth: 0,
    revenueThisMonth: 0,
    upcomingRenewals: 0,
    hotLeads: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<CRMContact | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch CRM data
  useEffect(() => {
    fetchCRMData();
  }, []);

  const fetchCRMData = async () => {
    try {
      setLoading(true);
      
      // Run diagnostic first
      console.log('🔍 Running CRM diagnostic...');
      await diagnoseCRMTables();
      
      // Fetch companies (this works)
      const { data: companies, error: companiesError } = await supabase
        .from('companies')
        .select('*');

      if (companiesError) {
        console.warn('Companies table not found or error:', companiesError);
        throw companiesError;
      }

      // For now, only use companies data since other tables are empty
      const employees = [];
      const userProfiles = [];
      const policies = [];
      const claims = [];

      // Transform to CRM contacts using only companies data
      const crmContacts: CRMContact[] = [
        ...(companies || []).map(company => ({
          id: company.id,
          type: 'company' as const,
          name: company.name,
          email: null,
          phone: null,
          company: company.name,
          role: 'Company',
          status: company.status as 'active' | 'inactive' | 'pending',
          lastActivity: company.updated_at,
          value: company.employee_count * 1000, // Estimated value
          policiesCount: 0, // Will be 0 until policies table has data
          totalPremium: 0
        })),
        // Skip employees and users for now since tables are empty
      ];

      // Empty activities for now
      const crmActivities: CRMActivity[] = [];

      setContacts(crmContacts);
      setActivities(crmActivities);

      // Calculate metrics
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      setMetrics({
        totalContacts: crmContacts.length,
        activeCompanies: companies?.filter(c => c.status === 'active').length || 0,
        totalEmployees: employees?.length || 0,
        policiesThisMonth: recentPolicies?.filter(p => 
          new Date(p.created_at).getMonth() === currentMonth &&
          new Date(p.created_at).getFullYear() === currentYear
        ).length || 0,
        claimsThisMonth: recentClaims?.filter(c => 
          new Date(c.created_at).getMonth() === currentMonth &&
          new Date(c.created_at).getFullYear() === currentYear
        ).length || 0,
        revenueThisMonth: recentPolicies?.reduce((sum, p) => sum + p.premium, 0) || 0,
        upcomingRenewals: 0, // Would need to calculate from policy end dates
        hotLeads: companies?.filter(c => c.status === 'pending').length || 0
      });

    } catch (err) {
      console.error('Error fetching CRM data:', err);
      setError(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const getContactIcon = (type: string) => {
    switch (type) {
      case 'company': return <Building2 className="h-4 w-4" />;
      case 'employee': return <Users className="h-4 w-4" />;
      case 'user': return <Shield className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">CRM Dashboard</h1>
            <p className="text-muted-foreground">Manage relationships and track customer interactions</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchCRMData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => navigate('/clients/create')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </div>

        {error && <FriendlyErrorAlert error={error} />}

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalContacts}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.activeCompanies} companies, {metrics.totalEmployees} employees
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.policiesThisMonth}</div>
              <p className="text-xs text-muted-foreground">
                New policies • {formatCurrency(metrics.revenueThisMonth)} revenue
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Claims</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.claimsThisMonth}</div>
              <p className="text-xs text-muted-foreground">
                New claims this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hot Leads</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.hotLeads}</div>
              <p className="text-xs text-muted-foreground">
                Pending companies
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="activities">Recent Activity</TabsTrigger>
            <TabsTrigger value="pipeline">Sales Pipeline</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Contacts */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Contacts</CardTitle>
                  <CardDescription>Latest additions to your CRM</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contacts.slice(0, 5).map((contact) => (
                      <div key={contact.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={contact.avatar} />
                            <AvatarFallback>
                              {getContactIcon(contact.type)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{contact.name}</p>
                            <p className="text-sm text-muted-foreground">{contact.role}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(contact.status)}>
                            {contact.status}
                          </Badge>
                          {contact.value && (
                            <p className="text-sm text-muted-foreground">
                              {formatCurrency(contact.value)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Latest interactions and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div className="mt-1">
                          {activity.type === 'policy' && <Shield className="h-4 w-4 text-blue-500" />}
                          {activity.type === 'claim' && <FileText className="h-4 w-4 text-red-500" />}
                          {activity.type === 'quote' && <DollarSign className="h-4 w-4 text-green-500" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(activity.date)}</p>
                        </div>
                        {activity.amount && (
                          <div className="text-right">
                            <p className="font-medium">{formatCurrency(activity.amount)}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-6">
            {/* Search and Filter */}
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search contacts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            {/* Contacts Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contact</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Last Activity</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts
                      .filter(contact => 
                        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        contact.company?.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={contact.avatar} />
                              <AvatarFallback>
                                {getContactIcon(contact.type)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{contact.name}</p>
                              {contact.email && (
                                <p className="text-sm text-muted-foreground">{contact.email}</p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {contact.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{contact.company || '-'}</TableCell>
                        <TableCell>{contact.role}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(contact.status)}>
                            {contact.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {contact.value ? formatCurrency(contact.value) : '-'}
                        </TableCell>
                        <TableCell>
                          {contact.lastActivity ? formatDate(contact.lastActivity) : '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedContact(contact)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (contact.type === 'company') {
                                  navigate(`/clients/${contact.id}/edit`);
                                }
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>All recent interactions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="mt-1">
                        {activity.type === 'policy' && <Shield className="h-5 w-5 text-blue-500" />}
                        {activity.type === 'claim' && <FileText className="h-5 w-5 text-red-500" />}
                        {activity.type === 'quote' && <DollarSign className="h-5 w-5 text-green-500" />}
                        {activity.type === 'call' && <Phone className="h-5 w-5 text-purple-500" />}
                        {activity.type === 'email' && <Mail className="h-5 w-5 text-orange-500" />}
                        {activity.type === 'note' && <MessageSquare className="h-5 w-5 text-gray-500" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">{formatDate(activity.date)}</p>
                        </div>
                        <p className="text-muted-foreground">{activity.description}</p>
                        {activity.status && (
                          <Badge variant="outline" className="mt-2">
                            {activity.status}
                          </Badge>
                        )}
                      </div>
                      {activity.amount && (
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(activity.amount)}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pipeline" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {['Lead', 'Qualified', 'Proposal', 'Closed Won'].map((stage) => (
                <Card key={stage}>
                  <CardHeader>
                    <CardTitle className="text-lg">{stage}</CardTitle>
                    <CardDescription>
                      {stage === 'Lead' && 'Initial contact'}
                      {stage === 'Qualified' && 'Needs verified'}
                      {stage === 'Proposal' && 'Quote sent'}
                      {stage === 'Closed Won' && 'Policy active'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {contacts
                        .filter(contact => contact.type === 'company' && contact.status === 'pending')
                        .slice(0, 3)
                        .map((contact) => (
                        <div key={contact.id} className="p-3 border rounded-lg">
                          <p className="font-medium">{contact.name}</p>
                          <p className="text-sm text-muted-foreground">{contact.role}</p>
                          {contact.value && (
                            <p className="text-sm font-medium">{formatCurrency(contact.value)}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Contact Detail Dialog */}
        <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Contact Details</DialogTitle>
              <DialogDescription>
                Complete information about {selectedContact?.name}
              </DialogDescription>
            </DialogHeader>
            {selectedContact && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedContact.avatar} />
                    <AvatarFallback>
                      {getContactIcon(selectedContact.type)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold">{selectedContact.name}</h3>
                    <p className="text-muted-foreground">{selectedContact.role}</p>
                    <Badge className={getStatusColor(selectedContact.status)}>
                      {selectedContact.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Type</p>
                    <p>{selectedContact.type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Company</p>
                    <p>{selectedContact.company || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p>{selectedContact.email || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p>{selectedContact.phone || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Estimated Value</p>
                    <p>{selectedContact.value ? formatCurrency(selectedContact.value) : '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Last Activity</p>
                    <p>{selectedContact.lastActivity ? formatDate(selectedContact.lastActivity) : '-'}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => {
                    if (selectedContact.type === 'company') {
                      navigate(`/clients/${selectedContact.id}/edit`);
                      setSelectedContact(null);
                    }
                  }}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Contact
                  </Button>
                  <Button variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Add Note
                  </Button>
                  <Button variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default CRM;
