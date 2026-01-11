import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Shield, AlertCircle, ArrowLeft, Users } from 'lucide-react';
import UserProfileManagement from '@/components/admin/UserProfileManagement';
import { userProfileService } from '@/services/userProfileService';

const UserProfileManagementPage = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const adminStatus = await userProfileService.isCurrentUserAdmin();
      setIsAdmin(adminStatus);
    } catch (error) {
      console.error('Error checking admin access:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Checking permissions...</span>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-red-900">Access Denied</h2>
                  <p className="text-red-700 mt-2">
                    You need admin privileges to access user profile management.
                  </p>
                </div>
                <div className="space-y-3">
                  <Button 
                    onClick={() => navigate('/dashboard')}
                    className="w-full"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Button>
                  <p className="text-sm text-gray-600">
                    Contact your system administrator if you believe this is an error.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="mb-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">User Profile Management</h1>
              <p className="text-sm text-muted-foreground">
                Manage user profiles you have created
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>Admin Access</span>
        </div>
      </div>

      {/* Admin Access Notice */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Admin Access:</strong> You can only view, edit, and delete user profiles that you have created. 
          This ensures proper access control and audit trails.
        </AlertDescription>
      </Alert>

      {/* User Profile Management Component */}
      <UserProfileManagement />
    </div>
  );
};

export default UserProfileManagementPage;
