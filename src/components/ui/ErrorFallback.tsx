import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw, Wifi, WifiOff, Database, Shield } from 'lucide-react';
import { FriendlyError, getFriendlyErrorMessage } from '@/utils/errorHandler';

interface ErrorFallbackProps {
  error: Error | FriendlyError;
  retry?: () => void;
  reset?: () => void;
  className?: string;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  retry, 
  reset, 
  className = "" 
}) => {
  const friendlyError = 'title' in error ? error : getFriendlyErrorMessage(error);
  
  const getIcon = () => {
    if (friendlyError.title.toLowerCase().includes('network') || 
        friendlyError.title.toLowerCase().includes('connection')) {
      return <WifiOff className="h-4 w-4" />;
    }
    if (friendlyError.title.toLowerCase().includes('database')) {
      return <Database className="h-4 w-4" />;
    }
    if (friendlyError.title.toLowerCase().includes('permission')) {
      return <Shield className="h-4 w-4" />;
    }
    return <AlertTriangle className="h-4 w-4" />;
  };

  return (
    <div className={`min-h-[200px] flex items-center justify-center p-4 ${className}`}>
      <div className="max-w-md w-full space-y-4">
        <Alert variant={friendlyError.type === 'error' ? 'destructive' : 'default'}>
          {getIcon()}
          <AlertDescription>
            <div className="space-y-2">
              <div className="font-semibold">{friendlyError.title}</div>
              <div className="text-sm">{friendlyError.message}</div>
              {friendlyError.action && (
                <div className="text-xs opacity-80 mt-2">
                  <strong>Action:</strong> {friendlyError.action}
                </div>
              )}
            </div>
          </AlertDescription>
        </Alert>
        
        <div className="flex gap-2 flex-wrap">
          {retry && (
            <Button onClick={retry} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
          {reset && (
            <Button onClick={reset} variant="outline" size="sm">
              Reset
            </Button>
          )}
          <Button onClick={() => window.location.reload()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reload Page
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;
