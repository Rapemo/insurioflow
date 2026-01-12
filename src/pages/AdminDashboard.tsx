import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { 
  Users, 
  Building2, 
  FileText, 
  TrendingUp, 
  DollarSign,
  Shield,
  Plus,
  ClipboardList,
  RefreshCw,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

  const statCards = [
    {
      title: 'Total Clients',
      value: stats.totalClients,
      icon: Users,
      color: 'text-blue-600',
      change: '+12%',
      changeType: 'positive' as const
    },
    {
      title: 'Active Policies',
      value: stats.activePolicies,
      icon: Shield,
      color: 'text-green-600',
      change: '+8%',
      changeType: 'positive' as const
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-yellow-600',
      change: '+15%',
      changeType: 'positive' as const
    },
    {
      title: 'Pending Claims',
      value: stats.pendingClaims,
      icon: FileText,
      color: 'text-red-600',
      change: '-3%',
      changeType: 'negative' as const
    }
  ];

  const quickActions = [
    {
      title: 'New Quote',
      description: 'Create insurance quotation',
      icon: FileText,
      href: '/quotations/new',
      color: 'bg-primary hover:bg-primary/90'
    },
    {
      title: 'Add Client',
      description: 'Register new client',
      icon: Building2,
      href: '/clients/create',
      color: 'bg-accent hover:bg-accent/90'
    },
    {
      title: 'New Claim',
      description: 'File insurance claim',
      icon: ClipboardList,
      href: '/claims/create',
      color: 'bg-warning hover:bg-warning/90'
    },
    {
      title: 'Sync Data',
      description: 'Synchronize system data',
      icon: RefreshCw,
      href: '#',
      color: 'bg-info hover:bg-info/90'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'quote',
      message: 'New quote created for Acme Corporation',
      time: '2 minutes ago',
      icon: FileText,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary'
    },
    {
      id: 2,
      type: 'claim',
      message: 'Claim CLM-004 submitted by East Africa Logistics',
      time: '15 minutes ago',
      icon: ClipboardList,
      iconBg: 'bg-warning/10',
      iconColor: 'text-warning'
    },
    {
      id: 3,
      type: 'policy',
      message: 'Policy AAR-2024-00145 renewal quoted',
      time: '1 hour ago',
      icon: Shield,
      iconBg: 'bg-success/10',
      iconColor: 'text-success'
    }
  ];

  return (
    <AppLayout 
      title="Dashboard" 
      subtitle="Welcome back, here's what's happening with your business today"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow touch-manipulation">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{stat.title}</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground mt-1 truncate">{stat.value}</p>
                  <p className={`text-xs sm:text-sm font-medium mt-2 ${
                    stat.changeType === 'positive' ? 'text-green-600' : 
                    stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`p-2 sm:p-3 rounded-lg ${stat.color} bg-opacity-10 ml-2 sm:ml-4 flex-shrink-0`}>
                  <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="mb-6 sm:mb-8">
        <CardHeader className="pb-4 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto flex-col gap-2 sm:gap-3 p-3 sm:p-4 hover:shadow-md transition-all touch-manipulation min-h-16"
                onClick={() => {
                  if (action.href !== '#') {
                    window.location.href = action.href;
                  }
                }}
              >
                <action.icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-center">{action.title}</span>
                <span className="text-xs text-muted-foreground text-center hidden sm:block">{action.description}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-4 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3 sm:space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 sm:gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors touch-manipulation">
                <div className={`p-2 rounded-lg ${activity.iconBg} flex-shrink-0`}>
                  <activity.icon className={`h-4 w-4 ${activity.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default AdminDashboard;
