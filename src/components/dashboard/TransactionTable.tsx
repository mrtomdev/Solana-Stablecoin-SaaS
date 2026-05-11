'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { useTransactionLog } from '@/hooks/useTransactionLog';
import { useConfig } from '@/contexts/ConfigContext';
import clsx from 'clsx';

const actionConfig: Record<string, { bg: string; text: string; label: string }> = {
  CREATE: { bg: 'bg-purple-50', text: 'text-purple-700', label: 'Created' },
  MINT: { bg: 'bg-green-50', text: 'text-green-700', label: 'Minted' },
  BURN: { bg: 'bg-red-50', text: 'text-red-700', label: 'Burned' },
  FREEZE: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Frozen' },
  THAW: { bg: 'bg-cyan-50', text: 'text-cyan-700', label: 'Thawed' },
  UPDATE_METADATA: { bg: 'bg-yellow-50', text: 'text-yellow-700', label: 'Updated' },
};

export function TransactionTable() {
  const { data: transactions, isLoading } = useTransactionLog();
  const config = useConfig();
  const [filter, setFilter] = useState<string>('ALL');

  const filtered = filter === 'ALL'
    ? transactions
    : transactions?.filter((tx: any) => tx.action === filter);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Admin Actions</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Complete audit log of all administrative operations</p>
          </div>
          <span className="text-xs text-gray-400">{transactions?.length || 0} total</span>
        </div>
      </CardHeader>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-4 flex-wrap">
        {['ALL', 'MINT', 'BURN', 'FREEZE', 'THAW', 'CREATE'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={clsx(
              'rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
              filter === f ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            )}
          >
            {f === 'ALL' ? 'All' : actionConfig[f]?.label || f}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-50 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : !filtered || filtered.length === 0 ? (
        <div className="py-12 text-center">
          <svg className="mx-auto h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <p className="mt-2 text-sm text-gray-400">No actions recorded yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50/50">
                <th className="px-6 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                <th className="px-6 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wallet</th>
                <th className="px-6 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Signature</th>
                <th className="px-6 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((tx: any) => {
                const ac = actionConfig[tx.action] || { bg: 'bg-gray-50', text: 'text-gray-700', label: tx.action };
                const details = tx.details ? JSON.parse(tx.details) : null;
                return (
                  <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-3">
                      <span className={clsx('inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ring-current/10', ac.bg, ac.text)}>
                        {ac.label}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-xs text-gray-600 max-w-[200px] truncate">
                      {details?.amount && `Amount: ${details.amount}`}
                      {details?.destination && ` → ${details.destination.slice(0, 8)}...`}
                      {details?.targetAddress && `Target: ${details.targetAddress.slice(0, 8)}...`}
                      {details?.field && `${details.field}: ${details.value}`}
                      {!details && '-'}
                    </td>
                    <td className="px-6 py-3 font-mono text-xs text-gray-500">
                      {tx.walletAddress?.slice(0, 4)}...{tx.walletAddress?.slice(-4)}
                    </td>
                    <td className="px-6 py-3">
                      {tx.signature ? (
                        <a
                          href={`https://explorer.solana.com/tx/${tx.signature}?cluster=${config.network}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-xs text-indigo-600 hover:text-indigo-800 hover:underline"
                        >
                          {tx.signature.slice(0, 8)}...{tx.signature.slice(-4)}
                        </a>
                      ) : (
                        <span className="text-xs text-gray-300">-</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-xs text-gray-400 whitespace-nowrap">
                      {new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
