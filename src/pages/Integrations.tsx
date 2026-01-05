import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { StatusBadge, getStatusType } from '@/components/ui/status-badge';
import { mockProviders } from '@/data/mockData';
import { cn } from '@/lib/utils';
import {
  Link2,
  Settings,
  RefreshCw,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Upload,
  Download,
} from 'lucide-react';

const integrations = [
  {
    id: 'workpay',
    name: 'WorkPay Core',
    description: 'Employee and company data synchronization',
    status: 'connected',
    lastSync: '2 hours ago',
    logo: '💼',
    type: 'core',
  },
  {
    id: 'hubspot',
    name: 'HubSpot CRM',
    description: 'Sales pipeline and deal management',
    status: 'connected',
    lastSync: '30 minutes ago',
    logo: '🧡',
    type: 'core',
  },
];

const Integrations = () => {
  const insurers = mockProviders.filter((p) => p.type === 'insurer');
  const brokers = mockProviders.filter((p) => p.type === 'broker');

  return (
    <AppLayout title="Integrations" subtitle="Manage external system connections">
      <div className="space-y-8 animate-fade-in">
        {/* Core Integrations */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Core Integrations</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {integrations.map((integration) => (
              <div
                key={integration.id}
                className="stat-card flex items-start justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{integration.logo}</div>
                  <div>
                    <h3 className="font-semibold text-foreground">{integration.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {integration.description}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <StatusBadge status="success" label="Connected" />
                      <span className="text-xs text-muted-foreground">
                        Last sync: {integration.lastSync}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Insurance Providers */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Insurance Providers</h2>
            <Button variant="outline" size="sm">
              <Link2 className="h-4 w-4 mr-2" />
              Add Provider
            </Button>
          </div>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Provider</th>
                  <th>Country</th>
                  <th>Products</th>
                  <th>API Status</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {insurers.map((provider) => (
                  <tr key={provider.id} className="hover:bg-muted/50">
                    <td>
                      <span className="font-medium">{provider.name}</span>
                    </td>
                    <td>{provider.country}</td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {provider.products.slice(0, 2).map((product) => (
                          <span
                            key={product}
                            className="inline-flex items-center px-2 py-0.5 rounded bg-secondary text-xs"
                          >
                            {product}
                          </span>
                        ))}
                        {provider.products.length > 2 && (
                          <span className="text-xs text-muted-foreground">
                            +{provider.products.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        {provider.apiEnabled ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-success" />
                            <span className="text-sm text-success">API Enabled</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Manual</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td>
                      <StatusBadge
                        status={getStatusType(provider.status)}
                        label={provider.status.charAt(0).toUpperCase() + provider.status.slice(1)}
                      />
                    </td>
                    <td>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Brokers */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Broker Partners</h2>
            <Button variant="outline" size="sm">
              <Link2 className="h-4 w-4 mr-2" />
              Add Broker
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {brokers.map((broker) => (
              <div key={broker.id} className="stat-card">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground">{broker.name}</h3>
                  <StatusBadge
                    status={getStatusType(broker.status)}
                    label={broker.status.charAt(0).toUpperCase() + broker.status.slice(1)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">{broker.country}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Products: {broker.products.join(', ')}
                </p>
                <div className="flex items-center gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Portal
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* File-Based Integration */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">File-Based Integration</h2>
          <div className="stat-card">
            <p className="text-muted-foreground mb-4">
              For providers without API integration, use file-based data exchange.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 rounded-lg border border-dashed border-border hover:border-primary/50 cursor-pointer transition-colors text-center">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="font-medium text-foreground">Upload Provider File</p>
                <p className="text-sm text-muted-foreground">
                  Import quotes, policies, or claims data
                </p>
              </div>
              <div className="p-4 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-colors text-center">
                <Download className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="font-medium text-foreground">Export Submission Package</p>
                <p className="text-sm text-muted-foreground">
                  Generate files for manual provider submission
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default Integrations;
