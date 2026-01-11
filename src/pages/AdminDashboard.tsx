import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { 
  Users, 
  Building2, 
  FileText, 
  TrendingUp, 
  DollarSign,
  Shield,
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalClients: 156,
    activePolicies: 342,
    monthlyRevenue: 48500,
    pendingClaims: 12
  });

  useEffect(() => {
    // TODO: Fetch actual stats from database
    setStats({
      totalClients: 156,
      activePolicies: 342,
      monthlyRevenue: 48500,
      pendingClaims: 12
    });
  }, []);

  return (
    <AppLayout 
      title="Dashboard" 
      subtitle="Welcome back, here's what's happening with your business today"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Clients"
          value={stats.totalClients}
          icon={Users}
          iconColor="text-blue-600"
          change="+12%"
          changeType="positive"
        />
        <StatCard
          title="Active Policies"
          value={stats.activePolicies}
          icon={Shield}
          iconColor="text-green-600"
          change="+8%"
          changeType="positive"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${stats.monthlyRevenue.toLocaleString()}`}
          icon={DollarSign}
          iconColor="text-yellow-600"
          change="+15%"
          changeType="positive"
        />
        <StatCard
          title="Pending Claims"
          value={stats.pendingClaims}
          icon={FileText}
          iconColor="text-red-600"
          change="-3%"
          changeType="negative"
        />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Activity */}
      <RecentActivity />
    </AppLayout>
  );
};

export default AdminDashboard;
