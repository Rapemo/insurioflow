import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Info, CheckCircle, AlertCircle } from 'lucide-react';
import { FriendlyError } from '@/utils/errorHandler';

interface FriendlyErrorAlertProps {
  error: FriendlyError | null;
  className?: string;
}

const FriendlyErrorAlert = ({ error, className }: FriendlyErrorAlertProps) => {
  if (!error) return null;

  const getIcon = () => {
    switch (error.type) {
      case 'error':
        return <AlertTriangle className="h-4 w-4" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4" />;
      case 'info':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getVariant = () => {
    switch (error.type) {
      case 'error':
        return 'destructive';
      case 'warning':
        return 'default';
      case 'info':
        return 'default';
      default:
        return 'destructive';
    }
  };

  return (
    <Alert variant={getVariant()} className={className}>
      {getIcon()}
      <AlertDescription>
        <div className="space-y-2">
          <div className="font-semibold">{error.title}</div>
          <div className="text-sm">{error.message}</div>
          {error.action && (
            <div className="text-xs opacity-80 mt-2">
              <strong>Action:</strong> {error.action}
            </div>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default FriendlyErrorAlert;
