import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const demo = [
  { name: 'Apr 1, 2022', value: 0 },
  { name: 'Apr 5, 2022', value: 20000 },
  { name: 'Apr 10, 2022', value: 15000 },
  { name: 'Apr 15, 2022', value: 35000 },
  { name: 'Apr 20, 2022', value: 25000 },
  { name: 'Apr 25, 2022', value: 45000 },
  { name: 'Apr 30, 2022', value: 35000 },
  { name: 'May 5, 2022', value: 55000 },
  { name: 'May 10, 2022', value: 45000 },
  { name: 'May 15, 2022', value: 65000 },
  { name: 'May 20, 2022', value: 55000 },
  { name: 'May 25, 2022', value: 75000 },
  { name: 'May 30, 2022', value: 65000 },
];

export const RevenueChart = ({ data = demo }: { data: { name: string; value: number }[] }) => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6B7280' }}
            tickFormatter={value => {
              const date = new Date(value);
              return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }}
          />
          <YAxis hide />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#FF6B35"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, fill: '#FF6B35' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
