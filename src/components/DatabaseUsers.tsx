import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  user_id: string;
  role: 'client' | 'admin' | 'agent';
  full_name?: string;
  company_id?: string;
  created_at: string;
}

const DatabaseUsers = () => {
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');

      // Note: We cannot directly access auth.users table with client key
      // We can only access user_profiles table
      
      // Fetch user profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select(`
          id,
          user_id,
          role,
          full_name,
          company_id,
          created_at
        `);

      if (profilesError) {
        setError(`Profile error: ${profilesError.message}`);
        console.error('Profiles error:', profilesError);
      } else {
        setUserProfiles(profiles || []);
        console.log('User profiles found:', profiles?.length);
      }

    } catch (error: any) {
      setError(`Error: ${error.message}`);
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProfile = async (profileId: string) => {
    if (!confirm('Are you sure you want to delete this user profile?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', profileId);

      if (error) {
        alert(`Delete error: ${error.message}`);
      } else {
        fetchUsers(); // Refresh the list
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold mb-6">Database Users</h1>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Profiles */}
            <div>
              <h2 className="text-lg font-semibold mb-4">User Profiles ({userProfiles.length})</h2>
              <div className="space-y-3">
                {userProfiles.map((profile) => (
                  <div key={profile.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium">{profile.full_name || 'No name'}</p>
                        <p className="text-sm text-gray-600">Role: {profile.role}</p>
                        <p className="text-sm text-gray-500">User ID: {profile.user_id}</p>
                        <p className="text-xs text-gray-400">Created: {new Date(profile.created_at).toLocaleString()}</p>
                      </div>
                      <button
                        onClick={() => deleteProfile(profile.id)}
                        className="ml-4 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {userProfiles.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No user profiles found</p>
                )}
              </div>
            </div>

            {/* Auth Users Info */}
            <div>
              <h2 className="text-lg font-semibold mb-4">System Info</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium mb-2">Note:</h3>
                <p className="text-sm text-blue-700">
                  Direct access to auth.users table requires service role permissions. 
                  User profiles show all users with assigned roles.
                </p>
                <div className="mt-4 space-y-2">
                  <p className="text-sm"><strong>Total Profiles:</strong> {userProfiles.length}</p>
                  <p className="text-sm"><strong>Admin Users:</strong> {userProfiles.filter(p => p.role === 'admin').length}</p>
                  <p className="text-sm"><strong>Client Users:</strong> {userProfiles.filter(p => p.role === 'client').length}</p>
                  <p className="text-sm"><strong>Agent Users:</strong> {userProfiles.filter(p => p.role === 'agent').length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex space-x-4">
            <button
              onClick={fetchUsers}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Refresh
            </button>
            <a
              href="/create-admin"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Create Admin User
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseUsers;
