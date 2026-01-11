import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building2, CheckCircle, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'form' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('Verifying reset token...');
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    const type = searchParams.get('type');

    if (!token || type !== 'recovery') {
      setStatus('error');
      setMessage('Invalid password reset link');
    } else {
      setStatus('form');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password.length < 6) {
      setMessage('Password must be at least 6 characters long');
      setStatus('error');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      setStatus('error');
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.password
      });

      if (error) {
        setStatus('error');
        setMessage(error.message || 'Failed to reset password');
      } else {
        setStatus('success');
        setMessage('Password reset successfully! You can now log in with your new password.');
      }
    } catch (err: any) {
      setStatus('error');
      setMessage('An unexpected error occurred while resetting your password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    navigate('/client/login');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Building2 className="h-6 w-6" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
          <p className="text-gray-600 mt-2">Set your new password</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              {status === 'loading' && (
                <>
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-blue-900">Verifying</h2>
                    <p className="text-blue-700 mt-2">{message}</p>
                  </div>
                </>
              )}

              {status === 'form' && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Enter New Password</h2>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter new password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        required
                        minLength={6}
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Password must be at least 6 characters long
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm new password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        required
                        minLength={6}
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="text-xs text-red-500 mt-1">
                        Passwords do not match
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isLoading || !formData.password || !formData.confirmPassword || formData.password !== formData.confirmPassword}
                    >
                      {isLoading ? (
                        <>
                          <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Resetting Password...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Reset Password
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}

              {status === 'success' && (
                <>
                  <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-green-900">Password Reset!</h2>
                    <p className="text-green-700 mt-2">{message}</p>
                  </div>
                  <div className="space-y-3">
                    <Button onClick={handleLogin} className="w-full">
                      Go to Login
                    </Button>
                    <p className="text-sm text-gray-600">
                      You can now access your account with your new password.
                    </p>
                  </div>
                </>
              )}

              {status === 'error' && (
                <>
                  <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-red-900">Reset Failed</h2>
                    <p className="text-red-700 mt-2">{message}</p>
                  </div>
                  <div className="space-y-3">
                    <Button onClick={handleLogin} variant="outline" className="w-full">
                      Go to Login
                    </Button>
                    <p className="text-sm text-gray-600">
                      If you continue to have issues, please request a new password reset.
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
