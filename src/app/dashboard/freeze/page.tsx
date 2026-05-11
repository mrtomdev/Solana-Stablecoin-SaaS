'use client';

import { FreezeForm } from '@/components/dashboard/FreezeForm';

export default function FreezePage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Freeze / Thaw Accounts</h2>
      <FreezeForm />
    </div>
  );
}
