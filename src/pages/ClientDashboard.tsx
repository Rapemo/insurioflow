import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  FileText, 
  Shield, 
  AlertCircle, 
  TrendingUp, 
  Users,
  Calendar,
  LogOut,
  Settings,
  Bell
} from 'lucide-react';

interface ClientData {
  company: any;
  policies: any[];
  claims: any[];
  recentActivity: any[];
}

const ClientDashboard = () => {
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClientData();
  }, []);

  const fetchClientData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/client/login');
        return;
      }

      // Fetch client's company and related data
      // This is a placeholder - you'll need to implement the actual data fetching
      // based on your database schema and user relationships
      
      const mockData: ClientData = {
        company: {
          name: 'Acme Corporation',
          industry: 'Technology',
          employee_count: 250,
          status: 'active'
        },
        policies: [
          {
            id: '1',
            policy_number: 'POL-001',
            product_type: 'Health Insurance',
            premium: 15000,
            status: 'active',
            end_date: '2024-12-31'
          },
          {
            id: '2',
            policy_number: 'POL-002', 
            product_type: 'Life Insurance',
            premium: 8000,
            status: 'active',
            end_date: '2024-12-31'
          }
        ],
        claims: [
          {
            id: '1',
            claim_number: 'CLM-001',
            claim_type: 'Medical',
            amount: 2500,
            status: 'under_review',
            submitted_date: '2024-01-15'
          }
        ],
        recentActivity: [
          {
            type: 'policy_renewed',
            description: 'Health Insurance policy renewed',
            date: '2024-01-10'
          },
          {
            type: 'claim_submitted',
            description: 'Medical claim submitted',
            date: '2024-01-15'
          }
        ]
      };

      setClientData(mockData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch client data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/client/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!clientData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>No client data found</AlertDescription>
        </Alert>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-primary mr-3" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{clientData.company.name}</h1>
                <p className="text-sm text-gray-500">Client Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back!</h2>
          <p className="text-gray-600">Here's an overview of your insurance portfolio</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Policies</p>
                  <p className="text-2xl font-bold text-gray-900">{clientData.policies.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Claims</p>
                  <p className="text-2xl font-bold text-gray-900">{clientData.claims.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Monthly Premium</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${clientData.policies.reduce((sum, p) => sum + p.premium, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Employees</p>
                  <p className="text-2xl font-bold text-gray-900">{clientData.company.employee_count}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Policies and Claims */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Active Policies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Active Policies
              </CardTitle>
              <CardDescription>Your current insurance policies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clientData.policies.map((policy) => (
                  <div key={policy.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{policy.product_type}</p>
                      <p className="text-sm text-gray-500">{policy.policy_number}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(policy.status)}>
                        {policy.status}
                      </Badge>
                      <p className="text-sm text-gray-500 mt-1">${policy.premium.toLocaleString()}/mo</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Claims */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Recent Claims
              </CardTitle>
              <CardDescription>Your recent claim submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clientData.claims.map((claim) => (
                  <div key={claim.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{claim.claim_type}</p>
                      <p className="text-sm text-gray-500">{claim.claim_number}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(claim.status)}>
                        {claim.status.replace('_', ' ')}
                      </Badge>
                      <p className="text-sm text-gray-500 mt-1">${claim.amount.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest updates to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clientData.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ClientDashboard;
