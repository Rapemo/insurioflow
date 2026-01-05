import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/lib/api/types';

const TestConnection = () => {
  const [status, setStatus] = useState('Connecting to Supabase...');
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test connection by getting the server timestamp
        const { data, error } = await supabase.from('companies').select('*').limit(1);
        
        if (error) throw error;
        
        console.log('Supabase connection successful!', { data });
        setStatus('✅ Successfully connected to Supabase!');
        setDetails({
          timestamp: new Date().toLocaleString(),
          url: import.meta.env.VITE_SUPABASE_URL,
        });
      } catch (err: any) {
        console.error('Supabase connection error:', err);
        setError(err.message);
        setStatus('❌ Connection failed');
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-4 border rounded-lg bg-gray-50 mb-6">
      <h2 className="text-lg font-semibold mb-2">Supabase Connection Test</h2>
      <p className={error ? 'text-red-600' : 'text-green-600 font-medium'}>{status}</p>
      
      {details && (
        <div className="mt-3 p-3 bg-white rounded border text-sm">
          <p><strong>Connected to:</strong> {details.url}</p>
          <p><strong>Server time:</strong> {details.timestamp}</p>
        </div>
      )}
      
      {error && (
        <div className="mt-3 p-3 bg-red-50 rounded border border-red-200 text-sm">
          <p className="font-medium text-red-800">Error details:</p>
          <pre className="mt-1 p-2 bg-white rounded overflow-auto">{error}</pre>
          <p className="mt-2 text-sm">
            Please check your <code className="bg-gray-100 px-1 rounded">.env</code> file and ensure your Supabase project is properly configured.
          </p>
        </div>
      )}
    </div>
  );
};

export default TestConnection;
