'use client';

import { PauseControls } from '@/components/dashboard/PauseControls';
import { CircuitBreakerConfig } from '@/components/dashboard/CircuitBreakerConfig';
import { PauseHistoryTable } from '@/components/dashboard/PauseHistoryTable';

export default function PausePage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Pause Controls</h2>
      <PauseControls />
      <CircuitBreakerConfig />
      <PauseHistoryTable />
    </div>
  );
}
