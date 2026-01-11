import { useState, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, Eye, EyeOff, LogIn, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import FriendlyErrorAlert from '@/components/ui/FriendlyErrorAlert';

const ClientLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsSubmitting(true);
    
    // Basic validation
    if (!email || !password) {
      setLoginError({
        title: 'Missing Information',
        message: 'Please enter both email and password.',
        type: 'warning',
        action: 'Fill in all required fields and try again.'
      });
      setIsSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLoginError({
        title: 'Invalid Email',
        message: 'Please enter a valid email address.',
        type: 'warning',
        action: 'Check your email format (e.g., user@example.com).'
      });
      setIsSubmitting(false);
      return;
    }
    
    try {
      const result = await login(email, password);
      
      if (result.success) {
        // Navigate based on user role
        if (result.role === 'admin') {
          navigate('/dashboard');
        } else if (result.role === 'client') {
          navigate('/client/dashboard');
        } else {
          // Default fallback for other roles
          navigate('/client/dashboard');
        }
        return;
      } else {
        setLoginError(result.error);
      }
    } catch (error: any) {
      // Handle unexpected errors
      setLoginError({
        title: 'Login Failed',
        message: 'An unexpected error occurred during login.',
        type: 'error',
        action: 'Please try again or contact support if the problem persists.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = () => {
    // Navigate to sign up page
    navigate('/client/signup');
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
          <h1 className="text-2xl font-bold text-gray-900">Insurio Client Portal</h1>
          <p className="text-gray-600 mt-2">Manage your insurance policies and claims</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Client Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {loginError && (
                <div className="mb-4">
                  <FriendlyErrorAlert error={loginError} />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading || isSubmitting}
                  autoComplete="email"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading || isSubmitting}
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading || isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-3">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading || isSubmitting || !email || !password}
              >
                {loading || isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </div>
                )}
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={handleSignUp}
                disabled={loading}
              >
                <Mail className="h-4 w-4 mr-2" />
                Create Account
              </Button>
              
              <div className="text-center text-sm text-gray-600">
                <p>Need help? Contact your insurance provider.</p>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ClientLogin;
