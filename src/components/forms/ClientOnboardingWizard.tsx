import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Users, 
  Globe, 
  Mail, 
  Phone,
  MapPin,
  Settings,
  CheckCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import ClientForm from './ClientForm';

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

interface ClientOnboardingWizardProps {
  onSubmit: (data: ClientFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

const STEPS = [
  { id: 1, title: 'Basic Information', icon: Building2, description: 'Company details' },
  { id: 2, title: 'Contact Information', icon: Mail, description: 'How to reach you' },
  { id: 3, title: 'Integrations', icon: Settings, description: 'External system connections' },
  { id: 4, title: 'Review & Create', icon: CheckCircle, description: 'Confirm and submit' }
];

const ClientOnboardingWizard = ({ 
  onSubmit, 
  onCancel, 
  isLoading = false 
}: ClientOnboardingWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    industry: '',
    employee_count: 0,
    country: 'Kenya',
    status: 'pending',
    workpay_id: '',
    hubspot_id: '',
    contact_email: '',
    contact_phone: '',
    address: ''
  });

  const updateFormData = (stepData: Partial<ClientFormData>) => {
    setFormData(prev => ({ ...prev, ...stepData }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    await onSubmit(formData);
  };

  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep data={formData} onUpdate={updateFormData} />;
      case 2:
        return <ContactInfoStep data={formData} onUpdate={updateFormData} />;
      case 3:
        return <IntegrationsStep data={formData} onUpdate={updateFormData} />;
      case 4:
        return <ReviewStep data={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="h-5 w-5 mr-2" />
            Client Onboarding
          </CardTitle>
          <CardDescription>
            Follow these steps to create a new client account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={progress} className="w-full" />
            <div className="flex justify-between">
              {STEPS.map((step) => {
                const Icon = step.icon;
                const isActive = step.id === currentStep;
                const isCompleted = step.id < currentStep;
                
                return (
                  <div
                    key={step.id}
                    className={`flex flex-col items-center space-y-2 ${
                      isActive ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-gray-400'
                    }`}
                  >
                    <div className={`p-2 rounded-full border-2 ${
                      isActive 
                        ? 'border-primary bg-primary/10' 
                        : isCompleted 
                        ? 'border-green-600 bg-green-50' 
                        : 'border-gray-300'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="text-xs text-center">
                      <div className="font-medium">{step.title}</div>
                      <div className="text-gray-500">{step.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardContent className="pt-6">
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <div>
          {currentStep > 1 && (
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={isLoading}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
          )}
        </div>
        
        <div className="flex space-x-2">
          {onCancel && (
            <Button 
              variant="outline" 
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
          
          {currentStep < STEPS.length ? (
            <Button onClick={handleNext} disabled={isLoading}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Creating Client...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Create Client
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// Step Components
const BasicInfoStep = ({ data, onUpdate }: { data: ClientFormData; onUpdate: (data: Partial<ClientFormData>) => void }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Basic Company Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Company Name *</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={data.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              placeholder="Enter company name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Industry *</label>
            <select
              className="w-full p-2 border rounded-md"
              value={data.industry}
              onChange={(e) => onUpdate({ industry: e.target.value })}
            >
              <option value="">Select industry</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Retail">Retail</option>
              <option value="Education">Education</option>
              <option value="Construction">Construction</option>
              <option value="Transportation">Transportation</option>
              <option value="Hospitality">Hospitality</option>
              <option value="Professional Services">Professional Services</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Number of Employees *</label>
            <input
              type="number"
              min="1"
              className="w-full p-2 border rounded-md"
              value={data.employee_count}
              onChange={(e) => onUpdate({ employee_count: parseInt(e.target.value) || 0 })}
              placeholder="Enter employee count"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Country *</label>
            <select
              className="w-full p-2 border rounded-md"
              value={data.country}
              onChange={(e) => onUpdate({ country: e.target.value })}
            >
              <option value="Kenya">Kenya</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactInfoStep = ({ data, onUpdate }: { data: ClientFormData; onUpdate: (data: Partial<ClientFormData>) => void }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Contact Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded-md"
              value={data.contact_email || ''}
              onChange={(e) => onUpdate({ contact_email: e.target.value })}
              placeholder="contact@company.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Contact Phone</label>
            <input
              type="tel"
              className="w-full p-2 border rounded-md"
              value={data.contact_phone || ''}
              onChange={(e) => onUpdate({ contact_phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Address</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={data.address || ''}
              onChange={(e) => onUpdate({ address: e.target.value })}
              placeholder="123 Business Ave, Suite 100, City, Country"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const IntegrationsStep = ({ data, onUpdate }: { data: ClientFormData; onUpdate: (data: Partial<ClientFormData>) => void }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">External Integrations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">WorkPay ID</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={data.workpay_id || ''}
              onChange={(e) => onUpdate({ workpay_id: e.target.value })}
              placeholder="Enter WorkPay ID (optional)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">HubSpot ID</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={data.hubspot_id || ''}
              onChange={(e) => onUpdate({ hubspot_id: e.target.value })}
              placeholder="Enter HubSpot ID (optional)"
            />
          </div>
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Integration IDs are optional but recommended for seamless data synchronization with external systems.
          </p>
        </div>
      </div>
    </div>
  );
};

const ReviewStep = ({ data }: { data: ClientFormData }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Review Client Information</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900">Basic Information</h4>
              <div className="mt-2 space-y-1 text-sm">
                <div><strong>Name:</strong> {data.name}</div>
                <div><strong>Industry:</strong> {data.industry}</div>
                <div><strong>Employees:</strong> {data.employee_count}</div>
                <div><strong>Country:</strong> {data.country}</div>
                <div><strong>Status:</strong> <Badge variant="secondary">{data.status}</Badge></div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Contact Information</h4>
              <div className="mt-2 space-y-1 text-sm">
                <div><strong>Email:</strong> {data.contact_email || 'Not provided'}</div>
                <div><strong>Phone:</strong> {data.contact_phone || 'Not provided'}</div>
                <div><strong>Address:</strong> {data.address || 'Not provided'}</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Integrations</h4>
              <div className="mt-2 space-y-1 text-sm">
                <div><strong>WorkPay ID:</strong> {data.workpay_id || 'Not provided'}</div>
                <div><strong>HubSpot ID:</strong> {data.hubspot_id || 'Not provided'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientOnboardingWizard;
