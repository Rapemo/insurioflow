import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import TestConnection from "@/components/TestConnection";
import DatabaseCheck from "@/components/DatabaseCheck";
import TableCreator from "@/components/TableCreator";
import DatabaseMigration from "@/components/DatabaseMigration";
import {
  Settings,
  Globe,
  FileText,
  Zap,
  Shield,
  Users,
  DollarSign,
  Bell,
  Plus,
  Edit,
  Trash2,
  Database,
  X,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

import { getBenefits, addBenefit, updateBenefit, deleteBenefit } from '@/services/benefitService';

const countries = [
  { code: 'KE', name: 'Kenya', currency: 'KES', status: 'active' },
  { code: 'NG', name: 'Nigeria', currency: 'NGN', status: 'active' },
  { code: 'TZ', name: 'Tanzania', currency: 'TZS', status: 'active' },
  { code: 'RW', name: 'Rwanda', currency: 'RWF', status: 'active' },
  { code: 'UG', name: 'Uganda', currency: 'UGX', status: 'inactive' },
];

const automationRules = [
  { id: 1, name: 'Renewal Reminder - 90 Days', trigger: 'Policy expiry in 90 days', action: 'Send email', status: 'active' },
  { id: 2, name: 'Renewal Reminder - 30 Days', trigger: 'Policy expiry in 30 days', action: 'Send email + notify', status: 'active' },
  { id: 3, name: 'New Employee Onboarding', trigger: 'Employee added via WorkPay', action: 'Create enrollment', status: 'active' },
  { id: 4, name: 'Claim Submission Alert', trigger: 'New claim submitted', action: 'Notify ops team', status: 'active' },
  { id: 5, name: 'Commission Calculation', trigger: 'Policy issued', action: 'Calculate commission', status: 'active' },
];

const Configuration = () => {
  const [activeTab, setActiveTab] = useState('benefits');
  const [isAddBenefitOpen, setIsAddBenefitOpen] = useState(false);
  const [isAddCountryOpen, setIsAddCountryOpen] = useState(false);
  const [isAddRuleOpen, setIsAddRuleOpen] = useState(false);
  const [isAddTemplateOpen, setIsAddTemplateOpen] = useState(false);
  const [newBenefit, setNewBenefit] = useState({
    name: '',
    type: 'medical',
    status: 'active'
  });
  const [newCountry, setNewCountry] = useState({
    name: '',
    code: '',
    currency: '',
    status: 'active'
  });
  const [newRule, setNewRule] = useState({
    name: '',
    trigger: '',
    action: '',
    status: 'active'
  });
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    type: 'PDF',
    category: ''
  });
  const [benefits, setBenefits] = useState<Array<{
    id: string;
    name: string;
    type: string;
    status: 'active' | 'inactive';
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBenefits = async () => {
      try {
        setLoading(true);
        const { data, error } = await getBenefits();
        
        if (error) {
          setError(error.message);
          return;
        }

        if (data) {
          setBenefits(data);
        }
      } catch (err) {
        setError('Failed to load benefits');
        console.error('Error fetching benefits:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBenefits();
  }, []);

  return (
    <AppLayout title="Configuration" subtitle="Platform settings and administration">
      <div className="animate-fade-in">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="benefits" className="data-[state=active]:bg-background">
              <FileText className="h-4 w-4 mr-2" />
              Benefits Catalog
            </TabsTrigger>
            <TabsTrigger value="countries" className="data-[state=active]:bg-background">
              <Globe className="h-4 w-4 mr-2" />
              Countries
            </TabsTrigger>
            <TabsTrigger value="automation" className="data-[state=active]:bg-background">
              <Zap className="h-4 w-4 mr-2" />
              Automation
            </TabsTrigger>
            <TabsTrigger value="commissions" className="data-[state=active]:bg-background">
              <DollarSign className="h-4 w-4 mr-2" />
              Commissions
            </TabsTrigger>
            <TabsTrigger value="templates" className="data-[state=active]:bg-background">
              <FileText className="h-4 w-4 mr-2" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="database" className="data-[state=active]:bg-background">
              <Database className="h-4 w-4 mr-2" />
              Database
            </TabsTrigger>
          </TabsList>

          {/* Benefits Catalog */}
          <TabsContent value="benefits" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Benefits Catalog</h3>
                <p className="text-sm text-muted-foreground">
                  Configure available insurance products and benefits
                </p>
              </div>
              <Button size="sm" onClick={() => setIsAddBenefitOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Benefit
              </Button>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {benefits.map((benefit) => (
                    <tr key={benefit.id} className="hover:bg-muted/50">
                      <td className="font-medium">{benefit.name}</td>
                      <td>
                        <span className="inline-flex items-center px-2 py-1 rounded bg-secondary text-xs">
                          {benefit.type}
                        </span>
                      </td>
                      <td>
                        <Switch checked={benefit.status === 'active'} />
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Countries */}
          <TabsContent value="countries" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Country Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Configure supported countries and regional settings
                </p>
              </div>
              <Button size="sm" onClick={() => setIsAddCountryOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Country
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {countries.map((country) => (
                <div key={country.code} className="stat-card">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {country.code === 'KE' && '🇰🇪'}
                        {country.code === 'NG' && '🇳🇬'}
                        {country.code === 'TZ' && '🇹🇿'}
                        {country.code === 'RW' && '🇷🇼'}
                        {country.code === 'UG' && '🇺🇬'}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{country.name}</p>
                        <p className="text-xs text-muted-foreground">{country.currency}</p>
                      </div>
                    </div>
                    <Switch checked={country.status === 'active'} />
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Automation */}
          <TabsContent value="automation" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Automation Rules</h3>
                <p className="text-sm text-muted-foreground">
                  Configure automated workflows and notifications
                </p>
              </div>
              <Button size="sm" onClick={() => setIsAddRuleOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Rule
              </Button>
            </div>

            <div className="space-y-4">
              {automationRules.map((rule) => (
                <div
                  key={rule.id}
                  className="stat-card flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{rule.name}</p>
                      <p className="text-sm text-muted-foreground">
                        When: {rule.trigger} → {rule.action}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch checked={rule.status === 'active'} />
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Commission Rules */}
          <TabsContent value="commissions" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Commission Rules</h3>
                <p className="text-sm text-muted-foreground">
                  Configure commission rates and calculation rules
                </p>
              </div>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Rule
              </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="stat-card">
                <h4 className="font-medium text-foreground mb-4">Default Commission Rates</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Internal Sales</Label>
                    <div className="flex items-center gap-2">
                      <Input type="number" defaultValue="5" className="w-20 text-right" />
                      <span className="text-muted-foreground">%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Broker Deals</Label>
                    <div className="flex items-center gap-2">
                      <Input type="number" defaultValue="4" className="w-20 text-right" />
                      <span className="text-muted-foreground">%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Renewal Commission</Label>
                    <div className="flex items-center gap-2">
                      <Input type="number" defaultValue="3" className="w-20 text-right" />
                      <span className="text-muted-foreground">%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <h4 className="font-medium text-foreground mb-4">Calculation Settings</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-Calculate on Policy Issue</Label>
                      <p className="text-xs text-muted-foreground">
                        Automatically calculate commission when policy is issued
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Require Approval for Payout</Label>
                      <p className="text-xs text-muted-foreground">
                        Commission requires manager approval before payout
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Document Templates */}
          <TabsContent value="templates" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Document Templates</h3>
                <p className="text-sm text-muted-foreground">
                  Manage templates for quotes, policies, and communications
                </p>
              </div>
              <Button size="sm" onClick={() => setIsAddTemplateOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Template
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                { name: 'Quote Proposal', type: 'PDF', category: 'Quotation' },
                { name: 'Policy Certificate', type: 'PDF', category: 'Policy' },
                { name: 'Renewal Notice', type: 'Email', category: 'Renewal' },
                { name: 'Welcome Email', type: 'Email', category: 'Onboarding' },
                { name: 'Claim Form', type: 'PDF', category: 'Claims' },
                { name: 'Commission Statement', type: 'PDF', category: 'Finance' },
              ].map((template, index) => (
                <div key={index} className="stat-card">
                  <div className="flex items-center justify-between mb-3">
                    <FileText className="h-8 w-8 text-primary" />
                    <span className="text-xs px-2 py-1 rounded bg-secondary">
                      {template.type}
                    </span>
                  </div>
                  <h4 className="font-medium text-foreground">{template.name}</h4>
                  <p className="text-xs text-muted-foreground">{template.category}</p>
                  <div className="flex items-center gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Database Configuration */}
          <TabsContent value="database" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Database Configuration</h3>
                <p className="text-sm text-muted-foreground">
                  Manage Supabase database connection, schema, and migrations
                </p>
              </div>
            </div>

            {/* Database Status */}
            <div className="grid gap-6 lg:grid-cols-2">
              <TestConnection />
              <DatabaseCheck />
            </div>

            {/* Table Creation */}
            <TableCreator />

            {/* Database Migration */}
            <DatabaseMigration />
          </TabsContent>
        </Tabs>

        {/* Add Benefit Dialog */}
        <Dialog open={isAddBenefitOpen} onOpenChange={setIsAddBenefitOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Benefit</DialogTitle>
              <DialogDescription>
                Fill in the details for the new benefit.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newBenefit.name}
                  onChange={(e) => setNewBenefit({...newBenefit, name: e.target.value})}
                  className="col-span-3"
                  placeholder="Enter benefit name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select
                  value={newBenefit.type}
                  onValueChange={(value) => setNewBenefit({...newBenefit, type: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select benefit type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="dental">Dental</SelectItem>
                    <SelectItem value="vision">Vision</SelectItem>
                    <SelectItem value="life">Life</SelectItem>
                    <SelectItem value="disability">Disability</SelectItem>
                    <SelectItem value="wellness">Wellness</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">
                  Status
                </Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch
                    id="status"
                    checked={newBenefit.status === 'active'}
                    onCheckedChange={(checked) =>
                      setNewBenefit({...newBenefit, status: checked ? 'active' : 'inactive'})
                    }
                  />
                  <Label htmlFor="status">
                    {newBenefit.status === 'active' ? 'Active' : 'Inactive'}
                  </Label>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddBenefitOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  try {
                    const { data, error } = await addBenefit({
                      name: newBenefit.name,
                      type: newBenefit.type,
                      status: newBenefit.status
                    });

                    if (error) {
                      setError(error.message);
                      return;
                    }

                    if (data) {
                      setBenefits([...benefits, {
                        ...data,
                        type: data.type.charAt(0).toUpperCase() + data.type.slice(1)
                      }]);
                      setNewBenefit({ name: '', type: 'medical', status: 'active' });
                      setIsAddBenefitOpen(false);
                    }
                  } catch (err) {
                    setError('Failed to add benefit');
                    console.error('Error adding benefit:', err);
                  }
                }}
                disabled={!newBenefit.name.trim()}
              >
                Add Benefit
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Country Dialog */}
        <Dialog open={isAddCountryOpen} onOpenChange={setIsAddCountryOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Country</DialogTitle>
              <DialogDescription>
                Configure a new supported country
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="country_name" className="text-right">
                  Name
                </Label>
                <Input
                  id="country_name"
                  value={newCountry.name}
                  onChange={(e) => setNewCountry({...newCountry, name: e.target.value})}
                  className="col-span-3"
                  placeholder="Enter country name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="country_code" className="text-right">
                  Code
                </Label>
                <Input
                  id="country_code"
                  value={newCountry.code}
                  onChange={(e) => setNewCountry({...newCountry, code: e.target.value.toUpperCase()})}
                  className="col-span-3"
                  placeholder="Enter country code (e.g., KE)"
                  maxLength={2}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="currency" className="text-right">
                  Currency
                </Label>
                <Input
                  id="currency"
                  value={newCountry.currency}
                  onChange={(e) => setNewCountry({...newCountry, currency: e.target.value.toUpperCase()})}
                  className="col-span-3"
                  placeholder="Enter currency code (e.g., KES)"
                  maxLength={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">
                  Status
                </Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch
                    id="country_status"
                    checked={newCountry.status === 'active'}
                    onCheckedChange={(checked) =>
                      setNewCountry({...newCountry, status: checked ? 'active' : 'inactive'})
                    }
                  />
                  <Label htmlFor="country_status">
                    {newCountry.status === 'active' ? 'Active' : 'Inactive'}
                  </Label>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddCountryOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  toast({
                    title: "Success",
                    description: "Country added successfully"
                  });
                  setNewCountry({ name: '', code: '', currency: '', status: 'active' });
                  setIsAddCountryOpen(false);
                }}
                disabled={!newCountry.name.trim() || !newCountry.code.trim() || !newCountry.currency.trim()}
              >
                Add Country
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Rule Dialog */}
        <Dialog open={isAddRuleOpen} onOpenChange={setIsAddRuleOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Automation Rule</DialogTitle>
              <DialogDescription>
                Create a new automation rule
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rule_name" className="text-right">
                  Name
                </Label>
                <Input
                  id="rule_name"
                  value={newRule.name}
                  onChange={(e) => setNewRule({...newRule, name: e.target.value})}
                  className="col-span-3"
                  placeholder="Enter rule name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="trigger" className="text-right">
                  Trigger
                </Label>
                <Textarea
                  id="trigger"
                  value={newRule.trigger}
                  onChange={(e) => setNewRule({...newRule, trigger: e.target.value})}
                  className="col-span-3"
                  placeholder="Describe the trigger condition"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="action" className="text-right">
                  Action
                </Label>
                <Textarea
                  id="action"
                  value={newRule.action}
                  onChange={(e) => setNewRule({...newRule, action: e.target.value})}
                  className="col-span-3"
                  placeholder="Describe the action to perform"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">
                  Status
                </Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch
                    id="rule_status"
                    checked={newRule.status === 'active'}
                    onCheckedChange={(checked) =>
                      setNewRule({...newRule, status: checked ? 'active' : 'inactive'})
                    }
                  />
                  <Label htmlFor="rule_status">
                    {newRule.status === 'active' ? 'Active' : 'Inactive'}
                  </Label>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddRuleOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  toast({
                    title: "Success",
                    description: "Automation rule added successfully"
                  });
                  setNewRule({ name: '', trigger: '', action: '', status: 'active' });
                  setIsAddRuleOpen(false);
                }}
                disabled={!newRule.name.trim() || !newRule.trigger.trim() || !newRule.action.trim()}
              >
                Add Rule
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Template Dialog */}
        <Dialog open={isAddTemplateOpen} onOpenChange={setIsAddTemplateOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Document Template</DialogTitle>
              <DialogDescription>
                Create a new document template
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="template_name" className="text-right">
                  Name
                </Label>
                <Input
                  id="template_name"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                  className="col-span-3"
                  placeholder="Enter template name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="template_type" className="text-right">
                  Type
                </Label>
                <Select
                  value={newTemplate.type}
                  onValueChange={(value) => setNewTemplate({...newTemplate, type: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select template type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Word">Word</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select
                  value={newTemplate.category}
                  onValueChange={(value) => setNewTemplate({...newTemplate, category: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Quotation">Quotation</SelectItem>
                    <SelectItem value="Policy">Policy</SelectItem>
                    <SelectItem value="Renewal">Renewal</SelectItem>
                    <SelectItem value="Onboarding">Onboarding</SelectItem>
                    <SelectItem value="Claims">Claims</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddTemplateOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  toast({
                    title: "Success",
                    description: "Template added successfully"
                  });
                  setNewTemplate({ name: '', type: 'PDF', category: '' });
                  setIsAddTemplateOpen(false);
                }}
                disabled={!newTemplate.name.trim() || !newTemplate.category.trim()}
              >
                Add Template
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default Configuration;
