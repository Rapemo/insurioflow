import { Link } from 'react-router-dom';
import { 
  Plus, 
  FileText, 
  Users, 
  ClipboardList,
  RefreshCw,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const actions = [
  { label: 'New Quote', href: '/quotations/new', icon: FileText, color: 'bg-primary hover:bg-primary/90' },
  { label: 'Add Client', href: '/clients/new', icon: Building2, color: 'bg-accent hover:bg-accent/90' },
  { label: 'New Claim', href: '/claims/new', icon: ClipboardList, color: 'bg-warning hover:bg-warning/90' },
  { label: 'Sync Data', href: '#', icon: RefreshCw, color: 'bg-info hover:bg-info/90' },
];

export function QuickActions() {
  return (
    <div className="stat-card">
      <h3 className="text-sm font-semibold text-foreground mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Link key={action.label} to={action.href}>
            <Button
              variant="secondary"
              className="w-full h-auto flex-col gap-2 py-4 hover:shadow-md transition-all"
            >
              <action.icon className="h-5 w-5 text-primary" />
              <span className="text-xs font-medium">{action.label}</span>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
