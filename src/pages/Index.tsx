import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Building2, Eye, EyeOff, AlertCircle, LogIn } from 'lucide-react';
import { useState, useEffect } from 'react';

const Index = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginMode, setLoginMode] = useState<'auto' | 'client' | 'admin'>('auto');
  
  const navigate = useNavigate();
  const { user, loading: authLoading, role } = useAuth();

  console.log('Index: Component rendering successfully - stable version');
  console.log('Index: Auth state:', { user: !!user, role, authLoading });

  // Handle automatic redirect when user is authenticated
  useEffect(() => {
    if (!authLoading && user && role) {
      console.log('Index: User authenticated, redirecting based on role:', role);
      if (role === 'admin') {
        navigate('/dashboard');
      } else if (role === 'client') {
        navigate('/client/dashboard');
      }
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

  const handleQuickLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Index: Redirecting to login page for:', email);
      
      // Redirect to appropriate login page based on mode
      if (loginMode === 'client') {
        navigate('/client/login');
      } else if (loginMode === 'admin') {
        navigate('/admin/login');
      } else {
        // Auto mode - try client login first
        navigate('/client/login');
      }
      
    } catch (error) {
      console.error('Index: Unexpected error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDirectNavigation = (path: string) => {
    navigate(path);
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Insurio</h1>
          <p className="text-xl text-gray-600 mb-8">Your complete insurance management solution</p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-center mb-6">Login to Your Account</h2>
            
            {/* Login Mode Selector */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex rounded-lg bg-gray-100 p-1">
                <button
                  onClick={() => setLoginMode('auto')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    loginMode === 'auto' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Smart Login
                </button>
                <button
                  onClick={() => setLoginMode('client')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    loginMode === 'client' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Client Portal
                </button>
                <button
                  onClick={() => setLoginMode('admin')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    loginMode === 'admin' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Admin Portal
                </button>
              </div>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-red-800 font-medium">Login Failed</p>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleQuickLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Signing in...' : `Sign In ${loginMode === 'auto' ? '(Smart)' : loginMode === 'client' ? '(Client)' : '(Admin)'}`}
              </button>
            </form>

            <div className="mt-6 space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button 
                    onClick={() => handleDirectNavigation('/client/signup')}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Sign up
                  </button>
                </p>
              </div>

              <div className="text-center">
                <button 
                  onClick={() => handleDirectNavigation('/forgot-password')}
                  className="text-gray-600 hover:text-gray-800 text-sm"
                >
                  Forgot your password?
                </button>
              </div>
            </div>
          </div>

          {/* Direct Access Options */}
          <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Building2 className="h-6 w-6 text-blue-600" />
              <h2 className="text-lg font-semibold">Direct Access</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Go directly to specific login portals.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => handleDirectNavigation('/client/login')}
                className="w-full flex items-center justify-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                <LogIn className="h-5 w-5 mr-2" />
                Client Portal
              </button>
              <button
                onClick={() => handleDirectNavigation('/admin/login')}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-600 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                <Building2 className="h-5 w-5 mr-2" />
                Admin Portal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
