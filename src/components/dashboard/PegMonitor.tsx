'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { usePegConfig, useUpdatePegConfig, usePegHistory } from '@/hooks/usePeg';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

export function PegMonitor() {
  const { data: config, isLoading: configLoading } = usePegConfig();
  const { data: history, isLoading: historyLoading } = usePegHistory(30);
  const updateConfig = useUpdatePegConfig();

  const [targetPrice, setTargetPrice] = useState('');
  const [threshold, setThreshold] = useState('');
  const [editing, setEditing] = useState(false);

  const currentPrice = history?.length > 0 ? history[history.length - 1].price : config?.targetPrice ?? 1.0;
  const target = config?.targetPrice ?? 1.0;
  const devThreshold = config?.deviationThreshold ?? 0.02;
  const deviation = Math.abs((currentPrice - target) / target);
  const deviationPct = (deviation * 100).toFixed(3);

  const stabilityScore = deviation < devThreshold / 2 ? 'STABLE' : deviation < devThreshold ? 'WARNING' : 'CRITICAL';
  const scoreColor = stabilityScore === 'STABLE' ? 'green' : stabilityScore === 'WARNING' ? 'amber' : 'red';

  const handleSaveConfig = async () => {
    const tp = parseFloat(targetPrice || String(target));
    const dt = parseFloat(threshold || String(devThreshold));
    if (isNaN(tp) || isNaN(dt) || tp <= 0 || dt <= 0 || dt >= 1) {
      toast.error('Invalid values. Threshold must be between 0 and 1.');
      return;
    }
    try {
      await updateConfig.mutateAsync({ targetPrice: tp, deviationThreshold: dt });
      toast.success('Peg configuration updated');
      setEditing(false);
    } catch {
      toast.error('Failed to update configuration');
    }
  };

  if (configLoading) {
    return <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">{[1, 2, 3].map(i => <Card key={i}><div className="h-24 animate-pulse rounded bg-gray-100" /></Card>)}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
              <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Current Price</p>
              <p className="text-2xl font-bold text-gray-900">${currentPrice.toFixed(4)}</p>
              <p className="text-xs text-gray-400">Target: ${target.toFixed(4)}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-${scoreColor}-100`}>
              <svg className={`h-5 w-5 text-${scoreColor}-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Deviation</p>
              <p className="text-2xl font-bold text-gray-900">{deviationPct}%</p>
              <p className="text-xs text-gray-400">Threshold: {(devThreshold * 100).toFixed(1)}%</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stabilityScore === 'STABLE' ? 'bg-green-100' : stabilityScore === 'WARNING' ? 'bg-amber-100' : 'bg-red-100'}`}>
              <svg className={`h-5 w-5 ${stabilityScore === 'STABLE' ? 'text-green-600' : stabilityScore === 'WARNING' ? 'text-amber-600' : 'text-red-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Stability Score</p>
              <p className={`text-2xl font-bold ${stabilityScore === 'STABLE' ? 'text-green-600' : stabilityScore === 'WARNING' ? 'text-amber-600' : 'text-red-600'}`}>{stabilityScore}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Peg History Chart */}
      <Card>
        <CardHeader><CardTitle>Peg History (30 Days)</CardTitle></CardHeader>
        {historyLoading ? (
          <div className="h-64 animate-pulse rounded bg-gray-100" />
        ) : history?.length > 0 ? (
          <ResponsiveContainer width="100%" height={256}>
            <AreaChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="timestamp" tickFormatter={(v: string) => new Date(v).toLocaleDateString()} tick={{ fontSize: 12 }} />
              <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12 }} />
              <Tooltip labelFormatter={(v) => new Date(String(v)).toLocaleString()} formatter={(value) => [`$${Number(value ?? 0).toFixed(4)}`, 'Price']} />
              <Area type="monotone" dataKey="price" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-64 items-center justify-center text-sm text-gray-400">No peg history data yet</div>
        )}
      </Card>

      {/* Configuration */}
      <Card>
        <CardHeader><CardTitle>Peg Configuration</CardTitle></CardHeader>
        {editing ? (
          <div className="space-y-4">
            <Input label="Target Price ($)" type="number" step="0.0001" value={targetPrice || String(target)} onChange={(e) => setTargetPrice(e.target.value)} />
            <Input label="Deviation Threshold (0-1)" type="number" step="0.001" value={threshold || String(devThreshold)} onChange={(e) => setThreshold(e.target.value)} />
            <div className="flex gap-2">
              <Button onClick={handleSaveConfig} loading={updateConfig.isPending}>Save</Button>
              <Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-between text-sm"><span className="text-gray-500">Target Price</span><span className="font-medium">${target.toFixed(4)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Deviation Threshold</span><span className="font-medium">{(devThreshold * 100).toFixed(1)}%</span></div>
            <Button variant="secondary" size="sm" onClick={() => setEditing(true)} className="mt-3">Edit Configuration</Button>
          </div>
        )}
      </Card>
    </div>
  );
}
