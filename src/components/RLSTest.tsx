import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const RLSTest = () => {
  const [status, setStatus] = useState<string>('Testing RLS policies...');
  const [error, setError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<any[]>([]);

  useEffect(() => {
    const testRLS = async () => {
      const results = [];
      
      try {
        // Test 1: Check if we can read user_profiles
        setStatus('Testing read access to user_profiles...');
        const { data: readData, error: readError } = await supabase
          .from('user_profiles')
          .select('id, role, full_name')
          .limit(1);

        results.push({
          test: 'Read user_profiles',
          success: !readError,
          data: readData,
          error: readError?.message
        });

        // Test 2: Check if we can insert a test profile
        setStatus('Testing insert access to user_profiles...');
        const testProfile = {
          user_id: '00000000-0000-0000-0000-000000000000',
          role: 'admin',
          full_name: 'Test User',
          phone: '123456789',
          preferences: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data: insertData, error: insertError } = await (supabase as any)
          .from('user_profiles')
          .insert(testProfile)
          .select()
          .single();

        results.push({
          test: 'Insert user_profiles',
          success: !insertError,
          data: insertData,
          error: insertError?.message
        });

        // Clean up test data if successful
        if (insertData && !insertError) {
          await (supabase as any)
            .from('user_profiles')
            .delete()
            .eq('user_id', testProfile.user_id);
        }

        // Test 3: Check current user's role
        setStatus('Checking current user role...');
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user) {
          const { data: profileData, error: profileError } = await (supabase as any)
            .from('user_profiles')
            .select('role')
            .eq('user_id', userData.user.id)
            .single();

          results.push({
            test: 'Get current user profile',
            success: !profileError,
            data: profileData,
            error: profileError?.message
          });
        }

        setStatus('RLS testing complete');
        setTestResults(results);

      } catch (err) {
        setError(`Unexpected error: ${err}`);
        setStatus('RLS testing failed');
      }
    };

    testRLS();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">RLS Policy Test</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Test Status:</h3>
        <div className={`p-3 rounded ${status.includes('complete') ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
          {status}
        </div>
        {error && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>

      {testResults.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Test Results:</h3>
          <div className="space-y-3">
            {testResults.map((result, index) => (
              <div key={index} className={`p-4 rounded ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border`}>
                <h4 className="font-semibold">{result.test}</h4>
                <p className="text-sm">Status: {result.success ? '✅ Success' : '❌ Failed'}</p>
                {result.error && <p className="text-sm text-red-600">Error: {result.error}</p>}
                {result.data && (
                  <pre className="text-xs mt-2 bg-gray-50 p-2 rounded">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RLSTest;
