import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { mockCompanies, mockProviders, formatCurrency } from '@/data/mockData';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Building2,
  Users,
  FileText,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
  AlertCircle,
  Check,
} from 'lucide-react';

const steps = [
  { id: 1, name: 'Select Client', icon: Building2 },
  { id: 2, name: 'Census Data', icon: Users },
  { id: 3, name: 'Benefits', icon: FileText },
  { id: 4, name: 'Review & Generate', icon: CheckCircle2 },
];

const benefitOptions = [
  { id: 'medical', name: 'Group Medical', description: 'Inpatient & Outpatient coverage', baseRate: 5000 },
  { id: 'dental', name: 'Dental', description: 'Dental procedures coverage', baseRate: 800 },
  { id: 'vision', name: 'Vision', description: 'Eye care coverage', baseRate: 400 },
  { id: 'life', name: 'Group Life', description: 'Life insurance coverage', baseRate: 1200 },
  { id: 'disability', name: 'Disability', description: 'Income protection', baseRate: 1500 },
  { id: 'wellness', name: 'Wellness', description: 'Preventive care programs', baseRate: 300 },
];

const QuotationWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    companyId: '',
    censusFile: null as File | null,
    employeeCount: 0,
    selectedBenefits: [] as string[],
    selectedProviders: [] as string[],
    coverageLevel: 'standard',
  });

  const selectedCompany = mockCompanies.find((c) => c.id === formData.companyId);
  const insurers = mockProviders.filter((p) => p.type === 'insurer' && p.status === 'active');

  const calculatePremium = () => {
    const count = formData.employeeCount || selectedCompany?.employeeCount || 0;
    const benefitTotal = formData.selectedBenefits.reduce((sum, benefitId) => {
      const benefit = benefitOptions.find((b) => b.id === benefitId);
      return sum + (benefit?.baseRate || 0);
    }, 0);
    const multiplier = formData.coverageLevel === 'premium' ? 1.5 : formData.coverageLevel === 'basic' ? 0.7 : 1;
    return benefitTotal * count * multiplier * 12;
  };

  const handleBenefitToggle = (benefitId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedBenefits: prev.selectedBenefits.includes(benefitId)
        ? prev.selectedBenefits.filter((b) => b !== benefitId)
        : [...prev.selectedBenefits, benefitId],
    }));
  };

  const handleProviderToggle = (providerId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedProviders: prev.selectedProviders.includes(providerId)
        ? prev.selectedProviders.filter((p) => p !== providerId)
        : [...prev.selectedProviders, providerId],
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Select Client Company</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Choose a client from your synced WorkPay companies
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Company</Label>
                <Select
                  value={formData.companyId}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, companyId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCompanies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        <div className="flex items-center gap-2">
                          <span>{company.name}</span>
                          <span className="text-muted-foreground">
                            ({company.employeeCount} employees)
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCompany && (
                <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                  <h4 className="font-medium text-foreground mb-3">Company Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Industry</p>
                      <p className="font-medium">{selectedCompany.industry}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Country</p>
                      <p className="font-medium">{selectedCompany.country}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Employees</p>
                      <p className="font-medium">{selectedCompany.employeeCount}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">WorkPay ID</p>
                      <p className="font-medium font-mono">{selectedCompany.workpayId}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Census Data</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload employee census or use synced WorkPay data
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div
                className="p-6 rounded-xl border-2 border-dashed border-border hover:border-primary/50 cursor-pointer transition-colors text-center"
              >
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="font-medium text-foreground">Upload Census File</p>
                <p className="text-sm text-muted-foreground mt-1">
                  CSV or Excel format
                </p>
              </div>

              <div
                className="p-6 rounded-xl border-2 border-primary bg-primary/5 cursor-pointer transition-colors text-center"
              >
                <Users className="h-10 w-10 mx-auto text-primary mb-3" />
                <p className="font-medium text-foreground">Use WorkPay Data</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedCompany?.employeeCount || 0} employees synced
                </p>
                <Check className="h-5 w-5 mx-auto mt-2 text-primary" />
              </div>
            </div>

            <div className="p-4 rounded-lg bg-info/10 border border-info/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-info shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Census Validation</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    All {selectedCompany?.employeeCount || 0} employees have complete data. 
                    Ready for quotation.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Override Employee Count (Optional)</Label>
              <Input
                type="number"
                placeholder={`Default: ${selectedCompany?.employeeCount || 0}`}
                value={formData.employeeCount || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    employeeCount: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Select Benefits</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Choose the benefits package and coverage level
              </p>
            </div>

            <div className="space-y-2">
              <Label>Coverage Level</Label>
              <Select
                value={formData.coverageLevel}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, coverageLevel: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic (70% of standard)</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="premium">Premium (150% of standard)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Benefits</Label>
              <div className="grid gap-3 md:grid-cols-2">
                {benefitOptions.map((benefit) => (
                  <div
                    key={benefit.id}
                    onClick={() => handleBenefitToggle(benefit.id)}
                    className={cn(
                      'p-4 rounded-lg border cursor-pointer transition-all',
                      formData.selectedBenefits.includes(benefit.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-foreground">{benefit.name}</p>
                        <p className="text-sm text-muted-foreground">{benefit.description}</p>
                        <p className="text-sm font-medium text-primary mt-2">
                          {formatCurrency(benefit.baseRate)}/employee/year
                        </p>
                      </div>
                      <Checkbox
                        checked={formData.selectedBenefits.includes(benefit.id)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Select Providers for Quotes</Label>
              <div className="grid gap-3 md:grid-cols-2">
                {insurers.map((provider) => (
                  <div
                    key={provider.id}
                    onClick={() => handleProviderToggle(provider.id)}
                    className={cn(
                      'p-4 rounded-lg border cursor-pointer transition-all',
                      formData.selectedProviders.includes(provider.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{provider.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {provider.apiEnabled ? '✓ API Enabled' : 'Manual submission'}
                        </p>
                      </div>
                      <Checkbox
                        checked={formData.selectedProviders.includes(provider.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        const estimatedPremium = calculatePremium();
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Review & Generate</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Confirm your selections and generate quotes
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 rounded-lg bg-card border border-border">
                <h4 className="font-medium text-foreground mb-3">Client Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Company</span>
                    <span className="font-medium">{selectedCompany?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Employees</span>
                    <span className="font-medium">
                      {formData.employeeCount || selectedCompany?.employeeCount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Coverage Level</span>
                    <span className="font-medium capitalize">{formData.coverageLevel}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-card border border-border">
                <h4 className="font-medium text-foreground mb-3">Selected Benefits</h4>
                <div className="space-y-1">
                  {formData.selectedBenefits.map((benefitId) => {
                    const benefit = benefitOptions.find((b) => b.id === benefitId);
                    return (
                      <div key={benefitId} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-success" />
                        <span>{benefit?.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-card border border-border">
              <h4 className="font-medium text-foreground mb-3">Selected Providers</h4>
              <div className="flex flex-wrap gap-2">
                {formData.selectedProviders.map((providerId) => {
                  const provider = insurers.find((p) => p.id === providerId);
                  return (
                    <span
                      key={providerId}
                      className="inline-flex items-center px-3 py-1 rounded-full bg-secondary text-sm"
                    >
                      {provider?.name}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-hero text-primary-foreground">
              <h4 className="font-medium mb-2">Estimated Annual Premium</h4>
              <p className="text-4xl font-bold">{formatCurrency(estimatedPremium)}</p>
              <p className="text-sm opacity-80 mt-2">
                Final premium will vary based on provider rates and underwriting
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!formData.companyId;
      case 2:
        return true;
      case 3:
        return formData.selectedBenefits.length > 0 && formData.selectedProviders.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <AppLayout title="New Quotation" subtitle="Create a new insurance quote">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Progress Steps */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'workflow-step-number',
                    currentStep > step.id && 'workflow-step-completed',
                    currentStep === step.id && 'workflow-step-active',
                    currentStep < step.id && 'workflow-step-pending'
                  )}
                >
                  {currentStep > step.id ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={cn(
                    'mt-2 text-xs font-medium hidden sm:block',
                    currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'h-0.5 w-12 sm:w-24 mx-2',
                    currentStep > step.id ? 'bg-primary' : 'bg-border'
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep((prev) => prev - 1)}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep < 4 ? (
            <Button
              onClick={() => setCurrentStep((prev) => prev + 1)}
              disabled={!canProceed()}
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={() => navigate('/quotations')}>
              Generate Quotes
              <CheckCircle2 className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default QuotationWizard;
