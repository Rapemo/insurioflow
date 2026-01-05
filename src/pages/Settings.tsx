import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Settings,
  User,
  Shield,
  Bell,
  Globe,
  Database,
  FileText,
  Zap,
  CreditCard,
  HelpCircle,
  Mail,
  Lock,
  Smartphone,
  Monitor,
  Palette,
  Volume2,
  Wifi,
  Users,
  Building,
  DollarSign,
  Archive,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Info,
} from 'lucide-react';

import { GeneralSettings } from '@/components/settings/GeneralSettings';
import { AccountSettings } from '@/components/settings/AccountSettings';
import { SecuritySettings } from '@/components/settings/SecuritySettings';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { RegionalSettings } from '@/components/settings/RegionalSettings';
import { DatabaseSettings } from '@/components/settings/DatabaseSettings';
import { IntegrationSettings } from '@/components/settings/IntegrationSettings';
import { AutomationSettings } from '@/components/settings/AutomationSettings';
import { BillingSettings } from '@/components/settings/BillingSettings';
import { AppearanceSettings } from '@/components/settings/AppearanceSettings';
import { DataManagementSettings } from '@/components/settings/DataManagementSettings';
import { HelpSettings } from '@/components/settings/HelpSettings';

interface SettingsCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType;
  badge?: string;
  status?: 'healthy' | 'warning' | 'error';
}

const settingsCategories: SettingsCategory[] = [
  {
    id: 'general',
    title: 'General',
    description: 'Basic application settings and preferences',
    icon: Settings,
    component: GeneralSettings,
  },
  {
    id: 'account',
    title: 'Account',
    description: 'User profile and account management',
    icon: User,
    component: AccountSettings,
  },
  {
    id: 'security',
    title: 'Security',
    description: 'Password, authentication, and privacy settings',
    icon: Shield,
    component: SecuritySettings,
    status: 'healthy',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Email, push, and in-app notification preferences',
    icon: Bell,
    component: NotificationSettings,
    badge: '3',
  },
  {
    id: 'regional',
    title: 'Regional',
    description: 'Language, timezone, and regional preferences',
    icon: Globe,
    component: RegionalSettings,
  },
  {
    id: 'database',
    title: 'Database',
    description: 'Database connection and configuration',
    icon: Database,
    component: DatabaseSettings,
    status: 'healthy',
  },
  {
    id: 'integrations',
    title: 'Integrations',
    description: 'Third-party service connections',
    icon: Zap,
    component: IntegrationSettings,
    badge: '2',
  },
  {
    id: 'automation',
    title: 'Automation',
    description: 'Workflow automation and rules',
    icon: Zap,
    component: AutomationSettings,
  },
  {
    id: 'billing',
    title: 'Billing',
    description: 'Subscription, payments, and billing preferences',
    icon: CreditCard,
    component: BillingSettings,
  },
  {
    id: 'appearance',
    title: 'Appearance',
    description: 'Theme, display, and accessibility settings',
    icon: Monitor,
    component: AppearanceSettings,
  },
  {
    id: 'data',
    title: 'Data Management',
    description: 'Import, export, and data retention policies',
    icon: Archive,
    component: DataManagementSettings,
  },
  {
    id: 'help',
    title: 'Help & Support',
    description: 'Documentation, support, and troubleshooting',
    icon: HelpCircle,
    component: HelpSettings,
  },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = settingsCategories.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status?: 'healthy' | 'warning' | 'error') => {
    if (!status) return null;
    
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const ActiveComponent = settingsCategories.find(cat => cat.id === activeTab)?.component || GeneralSettings;

  return (
    <AppLayout 
      title="Settings" 
      subtitle="Manage your application preferences and configuration"
    >
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <div className="relative">
            <Settings className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search settings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
                <CardDescription>
                  Browse different settings categories
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {filteredCategories.map((category) => {
                    const Icon = category.icon;
                    const isActive = activeTab === category.id;
                    
                    return (
                      <button
                        key={category.id}
                        onClick={() => setActiveTab(category.id)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/50 transition-colors ${
                          isActive ? 'bg-primary/10 border-r-2 border-primary' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                          <div>
                            <div className={`font-medium ${isActive ? 'text-primary' : 'text-foreground'}`}>
                              {category.title}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {category.description}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(category.status)}
                          {category.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {category.badge}
                            </Badge>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {(() => {
                        const Icon = settingsCategories.find(cat => cat.id === activeTab)?.icon || Settings;
                        return <Icon className="h-5 w-5" />;
                      })()}
                      {settingsCategories.find(cat => cat.id === activeTab)?.title || 'General'}
                    </CardTitle>
                    <CardDescription>
                      {settingsCategories.find(cat => cat.id === activeTab)?.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {settingsCategories.find(cat => cat.id === activeTab)?.status && (
                      <div className="flex items-center gap-2">
                        {getStatusIcon(settingsCategories.find(cat => cat.id === activeTab)?.status)}
                        <span className="text-sm text-muted-foreground">
                          {settingsCategories.find(cat => cat.id === activeTab)?.status === 'healthy' && 'Connected'}
                          {settingsCategories.find(cat => cat.id === activeTab)?.status === 'warning' && 'Warning'}
                          {settingsCategories.find(cat => cat.id === activeTab)?.status === 'error' && 'Error'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ActiveComponent />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>
              Common settings tasks and utilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="justify-start">
                <Download className="h-4 w-4 mr-2" />
                Export Settings
              </Button>
              <Button variant="outline" className="justify-start">
                <Upload className="h-4 w-4 mr-2" />
                Import Settings
              </Button>
              <Button variant="outline" className="justify-start">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset to Defaults
              </Button>
              <Button variant="outline" className="justify-start">
                <FileText className="h-4 w-4 mr-2" />
                View Documentation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Settings;
