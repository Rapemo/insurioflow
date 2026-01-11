import { useState } from 'react';
import { Building2, LogIn, UserPlus, AlertTriangle } from 'lucide-react';

const MinimalApp = () => {
  const [error, setError] = useState<string>('');

  const handleLogin = () => {
    window.location.href = '/client/login';
  };

  const handleSignup = () => {
    window.location.href = '/client/signup';
  };

  const handleTest = () => {
    window.location.href = '/test';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center space-y-8">
          <div className="flex justify-center mb-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Insurio</h1>
          <p className="text-xl text-gray-600 mb-8">Your complete insurance management solution</p>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 text-red-700">
                <AlertTriangle className="h-5 w-5" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <LogIn className="h-6 w-6 text-primary" />
                <h2 className="text-lg font-semibold">Sign In to Your Account</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Access your client dashboard to manage policies, claims, and more.
              </p>
              <button
                onClick={handleLogin}
                className="w-full flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                <LogIn className="h-5 w-5 mr-2" />
                Sign In
              </button>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <UserPlus className="h-6 w-6 text-green-600" />
                <h2 className="text-lg font-semibold">Create New Account</h2>
              </div>
              <p className="text-gray-600 mb-6">
                New to Insurio? Create an account to get started.
              </p>
              <button
                onClick={handleSignup}
                className="w-full flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Create Account
              </button>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <button
                onClick={handleTest}
                className="w-full flex items-center justify-center px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Test Database Connection
              </button>
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-500">
            <p>© 2024 Insurio. All rights reserved.</p>
            <p className="mt-2">Version: 1.0.0 | Status: Running</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinimalApp;
