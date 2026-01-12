import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, UserPlus, ArrowLeft, CheckCircle } from 'lucide-react';
import AdminUserOnboardingWizard from '@/components/forms/AdminUserOnboardingWizard';
import { supabase } from '@/integrations/supabase/client';
import { createProfileWithServiceKey, hasServiceKey } from '@/utils/rlsBypass';
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
    console.log('🚀 Starting user creation with data:', data);
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      setError({ 
        title: 'Invalid Email', 
        message: 'Please enter a valid email address (e.g., user@domain.com)', 
        type: 'error' 
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('📝 Step 1: Creating user in Supabase Auth...');
      // Step 1: Create user in Supabase Auth with regular signup (not admin API)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email.trim().toLowerCase(), // Normalize email
        password: data.password || Math.random().toString(36).slice(-8), // Generate random password if not provided
        options: {
          data: {
            full_name: data.full_name,
            role: data.role,
            department: data.department,
            phone: data.phone
          }
        }
      });

      console.log('📝 Auth response:', { authData, authError });

      if (authError) {
        console.error('❌ Auth error:', authError);
        
        // Handle specific email errors
        if (authError.message.includes('invalid') || authError.message.includes('email')) {
          setError({ 
            title: 'Invalid Email Address', 
            message: `The email "${data.email}" is not valid. Please use a real email address.`, 
            type: 'error' 
          });
        } else if (authError.message.includes('already registered')) {
          setError({ 
            title: 'Email Already Registered', 
            message: 'An account with this email already exists.', 
            type: 'error' 
          });
        } else {
          setError(getOperationSpecificError(authError, ErrorTypes.USER_CREATION));
        }
        return;
      }

      if (!authData.user) {
        console.error('❌ No user data returned');
        setError({ title: 'Creation Failed', message: 'Failed to create user account', type: 'error' });
        return;
      }

      console.log('✅ User created in auth, ID:', authData.user.id);

      console.log('📝 Step 2: Creating user profile in database...');
      
      // Create user profile immediately after auth creation
      const profileData = {
        user_id: authData.user.id,
        role: data.role,
        full_name: data.full_name,
        phone: data.phone,
        preferences: {
          department: data.department,
          permissions: data.permissions,
          company_access: data.company_access || [],
          notes: data.notes
        }
      };
      
      console.log('📝 Profile data to insert:', profileData);
      
      // Check if service key is available for RLS bypass
      if (hasServiceKey()) {
        console.log('🔑 Using service role key to create profile (RLS bypass)');
        const { data: profileResult, error: profileError } = await createProfileWithServiceKey(profileData);
        
        if (profileError) {
          console.error('❌ Service key profile creation failed:', profileError);
          console.log('⚠️ Continuing without profile - will be created on first login');
        } else {
          console.log('✅ Profile created successfully with service key:', profileResult);
        }
      } else {
        console.log('⚠️ No service key available, using regular client with timeout');
        
        // Try to create profile with timeout
        const profilePromise = (supabase as any)
          .from('user_profiles')
          .insert({
            ...profileData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();
        
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Profile creation timed out')), 5000);
        });
        
        try {
          const { data: profileResult, error: profileError } = await Promise.race([profilePromise, timeoutPromise]) as any;
          
          if (profileError) {
            console.error('❌ Profile creation error:', profileError);
            console.log('⚠️ Continuing without profile - will be created on first login');
          } else {
            console.log('✅ Profile created successfully:', profileResult);
          }
        } catch (timeoutError) {
          console.error('⚠️ Profile creation timed out:', timeoutError);
          console.log('⚠️ Continuing without profile - will be created on first login');
        }
      }
      
      console.log('✅ Admin user created successfully:', { auth: authData });
      setSuccess('Admin user created successfully! They can now log in with their email.');
      
      // Redirect to user management page after successful creation
      setTimeout(() => {
        console.log('🔄 Redirecting to user management...');
        navigate('/user-management');
      }, 2000);

    } catch (err: any) {
      console.error('❌ Unexpected error:', err);
      setError(getOperationSpecificError(err, ErrorTypes.USER_CREATION));
    } finally {
      console.log('🏁 Setting loading to false');
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
          <Alert className="mb-6 border-red-200 bg-red-50">
            <Shield className="h-4 w-4" />
            <AlertDescription className="text-red-800">
              <strong>{error.title}</strong><br />
              {error.message}
            </AlertDescription>
          </Alert>
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
