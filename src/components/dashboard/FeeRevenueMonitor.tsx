'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { useFeeRevenue } from '@/hooks/useFees';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const FEE_COLORS: Record<string, string> = {
  MINT: '#4f46e5',
  BURN: '#ef4444',
  TRANSFER: '#10b981',
  STABILITY: '#f59e0b',
  LIQUIDATION: '#8b5cf6',
};

export function FeeRevenueMonitor() {
  const { data: revenue, isLoading } = useFeeRevenue(30);

  const revenueArr = Array.isArray(revenue) ? revenue : [];
  const totalRevenue = revenueArr.reduce((sum: number, r: { amount: number }) => sum + r.amount, 0);

  // Group by fee type for pie chart
  const byType: Record<string, number> = {};
  revenueArr.forEach((r: { feeType: string; amount: number }) => {
    byType[r.feeType] = (byType[r.feeType] || 0) + r.amount;
  });
  const pieData = Object.entries(byType).map(([name, value]) => ({ name, value }));

  // Group by date for area chart
  const byDate: Record<string, number> = {};
  revenueArr.forEach((r: { timestamp: string; amount: number }) => {
    const date = new Date(r.timestamp).toLocaleDateString();
    byDate[date] = (byDate[date] || 0) + r.amount;
  });
  const areaData = Object.entries(byDate).map(([date, amount]) => ({ date, amount }));

  if (isLoading) {
    return <Card><div className="h-64 animate-pulse rounded bg-gray-100" /></Card>;
  }

  return (
    <div className="space-y-6">
      {/* Total Revenue */}
      <Card>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Total Fee Revenue (30d)</p>
            <p className="text-3xl font-bold text-gray-900">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Pie Chart */}
        <Card>
          <CardHeader><CardTitle>Revenue by Fee Type</CardTitle></CardHeader>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={256}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value" label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                  {pieData.map((entry) => <Cell key={entry.name} fill={FEE_COLORS[entry.name] || '#6b7280'} />)}
                </Pie>
                <Tooltip formatter={(value) => `$${Number(value ?? 0).toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-64 items-center justify-center text-sm text-gray-400">No fee revenue data yet</div>
          )}
        </Card>

        {/* Area Chart */}
        <Card>
          <CardHeader><CardTitle>Revenue Over Time</CardTitle></CardHeader>
          {areaData.length > 0 ? (
            <ResponsiveContainer width="100%" height={256}>
              <AreaChart data={areaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => [`$${Number(value ?? 0).toFixed(2)}`, 'Revenue']} />
                <Area type="monotone" dataKey="amount" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-64 items-center justify-center text-sm text-gray-400">No fee revenue data yet</div>
          )}
        </Card>
      </div>

      {/* Recent Fee Collections Table */}
      <Card>
        <CardHeader><CardTitle>Recent Fee Collections</CardTitle></CardHeader>
        {revenueArr.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className="border-b text-xs uppercase text-gray-500">
                <th className="pb-2 pr-4">Type</th>
                <th className="pb-2 pr-4">Amount</th>
                <th className="pb-2 pr-4">Signature</th>
                <th className="pb-2">Date</th>
              </tr></thead>
              <tbody>
                {revenueArr.slice(-20).reverse().map((r: { id: string; feeType: string; amount: number; signature?: string; timestamp: string }) => (
                  <tr key={r.id} className="border-b border-gray-50">
                    <td className="py-2 pr-4"><span className="rounded px-2 py-0.5 text-xs font-medium" style={{ backgroundColor: `${FEE_COLORS[r.feeType] || '#6b7280'}20`, color: FEE_COLORS[r.feeType] || '#6b7280' }}>{r.feeType}</span></td>
                    <td className="py-2 pr-4 font-medium">${r.amount.toFixed(2)}</td>
                    <td className="py-2 pr-4 font-mono text-xs text-gray-400">{r.signature ? `${r.signature.slice(0, 8)}...` : '-'}</td>
                    <td className="py-2 text-gray-500">{new Date(r.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-sm text-gray-400">No fee collections recorded yet</div>
        )}
      </Card>
    </div>
  );
}
