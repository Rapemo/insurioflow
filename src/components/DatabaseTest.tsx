import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const DatabaseTest = () => {
  const [status, setStatus] = useState<string>('Testing connection...');
  const [error, setError] = useState<string | null>(null);
  const [userProfiles, setUserProfiles] = useState<any[]>([]);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test basic connection
        const { data, error } = await supabase
          .from('user_profiles')
          .select('id, role, full_name, created_at')
          .limit(5);

        if (error) {
          setError(`Database error: ${error.message}`);
          setStatus('Connection failed');
        } else {
          setStatus('Connected successfully');
          setUserProfiles(data || []);
        }
      } catch (err) {
        setError(`Unexpected error: ${err}`);
        setStatus('Connection failed');
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Database Connection Test</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Connection Status:</h3>
        <div className={`p-3 rounded ${status.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {status}
        </div>
        {error && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>

      {userProfiles.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Sample User Profiles:</h3>
          <div className="bg-gray-50 p-4 rounded">
            <pre className="text-sm overflow-auto">
              {JSON.stringify(userProfiles, null, 2)}
            </pre>
          </div>
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Environment Info:</h3>
        <div className="bg-gray-50 p-4 rounded">
          <p><strong>Supabase URL:</strong> {import.meta.env.VITE_SUPABASE_URL}</p>
          <p><strong>Project ID:</strong> {import.meta.env.VITE_SUPABASE_PROJECT_ID}</p>
          <p><strong>Has Anon Key:</strong> {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Yes' : 'No'}</p>
        </div>
      </div>
    </div>
  );
};

export default DatabaseTest;
