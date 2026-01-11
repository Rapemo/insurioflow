import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const QuickFixProfile = () => {
  const { user, loading } = useAuth();
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState('');

  const createProfile = async () => {
    if (!user) {
      setMessage('No user logged in');
      return;
    }

    setCreating(true);
    setMessage('');

    try {
      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (existingProfile) {
        setMessage('Profile already exists!');
        return;
      }

      // Create admin profile
      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          user_id: user.id,
          role: 'admin',
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Admin User',
          phone: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage(`Admin profile created successfully! Role: ${data.role}`);
        // Refresh page to update auth context
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setMessage(`Unexpected error: ${error.message}`);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto mt-20">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">Quick Profile Fix</h1>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-100 rounded">
              <p><strong>User ID:</strong> {user?.id}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Status:</strong> {user ? 'Logged in' : 'Not logged in'}</p>
            </div>

            <button
              onClick={createProfile}
              disabled={creating || !user}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create Admin Profile'}
            </button>

            {message && (
              <div className={`p-3 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {message}
              </div>
            )}

            <div className="pt-4 space-y-2">
              <a href="/dashboard" className="block text-center text-blue-600 hover:underline">
                Go to Dashboard
              </a>
              <a href="/auth-debug" className="block text-center text-gray-600 hover:underline">
                Back to Debug
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickFixProfile;
