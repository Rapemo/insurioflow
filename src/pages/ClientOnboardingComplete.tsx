import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  ArrowRight, 
  Users, 
  FileText, 
  Settings,
  Mail,
  Calendar,
  Building2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import ClientWelcomeEmail from '@/components/forms/ClientWelcomeEmail';

interface ClientData {
  id: string;
  name: string;
  industry: string;
  employee_count: number;
  country: string;
  status: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  workpay_id?: string;
  hubspot_id?: string;
  created_at: string;
}

const ClientOnboardingComplete = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (id) {
      fetchClientData(id);
    }
  }, [id]);

  const fetchClientData = async (clientId: string) => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', clientId)
        .single();

      if (error) throw error;
      setClient(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSent = () => {
    setEmailSent(true);
  };

  const nextSteps = [
    {
      title: 'Schedule Initial Consultation',
      description: 'Book a meeting with the client to understand their insurance needs',
      icon: Calendar,
      action: 'Schedule Meeting'
    },
    {
      title: 'Complete Risk Assessment',
      description: 'Conduct a thorough assessment of the client\'s insurance requirements',
      icon: FileText,
      action: 'Start Assessment'
    },
    {
      title: 'Set Up Client Portal Access',
      description: 'Create login credentials for the client portal',
      icon: Users,
      action: 'Create Access'
    },
    {
      title: 'Configure Integrations',
      description: 'Set up WorkPay and HubSpot integrations if applicable',
      icon: Settings,
      action: 'Configure'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="text-red-600">Error: {error || 'Client not found'}</div>
              <Button onClick={() => navigate('/clients')}>
                Back to Clients
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/clients')}
              className="mr-4"
            >
              <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
              Back to Clients
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Client Onboarding Complete</h1>
              <p className="text-sm text-gray-500">Successfully created new client account</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Success Message */}
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <h2 className="text-lg font-medium text-green-900">Client Successfully Created!</h2>
                    <p className="text-green-700">
                      {client.name} has been added to your client portfolio and is ready for onboarding.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Client Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Client Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Company Name</span>
                      <p className="font-medium">{client.name}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Industry</span>
                      <p>{client.industry}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Employee Count</span>
                      <p>{client.employee_count}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Country</span>
                      <p>{client.country}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Status</span>
                      <Badge variant="secondary">{client.status}</Badge>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Created</span>
                      <p>{new Date(client.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                
                {(client.contact_email || client.contact_phone || client.address) && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium mb-2">Contact Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      {client.contact_email && (
                        <div>
                          <span className="text-gray-500">Email:</span> {client.contact_email}
                        </div>
                      )}
                      {client.contact_phone && (
                        <div>
                          <span className="text-gray-500">Phone:</span> {client.contact_phone}
                        </div>
                      )}
                      {client.address && (
                        <div className="md:col-span-2">
                          <span className="text-gray-500">Address:</span> {client.address}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {(client.workpay_id || client.hubspot_id) && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium mb-2">Integrations</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      {client.workpay_id && (
                        <div>
                          <span className="text-gray-500">WorkPay ID:</span> {client.workpay_id}
                        </div>
                      )}
                      {client.hubspot_id && (
                        <div>
                          <span className="text-gray-500">HubSpot ID:</span> {client.hubspot_id}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
                <CardDescription>
                  Complete these tasks to finish the client onboarding process
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {nextSteps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-full">
                            <Icon className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{step.title}</h4>
                            <p className="text-sm text-gray-500">{step.description}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          {step.action}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full" 
                  onClick={() => navigate(`/clients/${client.id}/edit`)}
                >
                  Edit Client Information
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/quotations/new')}
                >
                  Create Quotation
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/policies')}
                >
                  View Policies
                </Button>
              </CardContent>
            </Card>

            {/* Welcome Email */}
            {!emailSent && (
              <ClientWelcomeEmail
                clientId={client.id}
                clientName={client.name}
                contactEmail={client.contact_email}
                onEmailSent={handleEmailSent}
              />
            )}

            {/* Help Section */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <h4 className="font-medium">Documentation</h4>
                  <p className="text-gray-500">Access our client onboarding guides</p>
                </div>
                <div>
                  <h4 className="font-medium">Support Team</h4>
                  <p className="text-gray-500">Get help from our support specialists</p>
                </div>
                <div>
                  <h4 className="font-medium">Best Practices</h4>
                  <p className="text-gray-500">Learn industry best practices for client onboarding</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientOnboardingComplete;
