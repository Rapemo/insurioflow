import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  User, 
  Mail, 
  Shield, 
  Settings,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Building2,
  Phone,
  MapPin,
  Key
} from 'lucide-react';

interface AdminUserFormData {
  email: string;
  full_name: string;
  password?: string;
  role: 'admin' | 'agent';
  phone?: string;
  department?: string;
  permissions: string[];
  company_access?: string[];
  notes?: string;
}

interface AdminUserOnboardingWizardProps {
  onSubmit: (data: AdminUserFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

const STEPS = [
  { id: 1, title: 'Basic Information', icon: User, description: 'User details' },
  { id: 2, title: 'Role & Permissions', icon: Shield, description: 'Access control' },
  { id: 3, title: 'Contact & Department', icon: Mail, description: 'Contact details' },
  { id: 4, title: 'Review & Create', icon: CheckCircle, description: 'Confirm and submit' }
];

const DEPARTMENTS = [
  'Management',
  'Sales',
  'Underwriting',
  'Claims',
  'Customer Service',
  'IT Support',
  'Finance',
  'Operations',
  'Other'
];

const PERMISSIONS = [
  { id: 'view_clients', label: 'View Clients', description: 'Access client information' },
  { id: 'manage_clients', label: 'Manage Clients', description: 'Create, edit, delete clients' },
  { id: 'view_policies', label: 'View Policies', description: 'Access policy information' },
  { id: 'manage_policies', label: 'Manage Policies', description: 'Create and modify policies' },
  { id: 'view_claims', label: 'View Claims', description: 'Access claim information' },
  { id: 'manage_claims', label: 'Manage Claims', description: 'Process and approve claims' },
  { id: 'view_reports', label: 'View Reports', description: 'Access system reports' },
  { id: 'manage_users', label: 'Manage Users', description: 'Create and manage user accounts' },
  { id: 'system_config', label: 'System Configuration', description: 'Access system settings' },
  { id: 'view_financials', label: 'View Financials', description: 'Access financial data' }
];

const AdminUserOnboardingWizard = ({ 
  onSubmit, 
  onCancel, 
  isLoading = false 
}: AdminUserOnboardingWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<AdminUserFormData>({
    email: '',
    full_name: '',
    password: '',
    role: 'agent',
    phone: '',
    department: '',
    permissions: [],
    company_access: [],
    notes: ''
  });

  const updateFormData = (stepData: Partial<AdminUserFormData>) => {
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

  const togglePermission = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep data={formData} onUpdate={updateFormData} />;
      case 2:
        return <RolePermissionsStep data={formData} onUpdate={updateFormData} onTogglePermission={togglePermission} />;
      case 3:
        return <ContactDepartmentStep data={formData} onUpdate={updateFormData} />;
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
            <User className="h-5 w-5 mr-2" />
            Admin User Onboarding
          </CardTitle>
          <CardDescription>
            Follow these steps to create a new admin user account
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
                  Creating User...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Create Admin User
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
const BasicInfoStep = ({ data, onUpdate }: { data: AdminUserFormData; onUpdate: (data: Partial<AdminUserFormData>) => void }) => {
  const [emailError, setEmailError] = useState<string | null>(null);
  
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError(null);
    return true;
  };

  const handleEmailChange = (email: string) => {
    validateEmail(email);
    onUpdate({ email });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Basic User Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="admin@company.com"
              className={emailError ? 'border-red-500' : ''}
            />
            {emailError && (
              <p className="text-sm text-red-500 mt-1">{emailError}</p>
            )}
          </div>
          <div>
            <Label htmlFor="full_name">Full Name *</Label>
            <Input
              id="full_name"
              value={data.full_name}
              onChange={(e) => onUpdate({ full_name: e.target.value })}
              placeholder="John Doe"
            />
          </div>
          <div>
            <Label htmlFor="password">Password (Optional)</Label>
            <Input
              id="password"
              type="password"
              value={data.password || ''}
              onChange={(e) => onUpdate({ password: e.target.value })}
              placeholder="Leave empty for auto-generated"
            />
            <p className="text-sm text-gray-500 mt-1">
              Leave empty to automatically generate a secure password
            </p>
          </div>
          <div>
            <Label htmlFor="role">Role *</Label>
            <Select 
              value={data.role} 
              onValueChange={(value: 'admin' | 'agent') => onUpdate({ role: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="agent">Agent</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

const RolePermissionsStep = ({ 
  data, 
  onUpdate, 
  onTogglePermission 
}: { 
  data: AdminUserFormData; 
  onUpdate: (data: Partial<AdminUserFormData>) => void;
  onTogglePermission: (permissionId: string) => void;
}) => {
  const rolePermissions = {
    agent: ['view_clients', 'view_policies', 'view_claims', 'view_reports'],
    admin: PERMISSIONS.map(p => p.id)
  };

  const handleRoleChange = (role: 'admin' | 'agent') => {
    onUpdate({ 
      role, 
      permissions: rolePermissions[role] 
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Role & Permissions</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="role">Select Role</Label>
            <Select 
              value={data.role} 
              onValueChange={handleRoleChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="agent">Agent - Limited access</SelectItem>
                <SelectItem value="admin">Admin - Full access</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500 mt-1">
              {data.role === 'admin' 
                ? 'Admin users have full system access and can manage other users'
                : 'Agents have limited access to client and policy information'
              }
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-3">Permissions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {PERMISSIONS.map((permission) => (
                <div key={permission.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <input
                    type="checkbox"
                    id={permission.id}
                    checked={data.permissions.includes(permission.id)}
                    onChange={() => onTogglePermission(permission.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor={permission.id} className="font-medium cursor-pointer">
                      {permission.label}
                    </Label>
                    <p className="text-sm text-gray-500">{permission.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactDepartmentStep = ({ data, onUpdate }: { data: AdminUserFormData; onUpdate: (data: Partial<AdminUserFormData>) => void }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Contact & Department Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={data.phone || ''}
              onChange={(e) => onUpdate({ phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div>
            <Label htmlFor="department">Department</Label>
            <Select 
              value={data.department || ''} 
              onValueChange={(value) => onUpdate({ department: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map(dept => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="mt-4">
          <Label htmlFor="notes">Additional Notes (Optional)</Label>
          <Textarea
            id="notes"
            value={data.notes || ''}
            onChange={(e) => onUpdate({ notes: e.target.value })}
            placeholder="Any additional information about this user..."
            rows={4}
          />
        </div>
      </div>
    </div>
  );
};

const ReviewStep = ({ data }: { data: AdminUserFormData }) => {
  const getPermissionLabels = () => {
    return data.permissions.map(id => {
      const permission = PERMISSIONS.find(p => p.id === id);
      return permission ? permission.label : id;
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Review Admin User Information</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900">Basic Information</h4>
              <div className="mt-2 space-y-1 text-sm">
                <div><strong>Name:</strong> {data.full_name}</div>
                <div><strong>Email:</strong> {data.email}</div>
                <div><strong>Role:</strong> <Badge variant="secondary">{data.role}</Badge></div>
                <div><strong>Password:</strong> {data.password ? 'Set manually' : 'Auto-generated'}</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Contact Information</h4>
              <div className="mt-2 space-y-1 text-sm">
                <div><strong>Phone:</strong> {data.phone || 'Not provided'}</div>
                <div><strong>Department:</strong> {data.department || 'Not specified'}</div>
              </div>
            </div>
            <div className="md:col-span-2">
              <h4 className="font-medium text-gray-900">Permissions</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {getPermissionLabels().map((label, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {label}
                  </Badge>
                ))}
              </div>
            </div>
            {data.notes && (
              <div className="md:col-span-2">
                <h4 className="font-medium text-gray-900">Additional Notes</h4>
                <div className="mt-2 text-sm text-gray-600">{data.notes}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserOnboardingWizard;
