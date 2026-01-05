import { AppLayout } from '@/components/layout/AppLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { PipelineChart } from '@/components/dashboard/PipelineChart';
import { RenewalsWidget } from '@/components/dashboard/RenewalsWidget';
import { ClaimsOverview } from '@/components/dashboard/ClaimsOverview';
import { mockStats, formatCurrency } from '@/data/mockData';
import {
  FileCheck,
  DollarSign,
  ClipboardList,
  RefreshCw,
  TrendingUp,
  Users,
} from 'lucide-react';

const Dashboard = () => {
  return (
    <AppLayout title="Dashboard" subtitle="Welcome back, James">
      <div className="space-y-6 animate-fade-in">
        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Active Policies"
            value={mockStats.activePolicies}
            change="+12% from last month"
            changeType="positive"
            icon={FileCheck}
          />
          <StatCard
            title="Total Premium"
            value={formatCurrency(mockStats.totalPremium)}
            change="+8.5% from last month"
            changeType="positive"
            icon={DollarSign}
          />
          <StatCard
            title="Pending Claims"
            value={mockStats.pendingClaims}
            change="5 critical"
            changeType="negative"
            icon={ClipboardList}
          />
          <StatCard
            title="Upcoming Renewals"
            value={mockStats.upcomingRenewals}
            change="Next 30 days"
            changeType="neutral"
            icon={RefreshCw}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            <PipelineChart />
            <div className="grid gap-6 md:grid-cols-2">
              <ClaimsOverview />
              <RenewalsWidget />
            </div>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            <QuickActions />
            <RecentActivity />
          </div>
        </div>

        {/* Additional Stats Row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Open Deals"
            value={mockStats.openDeals}
            change="15 high priority"
            changeType="neutral"
            icon={TrendingUp}
          />
          <StatCard
            title="Monthly Commission"
            value={formatCurrency(mockStats.monthlyCommission)}
            change="+15% from last month"
            changeType="positive"
            icon={DollarSign}
          />
          <StatCard
            title="Loss Ratio"
            value={`${mockStats.lossRatio}%`}
            change="Target: <65%"
            changeType="positive"
            icon={ClipboardList}
          />
          <StatCard
            title="Employees Covered"
            value="4,235"
            change="+156 this month"
            changeType="positive"
            icon={Users}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
