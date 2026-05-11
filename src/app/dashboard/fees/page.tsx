'use client';

import { FeeConfigPanel } from '@/components/dashboard/FeeConfigPanel';
import { FeeRevenueMonitor } from '@/components/dashboard/FeeRevenueMonitor';

export default function FeesPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Fee Configuration & Revenue</h2>
      <FeeConfigPanel />
      <FeeRevenueMonitor />
    </div>
  );
}
