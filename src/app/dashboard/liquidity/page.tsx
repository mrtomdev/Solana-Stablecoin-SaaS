'use client';

import { LiquidityPanel } from '@/components/dashboard/LiquidityPanel';

export default function LiquidityPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Liquidity Monitor</h2>
      <LiquidityPanel />
    </div>
  );
}
