'use client';

import { Card } from '@/components/ui/Card';
import { useTokenInfo, useHolders } from '@/hooks/useTokenInfo';
import clsx from 'clsx';

interface StatCardProps {
  label: string;
  value: string;
  sub: string;
  color: 'indigo' | 'green' | 'amber' | 'blue';
  icon: React.ReactNode;
}

function StatCard({ label, value, sub, color, icon }: StatCardProps) {
  const colorMap = {
    indigo: 'bg-indigo-50 text-indigo-600',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
    blue: 'bg-blue-50 text-blue-600',
  };

  return (
    <Card className="animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
          <p className="mt-1 text-xs text-gray-400">{sub}</p>
        </div>
        <div className={clsx('rounded-lg p-2.5', colorMap[color])}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

export function AnalyticsCards() {
  const { data: tokenInfo, isLoading } = useTokenInfo();
  const { data: holdersData } = useHolders();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="flex items-start justify-between">
              <div>
                <div className="h-3 w-20 bg-gray-200 rounded mb-3" />
                <div className="h-7 w-28 bg-gray-200 rounded mb-2" />
                <div className="h-3 w-16 bg-gray-100 rounded" />
              </div>
              <div className="h-10 w-10 bg-gray-100 rounded-lg" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!tokenInfo) return null;

  const supplyRaw = BigInt(tokenInfo.supply || '0');
  const decimals = tokenInfo.decimals || 6;
  const divisor = BigInt(10 ** decimals);
  const supplyWhole = Number(supplyRaw / divisor);
  const supplyFormatted = supplyWhole.toLocaleString();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total Supply"
        value={supplyFormatted}
        sub={`${decimals} decimals`}
        color="indigo"
        icon={
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
      <StatCard
        label="Holders"
        value={holdersData?.count?.toLocaleString() || '0'}
        sub="unique wallets"
        color="green"
        icon={
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
        }
      />
      <StatCard
        label="Mint Authority"
        value={tokenInfo.mintAuthority ? `${tokenInfo.mintAuthority.slice(0, 4)}...${tokenInfo.mintAuthority.slice(-4)}` : 'Revoked'}
        sub={tokenInfo.mintAuthority ? 'Active' : 'Permanently disabled'}
        color="amber"
        icon={
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
          </svg>
        }
      />
      <StatCard
        label="Freeze Authority"
        value={tokenInfo.freezeAuthority ? `${tokenInfo.freezeAuthority.slice(0, 4)}...${tokenInfo.freezeAuthority.slice(-4)}` : 'Revoked'}
        sub={tokenInfo.freezeAuthority ? 'Active' : 'Permanently disabled'}
        color="blue"
        icon={
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
        }
      />
    </div>
  );
}
