import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const ConnectionTest = () => {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test basic Supabase connection
        const { data, error } = await supabase.from('companies').select('count').limit(1);
        
        if (error) {
          console.error('Supabase connection error:', error);
          setError(error.message);
          setStatus('error');
        } else {
          console.log('Supabase connection successful');
          setStatus('connected');
        }
      } catch (err: any) {
        console.error('Connection test error:', err);
        setError(err.message);
        setStatus('error');
      }
    };

    testConnection();
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Testing connection...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 p-4">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="text-red-600">
            <svg className="h-16 w-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h1 className="text-2xl font-bold mb-2">Connection Error</h1>
            <p className="text-red-700">Unable to connect to the database</p>
            <p className="text-sm text-red-600 mt-2">{error}</p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Retry Connection
            </button>
            
            <div className="text-xs text-gray-500">
              <p>Please check:</p>
              <ul className="list-disc list-inside mt-1">
                <li>Environment variables are set correctly</li>
                <li>Supabase project is active</li>
                <li>Network connection is stable</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="text-green-600">
          <svg className="h-16 w-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-2xl font-bold mb-2">Connected Successfully</h1>
          <p className="text-green-700">Database connection is working</p>
        </div>
        
        <button
          onClick={() => window.location.href = '/'}
          className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          Go to Application
        </button>
      </div>
    </div>
  );
};

export default ConnectionTest;
