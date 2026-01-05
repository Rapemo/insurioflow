import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'Approved', value: 35, color: 'hsl(158, 64%, 40%)' },
  { name: 'Under Review', value: 28, color: 'hsl(38, 92%, 50%)' },
  { name: 'Submitted', value: 22, color: 'hsl(199, 89%, 48%)' },
  { name: 'Rejected', value: 8, color: 'hsl(0, 84%, 60%)' },
  { name: 'Paid', value: 52, color: 'hsl(173, 80%, 40%)' },
];

export function ClaimsOverview() {
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Claims Overview</h3>
        <select className="text-xs bg-secondary border-0 rounded-md px-2 py-1 text-muted-foreground">
          <option>This Month</option>
          <option>Last Month</option>
          <option>This Quarter</option>
        </select>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
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
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4">
        <div>
          <p className="text-2xl font-bold text-foreground">145</p>
          <p className="text-xs text-muted-foreground">Total Claims</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">62.4%</p>
          <p className="text-xs text-muted-foreground">Loss Ratio</p>
        </div>
      </div>
    </div>
  );
}
