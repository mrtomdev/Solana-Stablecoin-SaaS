'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useCircuitBreaker, useUpdateCircuitBreaker } from '@/hooks/usePause';
import toast from 'react-hot-toast';

export function CircuitBreakerConfig() {
  const { data: config, isLoading } = useCircuitBreaker();
  const updateConfig = useUpdateCircuitBreaker();

  const [threshold, setThreshold] = useState('10');
  const [timeWindow, setTimeWindow] = useState('60');
  const [autoEnabled, setAutoEnabled] = useState(false);

  useEffect(() => {
    if (config) {
      setThreshold(String(config.supplyChangeThreshold ?? 10));
      setTimeWindow(String(config.timeWindowMinutes ?? 60));
      setAutoEnabled(config.autoPauseEnabled ?? false);
    }
  }, [config]);

  const handleSave = async () => {
    const t = parseFloat(threshold);
    const w = parseInt(timeWindow);
    if (isNaN(t) || t <= 0 || t > 100) {
      toast.error('Threshold must be between 0 and 100%');
      return;
    }
    if (isNaN(w) || w < 1) {
      toast.error('Time window must be at least 1 minute');
      return;
    }
    try {
      await updateConfig.mutateAsync({ supplyChangeThreshold: t, timeWindowMinutes: w, autoPauseEnabled: autoEnabled });
      toast.success('Circuit breaker configuration saved');
    } catch {
      toast.error('Failed to save configuration');
    }
  };

  if (isLoading) {
    return <Card><div className="h-32 animate-pulse rounded bg-gray-100" /></Card>;
  }

  return (
    <Card>
      <CardHeader><CardTitle>Circuit Breaker</CardTitle></CardHeader>
      <p className="mb-4 text-xs text-gray-500">Automatically pause operations if supply changes exceed thresholds within a time window.</p>
      <div className="space-y-4">
        <Input label="Supply Change Threshold (%)" type="number" step="0.1" min="0" max="100" value={threshold} onChange={(e) => setThreshold(e.target.value)} />
        <Input label="Time Window (minutes)" type="number" min="1" value={timeWindow} onChange={(e) => setTimeWindow(e.target.value)} />
        <div className="flex items-center justify-between rounded-lg border border-gray-100 p-4">
          <div>
            <p className="text-sm font-medium text-gray-900">Auto-Pause</p>
            <p className="text-xs text-gray-500">Automatically pause all operations when threshold is breached</p>
          </div>
          <button
            type="button"
            onClick={() => setAutoEnabled(!autoEnabled)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${autoEnabled ? 'bg-indigo-600' : 'bg-gray-200'}`}
          >
            <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform ${autoEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>
        <Button onClick={handleSave} loading={updateConfig.isPending}>Save Circuit Breaker Config</Button>
      </div>
    </Card>
  );
}
