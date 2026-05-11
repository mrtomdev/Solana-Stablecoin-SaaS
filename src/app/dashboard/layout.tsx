'use client';

import { ReactNode, useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
  { ssr: false }
);
import { Sidebar } from '@/components/Sidebar';
import { useToken } from '@/contexts/TokenContext';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { connected, connecting, wallet } = useWallet();
  const pathname = usePathname();
  const { mintAddress } = useToken();
  const { isMintAuthority, isFreezeAuthority, loading } = useAdminAuth();
  const [mounted, setMounted] = useState(false);
  const isSettingsPage = pathname === '/dashboard/settings';

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show spinner during SSR hydration or while wallet is auto-connecting
  if (!mounted || connecting) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600 mx-auto" />
          {connecting && <p className="mt-3 text-sm text-gray-500">Connecting wallet...</p>}
        </div>
      </div>
    );
  }

  if (!mintAddress && !isSettingsPage) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center animate-fade-in">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
            <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900">No Stablecoin Configured</h2>
          <p className="mt-1 text-sm text-gray-500">Create a new stablecoin or enter an existing mint address</p>
          <div className="mt-6 flex gap-3 justify-center">
            <a href="/create" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors">
              Create New Token
            </a>
            <a href="/dashboard/settings" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Enter Mint Address
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!connected && !isSettingsPage) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center animate-fade-in">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <svg className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Connect Your Wallet</h2>
          <p className="mt-1 text-sm text-gray-500 mb-6">Connect the wallet that holds mint authority</p>
          <WalletMultiButton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white/80 backdrop-blur-sm px-6 py-2.5">
          <div className="flex items-center gap-3">
            {mintAddress ? (
              <>
                <p className="text-xs text-gray-400 font-mono bg-gray-50 rounded-md px-2 py-1">
                  {mintAddress.slice(0, 16)}...{mintAddress.slice(-8)}
                </p>
                {!loading && (
                  <div className="flex gap-1.5">
                    {isMintAuthority && (
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700 ring-1 ring-green-600/20">
                        Mint Authority
                      </span>
                    )}
                    {isFreezeAuthority && (
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 ring-1 ring-blue-600/20">
                        Freeze Authority
                      </span>
                    )}
                    {!isMintAuthority && !isFreezeAuthority && (
                      <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-700 ring-1 ring-red-600/20">
                        Read-Only
                      </span>
                    )}
                  </div>
                )}
              </>
            ) : (
              <p className="text-xs text-gray-500">No token configured</p>
            )}
          </div>
          <WalletMultiButton />
        </div>

        {/* Content */}
        <div className="p-6 animate-fade-in">{children}</div>
      </main>
    </div>
  );
}
