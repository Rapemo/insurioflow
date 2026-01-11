import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const CreateAdminUser = () => {
  const [email, setEmail] = useState('admin@insurio.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const createAdminUser = async () => {
    setLoading(true);
    setMessage('');

    try {
      // Step 1: Try to sign in first (user might already exist)
      const { data: existingUser, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      let userId = existingUser.user?.id;

      if (!userId) {
        // Step 2: If sign in failed, try to create new user
        console.log('User does not exist, creating new user...');
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: 'Admin User'
            }
          }
        });

        if (authError) {
          console.error('Signup error:', authError);
          setMessage(`Signup error: ${authError.message}`);
          return;
        }

        userId = authData.user?.id;
        
        if (!userId) {
          setMessage('User creation failed - no user ID returned');
          return;
        }

        console.log('New user created with ID:', userId);
      } else {
        console.log('Existing user found with ID:', userId);
      }

      // Step 3: Create/update user profile with admin role
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: userId,
          role: 'admin',
          full_name: 'Admin User',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (profileError) {
        console.error('Profile error:', profileError);
        setMessage(`Profile error: ${profileError.message}`);
      } else {
        setMessage('Admin user created/updated successfully!');
      }

    } catch (error: any) {
      console.error('Unexpected error:', error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Create Admin User</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button
            onClick={createAdminUser}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Admin User'}
          </button>
          
          {message && (
            <div className="p-3 bg-gray-100 border border-gray-300 rounded-md text-sm">
              {message}
            </div>
          )}
        </div>
        
        <div className="mt-4 text-xs text-gray-500">
          <p>Default credentials:</p>
          <p>Email: admin@insurio.com</p>
          <p>Password: admin123</p>
        </div>
      </div>
    </div>
  );
};

export default CreateAdminUser;
