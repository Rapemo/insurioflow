import { cn } from '@/lib/utils';

type StatusType = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface StatusBadgeProps {
  status: StatusType;
  label: string;
  className?: string;
}

const statusStyles: Record<StatusType, string> = {
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  error: 'bg-destructive/10 text-destructive',
  info: 'bg-info/10 text-info',
  neutral: 'bg-muted text-muted-foreground',
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        statusStyles[status],
        className
      )}
    >
      {label}
    </span>
  );
}

// Helper function to map common statuses
export function getStatusType(status: string): StatusType {
  const successStatuses = ['active', 'approved', 'paid', 'completed', 'renewed', 'closed_won'];
  const warningStatuses = ['pending', 'under_review', 'in_progress', 'negotiation', 'quote', 'quoted'];
  const errorStatuses = ['rejected', 'cancelled', 'expired', 'lapsed', 'closed_lost', 'terminated'];
  const infoStatuses = ['submitted', 'upcoming', 'qualified', 'draft'];

  const lowerStatus = status.toLowerCase();
  
  if (successStatuses.includes(lowerStatus)) return 'success';
  if (warningStatuses.includes(lowerStatus)) return 'warning';
  if (errorStatuses.includes(lowerStatus)) return 'error';
  if (infoStatuses.includes(lowerStatus)) return 'info';
  return 'neutral';
}
