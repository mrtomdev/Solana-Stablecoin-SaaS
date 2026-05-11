'use client';

import { TransactionTable } from '@/components/dashboard/TransactionTable';

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Transaction Log</h2>
      <TransactionTable />
    </div>
  );
}
