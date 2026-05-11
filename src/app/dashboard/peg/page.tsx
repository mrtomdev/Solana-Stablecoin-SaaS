'use client';

import { PegMonitor } from '@/components/dashboard/PegMonitor';

export default function PegPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Peg Stability Monitor</h2>
      <PegMonitor />
    </div>
  );
}
