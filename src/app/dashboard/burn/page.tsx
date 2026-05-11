'use client';

import { BurnForm } from '@/components/dashboard/BurnForm';

export default function BurnPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Burn Tokens</h2>
      <BurnForm />
    </div>
  );
}
