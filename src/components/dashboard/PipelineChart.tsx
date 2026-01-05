import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { stage: 'Lead', count: 24, value: 12500000 },
  { stage: 'Qualified', count: 18, value: 9800000 },
  { stage: 'Quote', count: 15, value: 7200000 },
  { stage: 'Negotiation', count: 8, value: 4500000 },
  { stage: 'Won', count: 12, value: 8900000 },
];

const colors = [
  'hsl(215, 20%, 65%)',
  'hsl(199, 89%, 48%)',
  'hsl(217, 91%, 60%)',
  'hsl(38, 92%, 50%)',
  'hsl(158, 64%, 40%)',
];

export function PipelineChart() {
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-foreground">Sales Pipeline</h3>
        <select className="text-xs bg-secondary border-0 rounded-md px-2 py-1 text-muted-foreground">
          <option>This Month</option>
          <option>Last Month</option>
          <option>This Quarter</option>
        </select>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
            <XAxis type="number" tickFormatter={(value) => `${value}`} stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis type="category" dataKey="stage" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-lg)',
              }}
              formatter={(value: number) => [`${value} deals`, 'Count']}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
