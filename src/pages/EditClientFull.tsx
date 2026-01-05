import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ClientForm from '@/components/forms/ClientForm';
import FriendlyErrorAlert from '@/components/ui/FriendlyErrorAlert';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getFriendlyErrorMessage, getOperationSpecificError, ErrorTypes } from '@/utils/errorHandler';

interface ClientFormData {
  name: string;
  industry: string;
  employee_count: number;
  country: string;
  status: 'active' | 'pending' | 'inactive';
  workpay_id?: string;
  hubspot_id?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
}

const EditClient = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [clientData, setClientData] = useState<ClientFormData | null>(null);

  useEffect(() => {
    if (id) {
      fetchClientData(id);
    }
  }, [id]);

  const fetchClientData = async (clientId: string) => {
    try {
      setFetchLoading(true);
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', clientId)
        .single();

      if (error) {
        setError(getOperationSpecificError(error, ErrorTypes.DATABASE_CONNECTION));
        return;
      }

      if (data) {
        setClientData({
          name: data.name,
          industry: data.industry,
          employee_count: data.employee_count,
          country: data.country || 'Unknown',
          status: (data.status || 'pending') as 'active' | 'pending' | 'inactive',
          workpay_id: data.workpay_id || undefined,
          hubspot_id: data.hubspot_id || undefined,
        });
      }
    } catch (err: any) {
      setError(getOperationSpecificError(err, ErrorTypes.DATABASE_CONNECTION));
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (data: ClientFormData) => {
    if (!id) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { data: result, error: updateError } = await supabase
        .from('companies')
        .update({
          name: data.name,
          industry: data.industry,
          employee_count: data.employee_count,
          country: data.country,
          status: data.status,
          workpay_id: data.workpay_id || null,
          hubspot_id: data.hubspot_id || null,
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        setError(getOperationSpecificError(updateError, ErrorTypes.DATABASE_CONNECTION));
        return;
      }

      setSuccess('Client updated successfully!');
      console.log('Client updated:', result);

      setTimeout(() => {
        navigate('/clients');
      }, 2000);

    } catch (err: any) {
      setError(getOperationSpecificError(err, ErrorTypes.DATABASE_CONNECTION));
    } finally {
      setIsLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading client data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!clientData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Client not found</h2>
          <Button onClick={() => navigate('/clients')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Clients
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Button
            onClick={() => navigate('/clients')}
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Clients
          </Button>
          
          <h1 className="text-3xl font-bold text-foreground">Edit Client</h1>
          <p className="text-muted-foreground mt-2">
            Update client information and details
          </p>
        </div>

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <div className="mb-6">
            <FriendlyErrorAlert error={error} />
          </div>
        )}

        <div className="bg-card rounded-xl border border-border shadow-sm p-6">
          <ClientForm
            initialData={clientData}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default EditClient;
