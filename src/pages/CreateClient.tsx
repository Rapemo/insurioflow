import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientOnboardingWizard from '@/components/forms/ClientOnboardingWizard';
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

const CreateClient = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (data: ClientFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Insert the new client into the companies table
      const { data: result, error: insertError } = await supabase
        .from('companies')
        .insert({
          name: data.name,
          industry: data.industry,
          employee_count: data.employee_count,
          country: 'Unknown', // Required by types but not used in actual schema
          status: 'pending', // Required by types but not used in actual schema
          workpay_id: data.workpay_id || null,
          hubspot_id: data.hubspot_id || null,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Insert error:', insertError);
        setError(getOperationSpecificError(insertError, ErrorTypes.CLIENT_CREATION));
        return;
      }

      console.log('Client created successfully:', result);
      setSuccess('Client created successfully! Redirecting...');
      
      // Redirect to onboarding complete page after successful creation
      setTimeout(() => {
        navigate(`/clients/onboarding-complete/${result.id}`);
      }, 2000);

    } catch (err: any) {
      console.error('Unexpected error:', err);
      setError(getOperationSpecificError(err, ErrorTypes.CLIENT_CREATION));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/clients');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button 
              variant="ghost" 
              onClick={handleCancel}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Clients
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Create New Client</h1>
              <p className="text-sm text-gray-500">Add a new company to your insurance portfolio</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <FriendlyErrorAlert error={error} />
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <ClientOnboardingWizard
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default CreateClient;
