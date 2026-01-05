import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { createMissingTables } from '@/utils/createTables';
import { Database, Copy, ExternalLink, CheckCircle, FileText } from 'lucide-react';

interface TableCreationResult {
  tables: { name: string; sql: string }[];
  message: string;
  migrationFile: string;
}

const TableCreator = () => {
  const [creationResults, setCreationResults] = useState<TableCreationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generateTableSQL = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const results = await createMissingTables();
      setCreationResults(results);
    } catch (err: any) {
      setError(err.message || 'Failed to generate table SQL');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (creationResults) {
      const fullSQL = creationResults.tables.map(table => table.sql).join('\n\n');
      navigator.clipboard.writeText(fullSQL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openSupabaseSQL = () => {
    window.open('https://supabase.com/dashboard/project/zberkdnwjkzqjfvzgxkv/sql', '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="h-5 w-5 mr-2" />
          Create Missing Tables
        </CardTitle>
        <CardDescription>
          Generate SQL statements to create the missing database tables
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Missing Tables:</h4>
            <ul className="text-sm space-y-1">
              <li>• commissions - Track commission payments and status</li>
              <li>• deals - Manage sales deals and pipeline</li>
              <li>• renewals - Handle policy renewals</li>
              <li>• providers - Manage insurance providers</li>
            </ul>
          </div>

          <Button 
            onClick={generateTableSQL} 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Generating SQL...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Generate Table SQL
              </>
            )}
          </Button>

          {creationResults && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Instructions:</strong> Copy the SQL below and run it in the Supabase SQL Editor.
                </p>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={copyToClipboard}
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  {copied ? 'Copied!' : 'Copy SQL'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={openSupabaseSQL}
                  className="flex-1"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Supabase SQL
                </Button>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Generated Tables:</h4>
                {creationResults.tables.map((table) => (
                  <div 
                    key={table.name}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                      <span className="font-medium">{table.name}</span>
                    </div>
                    <Badge variant="default">
                      Ready
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-gray-100 rounded-lg">
                <p className="text-xs text-gray-600">
                  <strong>Migration file:</strong> {creationResults.migrationFile}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TableCreator;
