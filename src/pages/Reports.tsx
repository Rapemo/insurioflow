import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { mockStats, formatCurrency } from '@/data/mockData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { Download, FileText, Calendar } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const premiumData = [
  { month: 'Jan', premium: 2400000, claims: 1500000 },
  { month: 'Feb', premium: 2600000, claims: 1800000 },
  { month: 'Mar', premium: 2800000, claims: 1600000 },
  { month: 'Apr', premium: 3100000, claims: 2100000 },
  { month: 'May', premium: 3400000, claims: 2000000 },
  { month: 'Jun', premium: 3800000, claims: 2400000 },
];

const productMix = [
  { name: 'Medical', value: 45, color: 'hsl(217, 91%, 60%)' },
  { name: 'Life', value: 25, color: 'hsl(173, 80%, 40%)' },
  { name: 'Disability', value: 15, color: 'hsl(38, 92%, 50%)' },
  { name: 'Dental', value: 10, color: 'hsl(199, 89%, 48%)' },
  { name: 'Vision', value: 5, color: 'hsl(158, 64%, 40%)' },
];

const lossRatioData = [
  { month: 'Jan', ratio: 62 },
  { month: 'Feb', ratio: 69 },
  { month: 'Mar', ratio: 57 },
  { month: 'Apr', ratio: 68 },
  { month: 'May', ratio: 59 },
  { month: 'Jun', ratio: 63 },
];

const providerPerformance = [
  { name: 'AAR Insurance', policies: 45, premium: 12000000 },
  { name: 'Jubilee', policies: 38, premium: 9500000 },
  { name: 'CIC', policies: 32, premium: 8200000 },
  { name: 'Britam', policies: 28, premium: 6800000 },
  { name: 'Resolution', policies: 22, premium: 4500000 },
];

const Reports = () => {
  return (
    <AppLayout title="Reports & Analytics" subtitle="Business intelligence and performance metrics">
      <div className="space-y-6 animate-fade-in">
        {/* Header Controls */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Select defaultValue="6m">
              <SelectTrigger className="w-40">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">Last Month</SelectItem>
                <SelectItem value="3m">Last 3 Months</SelectItem>
                <SelectItem value="6m">Last 6 Months</SelectItem>
                <SelectItem value="1y">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </div>
        </div>

        {/* KPI Summary */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="stat-card">
            <p className="text-sm text-muted-foreground">Total Premium (YTD)</p>
            <p className="text-3xl font-bold text-foreground mt-1">
              {formatCurrency(18100000)}
            </p>
            <p className="text-sm text-success mt-2">+24% vs last year</p>
          </div>
          <div className="stat-card">
            <p className="text-sm text-muted-foreground">Total Claims (YTD)</p>
            <p className="text-3xl font-bold text-foreground mt-1">
              {formatCurrency(11400000)}
            </p>
            <p className="text-sm text-warning mt-2">+18% vs last year</p>
          </div>
          <div className="stat-card">
            <p className="text-sm text-muted-foreground">Avg Loss Ratio</p>
            <p className="text-3xl font-bold text-foreground mt-1">63%</p>
            <p className="text-sm text-success mt-2">Target: &lt;65%</p>
          </div>
          <div className="stat-card">
            <p className="text-sm text-muted-foreground">Commission Earned</p>
            <p className="text-3xl font-bold text-foreground mt-1">
              {formatCurrency(905000)}
            </p>
            <p className="text-sm text-success mt-2">+32% vs last year</p>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Premium vs Claims */}
          <div className="stat-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-foreground">Premium vs Claims</h3>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={premiumData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => `${value / 1000000}M`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Bar dataKey="premium" name="Premium" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="claims" name="Claims" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Product Mix */}
          <div className="stat-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-foreground">Product Mix</h3>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={productMix}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {productMix.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Loss Ratio Trend */}
          <div className="stat-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-foreground">Loss Ratio Trend</h3>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={lossRatioData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    domain={[50, 80]}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`${value}%`, 'Loss Ratio']}
                  />
                  <Area
                    type="monotone"
                    dataKey="ratio"
                    stroke="hsl(217, 91%, 60%)"
                    fill="hsl(217, 91%, 60% / 0.2)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Provider Performance */}
          <div className="stat-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-foreground">Provider Performance</h3>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {providerPerformance.map((provider, index) => (
                <div key={provider.name} className="flex items-center gap-4">
                  <div className="w-8 text-sm font-medium text-muted-foreground">
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-foreground">{provider.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {provider.policies} policies
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{
                          width: `${(provider.premium / 12000000) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatCurrency(provider.premium)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Reports;
