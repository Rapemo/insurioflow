import { useNavigate } from 'react-router-dom';
import { Building2, LogIn, UserPlus, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

const Index = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginMode, setLoginMode] = useState<'auto' | 'client' | 'admin'>('auto');
  
  // Temporarily bypass auth context for testing
  const user = null;
  const authLoading = false;
  const role = null;
  const navigate = useNavigate();

  useEffect(() => {
    // Simplified logic for testing
    if (!authLoading && !user) {
      console.log('Index: Showing landing page (test mode)');
      return;
    }
  }, [user, authLoading, navigate]);

  const handleQuickLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Mock login for testing
      console.log('Mock login attempt:', email);
      setError('Login temporarily disabled for testing');
    } catch (error) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Show loading while auth state is being determined
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show landing page for unauthenticated users
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center space-y-8">
          <div className="flex justify-center mb-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Insurio</h1>
          <p className="text-xl text-gray-600 mb-8">Your complete insurance management solution</p>
          
          {/* Show logout option if user has session but no proper role */}
          {user && (!role || role === null) && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-800">
                    You're logged in as <span className="font-medium">{user.email}</span> but your account isn't properly configured.
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Please log out and try again, or contact an administrator.
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-md text-sm font-medium hover:bg-yellow-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
          
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quick Login Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-4">
                <LogIn className="h-6 w-6 text-primary" />
                <h2 className="text-lg font-semibold">
                  {loginMode === 'auto' ? 'Quick Login' : 
                   loginMode === 'client' ? 'Client Login' : 'Admin Login'}
                </h2>
              </div>
              <p className="text-gray-600 mb-6">
                {loginMode === 'auto' ? 'Enter your credentials and we\'ll direct you to the right portal.' :
                 loginMode === 'client' ? 'Access your client dashboard to manage policies, claims, and more.' :
                 'Access your admin dashboard to manage users and system settings.'}
              </p>
              
              <form onSubmit={handleQuickLogin} className="space-y-4">
                {error && (
                  <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <span className="text-red-700 text-sm">{error}</span>
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={loginMode === 'admin' ? 'admin@example.com' : 'client@example.com'}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors ${
                    loginMode === 'admin' 
                      ? 'bg-gray-900 text-white hover:bg-gray-800' 
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  ) : null}
                  {loginMode === 'auto' ? 'Sign In' :
                   loginMode === 'client' ? 'Client Sign In' : 'Admin Sign In'}
                </button>
              </form>
            </div>

            {/* Manual Options Section */}
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <UserPlus className="h-6 w-6 text-green-600" />
                  <h2 className="text-lg font-semibold">Create New Account</h2>
                </div>
                <p className="text-gray-600 mb-6">
                  New to Insurio? Create a client account to get started.
                </p>
                <button
                  onClick={() => navigate('/client/signup')}
                  className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Create Client Account
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Building2 className="h-6 w-6 text-blue-600" />
                  <h2 className="text-lg font-semibold">Direct Access</h2>
                </div>
                <p className="text-gray-600 mb-6">
                  Go directly to specific login portals.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/client/login')}
                    className="w-full flex items-center justify-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                  >
                    <LogIn className="h-5 w-5 mr-2" />
                    Client Portal
                  </button>
                  <button
                    onClick={() => navigate('/admin/login')}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-600 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    <Building2 className="h-5 w-5 mr-2" />
                    Admin Portal
                  </button>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => navigate('/forgot-password')}
                  className="text-gray-600 hover:text-gray-800 text-sm"
                >
                  Forgot your password?
                </button>
              </div>
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-500">
            <p> 2024 Insurio. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
