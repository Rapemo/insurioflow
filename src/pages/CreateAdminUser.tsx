import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminUserOnboardingWizard from '@/components/forms/AdminUserOnboardingWizard';
import FriendlyErrorAlert from '@/components/ui/FriendlyErrorAlert';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getFriendlyErrorMessage, getOperationSpecificError, ErrorTypes } from '@/utils/errorHandler';

interface AdminUserFormData {
  email: string;
  full_name: string;
  password?: string;
  role: 'admin' | 'agent';
  phone?: string;
  department?: string;
  permissions: string[];
  company_access?: string[];
  notes?: string;
}

const CreateAdminUser = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (data: AdminUserFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Create the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: data.email,
        password: data.password || undefined, // Let Supabase generate if not provided
        email_confirm: true, // Auto-confirm email for admin users
        user_metadata: {
          full_name: data.full_name,
          role: data.role,
          department: data.department,
          phone: data.phone
        }
      });

      if (authError) {
        console.error('Auth error:', authError);
        setError(getOperationSpecificError(authError, ErrorTypes.USER_CREATION));
        return;
      }

      if (!authData.user) {
        setError({ title: 'Creation Failed', message: 'Failed to create user account', type: 'error' });
        return;
      }

      // Create user profile in the database
      const { data: profileData, error: profileError } = await (supabase as any)
        .from('user_profiles')
        .insert({
          user_id: authData.user.id,
          role: data.role,
          full_name: data.full_name,
          phone: data.phone,
          preferences: {
            department: data.department,
            permissions: data.permissions,
            company_access: data.company_access || [],
            notes: data.notes
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (profileError) {
        console.error('Profile error:', profileError);
        // Try to clean up the auth user if profile creation fails
        await supabase.auth.admin.deleteUser(authData.user.id);
        setError(getOperationSpecificError(profileError, ErrorTypes.USER_CREATION));
        return;
      }

      console.log('Admin user created successfully:', { auth: authData, profile: profileData });
      setSuccess('Admin user created successfully! Redirecting...');
      
      // Redirect to user management page after successful creation
      setTimeout(() => {
        navigate('/user-management');
      }, 2000);

    } catch (err: any) {
      console.error('Unexpected error:', err);
      setError(getOperationSpecificError(err, ErrorTypes.USER_CREATION));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/user-management');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button 
              variant="ghost" 
              onClick={handleCancel}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to User Management
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Create New Admin User</h1>
              <p className="text-sm text-gray-500">Add a new administrator or agent to your team</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <FriendlyErrorAlert error={error} />
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <AdminUserOnboardingWizard
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default CreateAdminUser;
