'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { useSupplyHistory } from '@/hooks/useTokenInfo';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function SupplyChart() {
  const { data, isLoading } = useSupplyHistory();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supply Over Time</CardTitle>
      </CardHeader>
      {isLoading ? (
        <div className="h-64 animate-pulse bg-gray-100 rounded" />
      ) : !data || data.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-400">
          No supply data yet. Mint some tokens to get started.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={256}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(v) => new Date(v).toLocaleDateString()}
              fontSize={12}
            />
            <YAxis fontSize={12} />
            <Tooltip
              labelFormatter={(v) => new Date(v).toLocaleString()}
              formatter={(v) => [(v as number).toLocaleString(), 'Supply']}
            />
            <Line type="monotone" dataKey="supply" stroke="#4f46e5" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
