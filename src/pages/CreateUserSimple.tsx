import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, CheckCircle, User, Mail, Shield, Phone, Building } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import FriendlyErrorAlert from '@/components/ui/FriendlyErrorAlert';
import { getOperationSpecificError, ErrorTypes } from '@/utils/errorHandler';

interface SimpleUserFormData {
  email: string;
  full_name: string;
  password: string;
  role: 'admin' | 'agent' | 'client';
  phone?: string;
  department?: string;
}

const CreateSimpleUser = () => {
  const navigate = useNavigate();
  const { user: currentUser, role: currentRole } = useAuth();
  const [formData, setFormData] = useState<SimpleUserFormData>({
    email: '',
    full_name: '',
    password: '',
    role: 'agent',
    phone: '',
    department: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Check if current user has admin privileges
  if (currentRole !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-red-900">Access Denied</h2>
              <p className="text-red-700">
                You need admin privileges to create new users.
              </p>
              <Button onClick={() => navigate('/client/login')}>
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Create user using regular signUp method (no admin privileges needed)
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
            role: formData.role,
            department: formData.department,
            phone: formData.phone
          }
        }
      });

      if (signUpError) {
        console.error('Sign up error:', signUpError);
        setError(getOperationSpecificError(signUpError, ErrorTypes.USER_CREATION));
        return;
      }

      if (!authData.user) {
        setError({ title: 'Creation Failed', message: 'Failed to create user account', type: 'error' });
        return;
      }

      // Create user profile in database
      const { data: profileData, error: profileError } = await (supabase as any)
        .from('user_profiles')
        .insert({
          user_id: authData.user.id,
          role: formData.role,
          full_name: formData.full_name,
          phone: formData.phone,
          preferences: {
            department: formData.department,
            created_by: currentUser?.id,
            permissions: formData.role === 'admin' ? 
              ['view_clients', 'manage_clients', 'view_policies', 'manage_policies', 'view_claims', 'manage_claims', 'view_reports', 'manage_users', 'system_config', 'view_financials'] :
              ['view_clients', 'view_policies', 'view_claims', 'view_reports']
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (profileError) {
        console.error('Profile error:', profileError);
        // Try to clean up auth user if profile creation fails
        await supabase.auth.admin.deleteUser(authData.user.id).catch(() => {});
        setError(getOperationSpecificError(profileError, ErrorTypes.USER_CREATION));
        return;
      }

      console.log('User created successfully:', { auth: authData, profile: profileData });
      setSuccess(`User ${formData.email} created successfully as ${formData.role}!`);
      
      // Redirect to user management after successful creation
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

  const handleInputChange = (field: keyof SimpleUserFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
              <h1 className="text-xl font-semibold text-gray-900">Create New User</h1>
              <p className="text-sm text-gray-500">Add a new user to your insurance system</p>
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

        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              User Information
            </CardTitle>
            <CardDescription>
              Fill in the user details to create a new account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Basic Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="user@example.com"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      placeholder="John Doe"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Enter secure password"
                      required
                      minLength={6}
                      disabled={isLoading}
                    />
                    <p className="text-sm text-gray-500">
                      Password must be at least 6 characters long
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role *</Label>
                    <Select 
                      value={formData.role} 
                      onValueChange={(value: 'admin' | 'agent' | 'client') => handleInputChange('role', value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client">Client - Limited access</SelectItem>
                        <SelectItem value="agent">Agent - Standard access</SelectItem>
                        <SelectItem value="admin">Admin - Full access</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center">
                  <Building className="h-4 w-4 mr-2" />
                  Additional Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select 
                      value={formData.department || ''} 
                      onValueChange={(value) => handleInputChange('department', value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Management">Management</SelectItem>
                        <SelectItem value="Sales">Sales</SelectItem>
                        <SelectItem value="Underwriting">Underwriting</SelectItem>
                        <SelectItem value="Claims">Claims</SelectItem>
                        <SelectItem value="Customer Service">Customer Service</SelectItem>
                        <SelectItem value="IT Support">IT Support</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Operations">Operations</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Creating User...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Create User
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateSimpleUser;
