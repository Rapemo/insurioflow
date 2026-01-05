import { FileText, Users, ClipboardList, DollarSign, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const activities = [
  {
    id: 1,
    type: 'quote',
    message: 'New quote created for Acme Corporation',
    time: '2 minutes ago',
    icon: FileText,
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
  },
  {
    id: 2,
    type: 'claim',
    message: 'Claim CLM-004 submitted by East Africa Logistics',
    time: '15 minutes ago',
    icon: ClipboardList,
    iconBg: 'bg-warning/10',
    iconColor: 'text-warning',
  },
  {
    id: 3,
    type: 'policy',
    message: 'Policy AAR-2024-00145 renewal quoted',
    time: '1 hour ago',
    icon: CheckCircle2,
    iconBg: 'bg-success/10',
    iconColor: 'text-success',
  },
  {
    id: 4,
    type: 'employee',
    message: '12 new employees synced from WorkPay',
    time: '2 hours ago',
    icon: Users,
    iconBg: 'bg-info/10',
    iconColor: 'text-info',
  },
  {
    id: 5,
    type: 'commission',
    message: 'Commission payment processed - KES 120,000',
    time: '3 hours ago',
    icon: DollarSign,
    iconBg: 'bg-accent/10',
    iconColor: 'text-accent',
  },
];

export function RecentActivity() {
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
        <button className="text-xs text-primary hover:underline">View all</button>
      </div>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className={cn('rounded-lg p-2', activity.iconBg)}>
              <activity.icon className={cn('h-4 w-4', activity.iconColor)} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground truncate">{activity.message}</p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
