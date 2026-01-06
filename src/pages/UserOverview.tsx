import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, RefreshCw, Shield, Mail, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface UserWithProfile {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string;
  email_confirmed_at?: string;
  role?: string;
  full_name?: string;
  company_id?: string;
  phone?: string;
  profile_created_at?: string;
  profile_updated_at?: string;
}

const UserOverview = () => {
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use raw SQL query to get users with profiles
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          email,
          created_at,
          last_sign_in_at,
          email_confirmed_at,
          user_profiles!inner(
            role,
            full_name,
            company_id,
            phone,
            created_at,
            updated_at
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users');
        return;
      }

      const transformedData = (data || []).map((user: any) => ({
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        email_confirmed_at: user.email_confirmed_at,
        role: user.user_profiles?.role,
        full_name: user.user_profiles?.full_name,
        company_id: user.user_profiles?.company_id,
        phone: user.user_profiles?.phone,
        profile_created_at: user.user_profiles?.created_at,
        profile_updated_at: user.user_profiles?.updated_at
      }));

      setUsers(transformedData);
    } catch (error) {
      console.error('Unexpected error fetching users:', error);
      setError('Unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeVariant = (role?: string) => {
    switch (role) {
      case 'admin':
        return 'default';
      case 'agent':
        return 'secondary';
      case 'client':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusBadgeVariant = (user: UserWithProfile) => {
    if (!user.email_confirmed_at) {
      return 'destructive';
    }
    if (user.last_sign_in_at) {
      return 'default';
    }
    return 'secondary';
  };

  const getStatusText = (user: UserWithProfile) => {
    if (!user.email_confirmed_at) {
      return 'Unconfirmed';
    }
    if (user.last_sign_in_at) {
      return 'Active';
    }
    return 'Never Signed In';
  };

  const totalUsers = users.length;
  const adminUsers = users.filter(u => u.role === 'admin').length;
  const clientUsers = users.filter(u => u.role === 'client').length;
  const agentUsers = users.filter(u => u.role === 'agent').length;
  const activeUsers = users.filter(u => u.last_sign_in_at).length;
  const unconfirmedUsers = users.filter(u => !u.email_confirmed_at).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p>Loading user data...</p>
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
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <h1 className="text-xl font-semibold text-gray-900">User Overview</h1>
                <p className="text-sm text-gray-500">Current users in the system</p>
              </div>
            </div>
            <Button onClick={fetchUsers} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <Shield className="h-5 w-5 text-red-400" />
              <div>
                <h3 className="text-lg font-medium text-red-800">Error</h3>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">All registered users</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{adminUsers}</div>
              <p className="text-xs text-muted-foreground">System administrators</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Client Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{clientUsers}</div>
              <p className="text-xs text-muted-foreground">Client accounts</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agent Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{agentUsers}</div>
              <p className="text-xs text-muted-foreground">Insurance agents</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeUsers}</div>
              <p className="text-xs text-muted-foreground">Signed in recently</p>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                User Details ({users.length})
              </div>
              {unconfirmedUsers > 0 && (
                <Badge variant="destructive">
                  {unconfirmedUsers} Unconfirmed
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Complete list of all users in the system with their roles and status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No users found</p>
                <p className="text-sm text-gray-400">Create your first user to get started</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Sign In</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <Users className="h-4 w-4 text-gray-500" />
                          </div>
                          <div>
                            <div>{user.full_name || user.email}</div>
                            <div className="text-sm text-gray-500">{user.phone || '-'}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {user.role || 'No Profile'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(user)}>
                          {getStatusText(user)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {user.last_sign_in_at 
                          ? new Date(user.last_sign_in_at).toLocaleDateString()
                          : 'Never'
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserOverview;
