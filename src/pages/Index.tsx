import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Building2, LogIn, Settings } from 'lucide-react';
import { useEffect } from 'react';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, role } = useAuth();

  // Handle automatic redirect when user is authenticated
  useEffect(() => {
    if (!authLoading && user && role === 'admin') {
      console.log('Index: Admin authenticated, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [user, authLoading, role, navigate]);

  // Show loading while auth state is being determined
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleAdminLogin = () => {
    navigate('/admin/login');
  };

  const handleCreateAdmin = () => {
    navigate('/create-admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg">
              <Building2 className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Insurio Admin Portal</h1>
          <p className="text-xl text-gray-600 mb-8">Complete insurance management system</p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-center mb-6">Admin Access</h2>
            
            <div className="space-y-4">
              <button
                onClick={handleAdminLogin}
                className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <LogIn className="h-5 w-5 mr-2" />
                Sign In to Admin Portal
              </button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>
              
              <button
                onClick={handleCreateAdmin}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                <Settings className="h-5 w-5 mr-2" />
                Create Admin Account
              </button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Admin Features</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Client and employee management</li>
                <li>• Quotation and policy management</li>
                <li>• Claims processing</li>
                <li>• Sales and commission tracking</li>
                <li>• Reports and analytics</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
