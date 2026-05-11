'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { usePauseHistory } from '@/hooks/usePause';

export function PauseHistoryTable() {
  const { data: history, isLoading } = usePauseHistory();
  const items = Array.isArray(history) ? history : [];

  if (isLoading) {
    return <Card><div className="h-48 animate-pulse rounded bg-gray-100" /></Card>;
  }

  return (
    <Card>
      <CardHeader><CardTitle>Pause History</CardTitle></CardHeader>
      {items.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b text-xs uppercase text-gray-500">
              <th className="pb-2 pr-4">Action</th>
              <th className="pb-2 pr-4">Scope</th>
              <th className="pb-2 pr-4">Reason</th>
              <th className="pb-2 pr-4">Wallet</th>
              <th className="pb-2">Date</th>
            </tr></thead>
            <tbody>
              {items.map((item: { id: string; action: string; scope: string; reason?: string; walletAddress: string; timestamp: string }) => (
                <tr key={item.id} className="border-b border-gray-50">
                  <td className="py-2 pr-4">
                    <span className={`rounded px-2 py-0.5 text-xs font-medium ${item.action === 'PAUSE' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {item.action}
                    </span>
                  </td>
                  <td className="py-2 pr-4 text-sm text-gray-700">{item.scope}</td>
                  <td className="py-2 pr-4 text-sm text-gray-500">{item.reason || '-'}</td>
                  <td className="py-2 pr-4 font-mono text-xs text-gray-400">{item.walletAddress.slice(0, 4)}...{item.walletAddress.slice(-4)}</td>
                  <td className="py-2 text-sm text-gray-500">{new Date(item.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-8 text-center text-sm text-gray-400">No pause history recorded yet</div>
      )}
    </Card>
  );
}
