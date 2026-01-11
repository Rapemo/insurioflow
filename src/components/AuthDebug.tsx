import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const AuthDebug = () => {
  const { user, loading, role, profile } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    setDebugInfo({
      user: user ? {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      } : null,
      loading,
      role,
      profile: profile ? {
        id: profile.id,
        user_id: profile.user_id,
        role: profile.role,
        full_name: profile.full_name
      } : null,
      timestamp: new Date().toISOString()
    });
  }, [user, loading, role, profile]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">Authentication Debug Info</h1>
          
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">Auth State</h2>
              <pre className="text-sm bg-gray-100 p-3 rounded overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">Quick Actions</h2>
              <div className="space-x-4">
                <button
                  onClick={() => window.location.href = '/'}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Go to Homepage
                </button>
                <button
                  onClick={() => window.location.href = '/admin/login'}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Admin Login
                </button>
                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => window.location.href = '/database-users'}
                  className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
                >
                  Database Users
                </button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">Troubleshooting</h2>
              <div className="text-sm space-y-2">
                <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
                <p><strong>User:</strong> {user ? 'Logged in' : 'Not logged in'}</p>
                <p><strong>Role:</strong> {role || 'None'}</p>
                <p><strong>Profile:</strong> {profile ? 'Exists' : 'None'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthDebug;
