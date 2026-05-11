'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useLiquidityConfig, useUpdateLiquidityConfig } from '@/hooks/useLiquidity';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

export function LiquidityPanel() {
  const { data: config, isLoading } = useLiquidityConfig();
  const updateConfig = useUpdateLiquidityConfig();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ totalLiquidity: '', reserveTarget: '', collateralRatio: '', reserveBalance: '' });

  const liquidity = config?.totalLiquidity ?? 0;
  const reserveTarget = config?.reserveTarget ?? 100;
  const ratio = config?.collateralRatio ?? 1.0;
  const reserve = config?.reserveBalance ?? 0;
  const healthPct = reserveTarget > 0 ? (reserve / reserveTarget) * 100 : 0;
  const healthLabel = healthPct >= 100 ? 'Healthy' : healthPct >= 80 ? 'Moderate' : 'Low';
  const healthColor = healthPct >= 100 ? 'green' : healthPct >= 80 ? 'amber' : 'red';

  const depthData = [
    { range: '-5%', depth: liquidity * 0.15 },
    { range: '-2%', depth: liquidity * 0.25 },
    { range: '-1%', depth: liquidity * 0.35 },
    { range: 'Peg', depth: liquidity * 0.5 },
    { range: '+1%', depth: liquidity * 0.35 },
    { range: '+2%', depth: liquidity * 0.25 },
    { range: '+5%', depth: liquidity * 0.15 },
  ];

  const handleSave = async () => {
    try {
      await updateConfig.mutateAsync({
        totalLiquidity: parseFloat(form.totalLiquidity) || liquidity,
        reserveTarget: parseFloat(form.reserveTarget) || reserveTarget,
        collateralRatio: parseFloat(form.collateralRatio) || ratio,
        reserveBalance: parseFloat(form.reserveBalance) || reserve,
      });
      toast.success('Liquidity configuration updated');
      setEditing(false);
    } catch {
      toast.error('Failed to update configuration');
    }
  };

  if (isLoading) {
    return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{[1, 2, 3, 4].map(i => <Card key={i}><div className="h-20 animate-pulse rounded bg-gray-100" /></Card>)}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Total Liquidity</p>
              <p className="text-xl font-bold text-gray-900">${liquidity.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
              <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Reserve Balance</p>
              <p className="text-xl font-bold text-gray-900">${reserve.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
              <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Collateral Ratio</p>
              <p className="text-xl font-bold text-gray-900">{(ratio * 100).toFixed(1)}%</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${healthColor === 'green' ? 'bg-green-100' : healthColor === 'amber' ? 'bg-amber-100' : 'bg-red-100'}`}>
              <svg className={`h-5 w-5 ${healthColor === 'green' ? 'text-green-600' : healthColor === 'amber' ? 'text-amber-600' : 'text-red-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Reserve Health</p>
              <p className={`text-xl font-bold ${healthColor === 'green' ? 'text-green-600' : healthColor === 'amber' ? 'text-amber-600' : 'text-red-600'}`}>{healthLabel}</p>
              <p className="text-xs text-gray-400">{healthPct.toFixed(1)}% of target</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Liquidity Depth Chart */}
      <Card>
        <CardHeader><CardTitle>Liquidity Depth</CardTitle></CardHeader>
        {liquidity > 0 ? (
          <ResponsiveContainer width="100%" height={256}>
            <BarChart data={depthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="range" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => [`$${Number(value ?? 0).toLocaleString()}`, 'Depth']} />
              <Bar dataKey="depth" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-64 items-center justify-center text-sm text-gray-400">Configure liquidity to view depth chart</div>
        )}
      </Card>

      {/* Configuration */}
      <Card>
        <CardHeader><CardTitle>Liquidity Configuration</CardTitle></CardHeader>
        {editing ? (
          <div className="space-y-4">
            <Input label="Total Liquidity ($)" type="number" value={form.totalLiquidity || String(liquidity)} onChange={(e) => setForm({ ...form, totalLiquidity: e.target.value })} />
            <Input label="Reserve Balance ($)" type="number" value={form.reserveBalance || String(reserve)} onChange={(e) => setForm({ ...form, reserveBalance: e.target.value })} />
            <Input label="Reserve Target ($)" type="number" value={form.reserveTarget || String(reserveTarget)} onChange={(e) => setForm({ ...form, reserveTarget: e.target.value })} />
            <Input label="Collateral Ratio (0-2)" type="number" step="0.01" value={form.collateralRatio || String(ratio)} onChange={(e) => setForm({ ...form, collateralRatio: e.target.value })} />
            <div className="flex gap-2">
              <Button onClick={handleSave} loading={updateConfig.isPending}>Save</Button>
              <Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-between text-sm"><span className="text-gray-500">Total Liquidity</span><span className="font-medium">${liquidity.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Reserve Balance</span><span className="font-medium">${reserve.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Reserve Target</span><span className="font-medium">${reserveTarget.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Collateral Ratio</span><span className="font-medium">{(ratio * 100).toFixed(1)}%</span></div>
            <Button variant="secondary" size="sm" onClick={() => setEditing(true)} className="mt-3">Edit Configuration</Button>
          </div>
        )}
      </Card>
    </div>
  );
}
