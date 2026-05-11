'use client';

import { AnalyticsCards } from '@/components/dashboard/AnalyticsCards';
import { SupplyChart } from '@/components/dashboard/SupplyChart';
import { TransactionTable } from '@/components/dashboard/TransactionTable';
import { useTokenInfo } from '@/hooks/useTokenInfo';
import { useToken } from '@/contexts/TokenContext';
import { config } from '@/lib/config';

export default function DashboardPage() {
  const { mintAddress } = useToken();
  const { data: tokenInfo } = useTokenInfo();

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-sm text-gray-500 mt-0.5">Overview of your stablecoin</p>
        </div>
        {mintAddress && (
          <a
            href={`https://explorer.solana.com/address/${mintAddress}?cluster=${config.network}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            View on Explorer
          </a>
        )}
      </div>

      <AnalyticsCards />
      <SupplyChart />

      {/* Recent activity - only show last 5 */}
      <TransactionTable />
    </div>
  );
}
