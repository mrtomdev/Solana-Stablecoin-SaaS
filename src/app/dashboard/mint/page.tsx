'use client';

import { MintForm } from '@/components/dashboard/MintForm';

export default function MintPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Mint Tokens</h2>
      <MintForm />
    </div>
  );
}
