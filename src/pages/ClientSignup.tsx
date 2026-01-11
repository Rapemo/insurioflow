import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, Eye, EyeOff, UserPlus, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import FriendlyErrorAlert from '@/components/ui/FriendlyErrorAlert';

const ClientSignup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupError, setSignupError] = useState<any>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { signUp, loading } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (signupError) {
      setSignupError(null);
    }
  };

  const validateForm = () => {
    const errors = [];

    // Check required fields
    if (!formData.email) {
      errors.push('Email is required');
    }
    if (!formData.fullName) {
      errors.push('Full name is required');
    }
    if (!formData.password) {
      errors.push('Password is required');
    }
    if (!formData.confirmPassword) {
      errors.push('Password confirmation is required');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.push('Please enter a valid email address');
    }

    // Password validation
    if (formData.password && formData.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    // Password confirmation
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      errors.push('Passwords do not match');
    }

    // Name validation (basic)
    if (formData.fullName && formData.fullName.trim().length < 2) {
      errors.push('Full name must be at least 2 characters long');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);
    setIsSubmitting(true);

    const validation = validateForm();
    
    if (!validation.isValid) {
      setSignupError({
        title: 'Validation Error',
        message: validation.errors[0], // Show first error
        type: 'warning',
        action: 'Please correct the errors and try again.'
      });
      setIsSubmitting(false);
      return;
    }
    
    try {
      const result = await signUp(formData.email, formData.password, formData.fullName);
      
      if (result.success) {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/client/login');
        }, 3000);
      } else {
        setSignupError(result.error);
      }
    } catch (error: any) {
      // Handle unexpected errors
      setSignupError({
        title: 'Signup Failed',
        message: 'An unexpected error occurred during account creation.',
        type: 'error',
        action: 'Please try again or contact support if the problem persists.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/client/login');
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <UserPlus className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-green-900">Account Created Successfully!</h2>
                  <p className="text-green-700 mt-2">
                    Please check your email to verify your account before logging in.
                  </p>
                </div>
                <div className="space-y-3">
                  <Button 
                    onClick={handleBackToLogin}
                    className="w-full"
                  >
                    Go to Login
                  </Button>
                  <p className="text-sm text-gray-600">
                    You will be redirected automatically in a few seconds...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Button 
            variant="ghost" 
            onClick={handleBackToLogin}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Button>
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Building2 className="h-6 w-6" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create Client Account</h1>
          <p className="text-gray-600 mt-2">Join the Insurio client portal</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Create your account to access insurance services
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSignup}>
            <CardContent className="space-y-4">
              {signupError && (
                <div className="mb-4">
                  <FriendlyErrorAlert error={signupError} />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  required
                  disabled={loading || isSubmitting}
                  autoComplete="name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
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
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                    disabled={loading || isSubmitting}
                    minLength={6}
                    autoComplete="new-password"
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
                <p className="text-xs text-gray-500 mt-1">
                  Password must be at least 6 characters long
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    required
                    disabled={loading || isSubmitting}
                    minLength={6}
                    autoComplete="new-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading || isSubmitting}
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
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-3">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading || isSubmitting || !validateForm().isValid}
              >
                {loading || isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Creating Account...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Create Account
                  </div>
                )}
              </Button>
              
              <div className="text-center text-sm text-gray-600">
                <p>Already have an account? 
                  <Link 
                    to="/client/login" 
                    className="text-primary hover:underline ml-1"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ClientSignup;
