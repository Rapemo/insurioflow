import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const RoleVerification = () => {
  const { user, loading, role, profile } = useAuth();
  const [dbProfile, setDbProfile] = useState<any>(null);
  const [dbError, setDbError] = useState('');

  useEffect(() => {
    if (user?.id) {
      // Direct database query to verify role
      const checkDatabaseRole = async () => {
        try {
          console.log('Checking database role for user:', user.id);
          
          const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (error) {
            console.error('Database query error:', error);
            setDbError(error.message);
          } else {
            console.log('Database profile found:', data);
            setDbProfile(data);
          }
        } catch (err) {
          console.error('Unexpected error:', err);
          setDbError(err.message);
        }
      };

      checkDatabaseRole();
    }
  }, [user?.id]);

  const refreshAuth = () => {
    window.location.reload();
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
      <div className="max-w-4xl mx-auto mt-10">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">Role Verification Dashboard</h1>
          
          {/* Auth Context State */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 text-blue-600">Auth Context State</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded">
                <p><strong>User ID:</strong> {user?.id || 'Not logged in'}</p>
                <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
                <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
              </div>
              <div className="p-4 bg-green-50 rounded">
                <p><strong>Role:</strong> <span className={`px-2 py-1 rounded text-white ${role === 'admin' ? 'bg-red-600' : role === 'client' ? 'bg-blue-600' : 'bg-gray-600'}`}>{role || 'None'}</span></p>
                <p><strong>Profile ID:</strong> {profile?.id || 'None'}</p>
                <p><strong>Profile Name:</strong> {profile?.full_name || 'None'}</p>
              </div>
            </div>
          </div>

          {/* Direct Database Query */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 text-purple-600">Direct Database Query</h2>
            {dbError ? (
              <div className="p-4 bg-red-100 text-red-700 rounded">
                <strong>Database Error:</strong> {dbError}
              </div>
            ) : dbProfile ? (
              <div className="p-4 bg-purple-50 rounded">
                <p><strong>DB Profile ID:</strong> {dbProfile.id}</p>
                <p><strong>DB User ID:</strong> {dbProfile.user_id}</p>
                <p><strong>DB Role:</strong> <span className={`px-2 py-1 rounded text-white ${dbProfile.role === 'admin' ? 'bg-red-600' : dbProfile.role === 'client' ? 'bg-blue-600' : 'bg-gray-600'}`}>{dbProfile.role}</span></p>
                <p><strong>DB Full Name:</strong> {dbProfile.full_name}</p>
                <p><strong>DB Created:</strong> {new Date(dbProfile.created_at).toLocaleString()}</p>
                <p><strong>DB Updated:</strong> {new Date(dbProfile.updated_at).toLocaleString()}</p>
              </div>
            ) : (
              <div className="p-4 bg-yellow-100 text-yellow-700 rounded">
                No profile found in database
              </div>
            )}
          </div>

          {/* Comparison */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 text-orange-600">Role Comparison</h2>
            <div className="p-4 bg-orange-50 rounded">
              <p><strong>Auth Context Role:</strong> {role || 'None'}</p>
              <p><strong>Database Role:</strong> {dbProfile?.role || 'None'}</p>
              <p><strong>Match:</strong> {role === dbProfile?.role ? 
                <span className="text-green-600 font-bold">✅ YES</span> : 
                <span className="text-red-600 font-bold">❌ NO</span>
              }</p>
            </div>
          </div>

          {/* Actions */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 text-gray-600">Actions</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={refreshAuth}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Refresh Auth State
              </button>
              <button
                onClick={() => window.location.href = '/quick-fix-profile'}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Create Admin Profile
              </button>
              <button
                onClick={() => window.location.href = '/make-users-admin'}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Make All Users Admin
              </button>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Test Dashboard Access
              </button>
            </div>
          </div>

          {/* Console Logs */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-600">Debug Info</h2>
            <div className="p-4 bg-gray-100 rounded text-sm">
              <p>Check browser console for detailed logs:</p>
              <ul className="list-disc list-inside mt-2">
                <li>AuthContext initialization logs</li>
                <li>Profile fetch attempts</li>
                <li>Database query results</li>
                <li>Role assignment process</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleVerification;
