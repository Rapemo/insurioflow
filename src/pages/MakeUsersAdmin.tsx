import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const MakeUsersAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState('');

  const makeUsersAdmin = async () => {
    setLoading(true);
    setError('');
    setResults([]);

    try {
      // Get all auth users
      const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
      
      if (usersError) {
        // Fallback: try direct SQL if admin API not available
        const { data, error } = await supabase.rpc('make_all_users_admin');
        if (error) throw error;
        setResults([{ message: 'All users updated to admin role via RPC' }]);
        return;
      }

      // Process each user
      for (const user of users.users) {
        try {
          // Check if profile exists
          const { data: existingProfile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (existingProfile) {
            // Update existing profile to admin
            const { error: updateError } = await supabase
              .from('user_profiles')
              .update({ 
                role: 'admin', 
                updated_at: new Date().toISOString() 
              })
              .eq('user_id', user.id);

            if (updateError) {
              setResults(prev => [...prev, { 
                email: user.email, 
                error: updateError.message 
              }]);
            } else {
              setResults(prev => [...prev, { 
                email: user.email, 
                success: 'Updated to admin' 
              }]);
            }
          } else {
            // Create new admin profile
            const { error: insertError } = await supabase
              .from('user_profiles')
              .insert({
                user_id: user.id,
                role: 'admin',
                full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Admin User',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });

            if (insertError) {
              setResults(prev => [...prev, { 
                email: user.email, 
                error: insertError.message 
              }]);
            } else {
              setResults(prev => [...prev, { 
                email: user.email, 
                success: 'Created admin profile' 
              }]);
            }
          }
        } catch (err) {
          setResults(prev => [...prev, { 
            email: user.email, 
            error: err.message 
          }]);
        }
      }
    } catch (err) {
      setError(`Failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto mt-20">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">Make All Users Admin</h1>
          <p className="text-gray-600 mb-6">
            This will create admin profiles for all existing users or upgrade existing profiles to admin role.
          </p>

          <button
            onClick={makeUsersAdmin}
            disabled={loading}
            className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 mb-6"
          >
            {loading ? 'Processing...' : 'Make All Users Admin'}
          </button>

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Results:</h3>
              {results.map((result, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded ${
                    result.error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}
                >
                  <strong>{result.email}</strong>: {result.error || result.success}
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 pt-6 border-t">
            <h3 className="font-semibold mb-2">Alternative: SQL Script</h3>
            <p className="text-sm text-gray-600 mb-2">
              You can also run the SQL script directly in Supabase SQL Editor:
            </p>
            <code className="block p-3 bg-gray-100 text-sm rounded">
              -- See make-users-admin.sql file
            </code>
          </div>

          <div className="mt-4">
            <a href="/dashboard" className="text-blue-600 hover:underline">
              Go to Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakeUsersAdmin;
