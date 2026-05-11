'use client';

import { ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { WalletProvider } from '@/contexts/WalletProvider';
import { TokenProvider } from '@/contexts/TokenContext';
import { ConfigProvider } from '@/contexts/ConfigContext';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,
            retry: 2,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <ConfigProvider>
          <TokenProvider>
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 4000,
                style: {
                  borderRadius: '12px',
                  background: '#1e293b',
                  color: '#f1f5f9',
                  fontSize: '14px',
                },
                success: { iconTheme: { primary: '#22c55e', secondary: '#f1f5f9' } },
                error: { iconTheme: { primary: '#ef4444', secondary: '#f1f5f9' } },
              }}
            />
          </TokenProvider>
        </ConfigProvider>
      </WalletProvider>
    </QueryClientProvider>
  );
}
