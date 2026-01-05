import { Link } from 'react-router-dom';
import { AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { mockRenewals, formatCurrency, formatDate } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const statusConfig = {
  upcoming: { icon: Clock, color: 'text-info', bg: 'bg-info/10', label: 'Upcoming' },
  in_progress: { icon: AlertCircle, color: 'text-warning', bg: 'bg-warning/10', label: 'In Progress' },
  quoted: { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10', label: 'Quoted' },
  renewed: { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10', label: 'Renewed' },
  lapsed: { icon: AlertCircle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Lapsed' },
};

export function RenewalsWidget() {
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Upcoming Renewals</h3>
        <Link to="/renewals">
          <Button variant="link" size="sm" className="text-primary p-0 h-auto">
            View all
          </Button>
        </Link>
      </div>
      <div className="space-y-3">
        {mockRenewals.slice(0, 3).map((renewal) => {
          const config = statusConfig[renewal.status];
          const StatusIcon = config.icon;
          return (
            <div
              key={renewal.id}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={cn('rounded-lg p-2', config.bg)}>
                  <StatusIcon className={cn('h-4 w-4', config.color)} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{renewal.companyName}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(renewal.renewalDate)} • {renewal.daysUntilRenewal} days
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">
                  {formatCurrency(renewal.currentPremium)}
                </p>
                <span className={cn('status-badge', config.bg, config.color)}>
                  {config.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
