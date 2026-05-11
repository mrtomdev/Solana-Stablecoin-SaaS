'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useFeeConfig, useUpdateFeeConfig } from '@/hooks/useFees';
import toast from 'react-hot-toast';

interface FeeRow {
  key: string;
  label: string;
  description: string;
  rateField: string;
  enabledField: string;
}

const FEE_ROWS: FeeRow[] = [
  { key: 'mint', label: 'Mint Fee', description: 'Fee charged when new tokens are minted', rateField: 'mintFee', enabledField: 'mintFeeEnabled' },
  { key: 'burn', label: 'Burn Fee', description: 'Fee charged when tokens are burned', rateField: 'burnFee', enabledField: 'burnFeeEnabled' },
  { key: 'transfer', label: 'Transfer Fee', description: 'Fee charged on token transfers', rateField: 'transferFee', enabledField: 'transferFeeEnabled' },
  { key: 'stability', label: 'Stability Fee', description: 'Ongoing fee for peg stability maintenance', rateField: 'stabilityFee', enabledField: 'stabilityFeeEnabled' },
  { key: 'liquidation', label: 'Liquidation Penalty', description: 'Penalty applied during liquidation events', rateField: 'liquidationPenalty', enabledField: 'liquidationPenaltyEnabled' },
];

export function FeeConfigPanel() {
  const { data: config, isLoading } = useFeeConfig();
  const updateConfig = useUpdateFeeConfig();

  const [form, setForm] = useState<Record<string, unknown>>({});
  const [collectorAddress, setCollectorAddress] = useState('');

  useEffect(() => {
    if (config) {
      const f: Record<string, unknown> = {};
      FEE_ROWS.forEach((row) => {
        f[row.rateField] = config[row.rateField] ?? 0;
        f[row.enabledField] = config[row.enabledField] ?? false;
      });
      setForm(f);
      setCollectorAddress(config.feeCollectorAddress ?? '');
    }
  }, [config]);

  const handleToggle = (field: string) => {
    setForm((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleRateChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  const handleSave = async () => {
    for (const row of FEE_ROWS) {
      const rate = form[row.rateField] as number;
      if (rate < 0 || rate > 100) {
        toast.error(`${row.label} must be between 0% and 100%`);
        return;
      }
    }
    if (collectorAddress && collectorAddress.length < 32) {
      toast.error('Invalid fee collector address');
      return;
    }
    try {
      await updateConfig.mutateAsync({ ...form, feeCollectorAddress: collectorAddress || null });
      toast.success('Fee configuration saved');
    } catch {
      toast.error('Failed to save fee configuration');
    }
  };

  if (isLoading) {
    return <Card><div className="h-64 animate-pulse rounded bg-gray-100" /></Card>;
  }

  return (
    <Card>
      <CardHeader><CardTitle>Fee Configuration</CardTitle></CardHeader>
      <div className="space-y-4">
        {FEE_ROWS.map((row) => (
          <div key={row.key} className="flex items-center gap-4 rounded-lg border border-gray-100 p-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{row.label}</p>
              <p className="text-xs text-gray-500">{row.description}</p>
            </div>
            <div className="w-28">
              <Input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={String(form[row.rateField] ?? 0)}
                onChange={(e) => handleRateChange(row.rateField, e.target.value)}
                placeholder="0.00"
              />
            </div>
            <span className="text-sm text-gray-500">%</span>
            <button
              type="button"
              onClick={() => handleToggle(row.enabledField)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${form[row.enabledField] ? 'bg-indigo-600' : 'bg-gray-200'}`}
            >
              <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform ${form[row.enabledField] ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        ))}

        <div className="border-t pt-4">
          <Input
            label="Fee Collector Address"
            placeholder="Solana wallet address to receive collected fees"
            value={collectorAddress}
            onChange={(e) => setCollectorAddress(e.target.value)}
          />
        </div>

        <Button onClick={handleSave} loading={updateConfig.isPending}>Save Fee Configuration</Button>
      </div>
    </Card>
  );
}
