import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import FriendlyErrorAlert from '@/components/ui/FriendlyErrorAlert';
import { checkDatabaseTables } from '@/utils/checkTables';
import { getOperationSpecificError, ErrorTypes } from '@/utils/errorHandler';
import { Database, RefreshCw, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface TableStatus {
  [key: string]: boolean;
}

const DatabaseCheck = () => {
  const [tableStatus, setTableStatus] = useState<TableStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const performCheck = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const results = await checkDatabaseTables();
      setTableStatus(results);
    } catch (err: any) {
      setError(getOperationSpecificError(err, ErrorTypes.DATABASE_CONNECTION));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    performCheck();
  }, []);

  if (!tableStatus && !loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Database Tables Check
          </CardTitle>
          <CardDescription>
            Verify that all required database tables exist
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={performCheck} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Check Tables
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Database Tables Status
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={performCheck} 
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardTitle>
        <CardDescription>
          Status of required database tables in Supabase
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {error && (
          <FriendlyErrorAlert error={error} />
        )}
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Checking database tables...</span>
          </div>
        ) : tableStatus && (
          <div className="space-y-3">
            {Object.entries(tableStatus).map(([tableName, exists]) => (
              <div 
                key={tableName}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center">
                  {exists ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 mr-3" />
                  )}
                  <span className="font-medium">{tableName}</span>
                </div>
                <Badge variant={exists ? "default" : "destructive"}>
                  {exists ? "Exists" : "Missing"}
                </Badge>
              </div>
            ))}
            
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Summary:</strong> {Object.values(tableStatus).filter(Boolean).length} of {Object.keys(tableStatus).length} tables exist
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DatabaseCheck;
