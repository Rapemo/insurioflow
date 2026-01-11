import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building2, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ConfirmEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('Confirming your email...');

  useEffect(() => {
    const confirmEmail = async () => {
      const token = searchParams.get('token');
      const type = searchParams.get('type');

      if (!token || type !== 'signup') {
        setStatus('error');
        setMessage('Invalid confirmation link');
        return;
      }

      try {
        const { error } = await supabase.auth.verifyOtp({
          token,
          type: 'signup'
        });

        if (error) {
          setStatus('error');
          setMessage(error.message || 'Email confirmation failed');
        } else {
          setStatus('success');
          setMessage('Email confirmed successfully! You can now log in.');
        }
      } catch (err: any) {
        setStatus('error');
        setMessage('An unexpected error occurred during email confirmation');
      }
    };

    confirmEmail();
  }, [searchParams]);

  const handleLogin = () => {
    navigate('/client/login');
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
          <h1 className="text-2xl font-bold text-gray-900">Email Confirmation</h1>
          <p className="text-gray-600 mt-2">Verifying your email address</p>
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
                    <h2 className="text-lg font-semibold text-blue-900">Confirming Email</h2>
                    <p className="text-blue-700 mt-2">{message}</p>
                  </div>
                </>
              )}

              {status === 'success' && (
                <>
                  <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-green-900">Email Confirmed!</h2>
                    <p className="text-green-700 mt-2">{message}</p>
                  </div>
                  <div className="space-y-3">
                    <Button onClick={handleLogin} className="w-full">
                      Go to Login
                    </Button>
                    <p className="text-sm text-gray-600">
                      You can now access your account with your credentials.
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
                    <h2 className="text-lg font-semibold text-red-900">Confirmation Failed</h2>
                    <p className="text-red-700 mt-2">{message}</p>
                  </div>
                  <div className="space-y-3">
                    <Button onClick={handleLogin} variant="outline" className="w-full">
                      Go to Login
                    </Button>
                    <p className="text-sm text-gray-600">
                      If you continue to have issues, please contact support.
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

export default ConfirmEmail;
