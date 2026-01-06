import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
import { useAuth } from '@/contexts/AuthContext';
import { policyService } from '@/services/policyService';
import { claimService } from '@/services/claimService';

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
  const { user, profile, logout } = useAuth();

  useEffect(() => {
    fetchClientData();
  }, []);

  const fetchClientData = async () => {
    if (!user || !profile) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch client's policies
      const { data: policiesData, error: policiesError } = await policyService.getPolicies();
      if (policiesError) {
        setError('Failed to fetch policies');
        return;
      }

      // Fetch client's claims
      const { data: claimsData, error: claimsError } = await claimService.getClaims();
      if (claimsError) {
        setError('Failed to fetch claims');
        return;
      }

      // Mock company data (in real app, this would come from user profile)
      const companyData = {
        name: profile?.full_name || user?.email?.split('@')[0] || 'Client',
        industry: 'Technology',
        employee_count: 250,
        status: 'active'
      };

      // Mock recent activity (in real app, this would come from activity logs)
      const recentActivity = [
        {
          type: 'policy_created',
          description: 'New policy added',
          date: new Date().toISOString()
        },
        {
          type: 'claim_submitted',
          description: 'Claim submitted for review',
          date: new Date(Date.now() - 86400000).toISOString() // 1 day ago
        }
      ];

      const transformedData: ClientData = {
        company: companyData,
        policies: policiesData || [],
        claims: claimsData || [],
        recentActivity
      };

      setClientData(transformedData);
    } catch (error) {
      console.error('Error fetching client data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
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
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!clientData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <h1 className="text-xl font-semibold text-gray-900">
                  {clientData.company.name}
                </h1>
                <p className="text-sm text-gray-500">Client Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Welcome Card */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Welcome back, {profile?.full_name || user?.email?.split('@')[0]}
                </CardTitle>
                <CardDescription>
                  Here's an overview of your insurance portfolio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{clientData.policies.length}</div>
                    <div className="text-sm text-gray-500">Active Policies</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{clientData.claims.length}</div>
                    <div className="text-sm text-gray-500">Total Claims</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Total Coverage</span>
                  <span className="text-lg font-semibold">$45,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Monthly Premium</span>
                  <span className="text-lg font-semibold">$1,500</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Next Payment</span>
                  <span className="text-sm font-medium text-orange-600">Feb 1, 2024</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {clientData.recentActivity.slice(0, 3).map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-3 ${
                          activity.type === 'policy_created' ? 'bg-green-500' : 'bg-blue-500'
                        }`}></div>
                        <div>
                          <p className="text-sm font-medium">{activity.description}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(activity.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Policies and Claims */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Your Policies
                </div>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </CardTitle>
              <CardDescription>
                Your active insurance policies
              </CardDescription>
            </CardHeader>
            <CardContent>
              {clientData.policies.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No active policies found</p>
                  <p className="text-sm text-gray-400">Contact your insurance provider to add policies</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {clientData.policies.slice(0, 3).map((policy) => (
                    <div key={policy.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{policy.policy_number}</p>
                        <p className="text-sm text-gray-500">{policy.product_type}</p>
                      </div>
                      <Badge variant={policy.status === 'active' ? 'default' : 'secondary'}>
                        {policy.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Your Claims
                </div>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </CardTitle>
              <CardDescription>
                Your insurance claims and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {clientData.claims.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No claims found</p>
                  <p className="text-sm text-gray-400">File a claim when needed</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {clientData.claims.slice(0, 3).map((claim) => (
                    <div key={claim.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{claim.claim_number}</p>
                        <p className="text-sm text-gray-500">{claim.claim_type}</p>
                        <p className="text-sm font-medium">${claim.amount}</p>
                      </div>
                      <Badge variant={
                        claim.status === 'approved' ? 'default' : 
                        claim.status === 'under_review' ? 'secondary' : 'destructive'
                      }>
                        {claim.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
