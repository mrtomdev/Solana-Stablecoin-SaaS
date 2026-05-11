'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToken } from '@/contexts/TokenContext';
import { Button } from '@/components/ui/Button';

export default function Home() {
  const router = useRouter();
  const { mintAddress } = useToken();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-redirect if already configured
  useEffect(() => {
    if (mintAddress) {
      router.push('/dashboard');
    }
  }, [mintAddress, router]);

  if (mounted && mintAddress) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-pulse text-gray-400">Redirecting to dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="mx-auto max-w-4xl px-4 pt-24 pb-16 text-center">
        {/* Logo */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-200">
          <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
          StableMint
        </h1>
        <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
          Launch and manage fiat-backed stablecoins on Solana.
          Token-2022 with native metadata, zero dependencies.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <Button size="lg" onClick={() => router.push('/create')}>
            Create Stablecoin
          </Button>
          <Button size="lg" variant="secondary" onClick={() => router.push('/dashboard/settings')}>
            Connect Existing Token
          </Button>
        </div>

        {/* Feature cards */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            {
              title: 'Token-2022 Native',
              desc: 'Built on SPL Token-2022 with MetadataPointer extension. No Metaplex dependency needed.',
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
              ),
            },
            {
              title: 'Full Admin Control',
              desc: 'Mint, burn, freeze, thaw, and update metadata — all through a clean dashboard with audit logging.',
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
              ),
            },
            {
              title: 'Client-Side Signing',
              desc: 'All transactions signed in your wallet. No private keys stored server-side. Multi-sig ready with Squads.',
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              ),
            },
          ].map((feature) => (
            <div key={feature.title} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
                <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  {feature.icon}
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-1 text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
