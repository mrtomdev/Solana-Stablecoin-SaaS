'use client';

import { useQuery } from '@tanstack/react-query';
import { useToken } from '@/contexts/TokenContext';

export function useTokenInfo() {
  const { mintAddress } = useToken();

  return useQuery({
    queryKey: ['tokenInfo', mintAddress],
    queryFn: async () => {
      if (!mintAddress) return null;
      const res = await fetch(`/api/token/info?mint=${mintAddress}`);
      if (!res.ok) throw new Error('Failed to fetch token info');
      return res.json();
    },
    enabled: !!mintAddress,
    refetchInterval: 30000,
  });
}

export function useHolders() {
  const { mintAddress } = useToken();

  return useQuery({
    queryKey: ['holders', mintAddress],
    queryFn: async () => {
      if (!mintAddress) return null;
      const res = await fetch(`/api/token/holders?mint=${mintAddress}`);
      if (!res.ok) throw new Error('Failed to fetch holders');
      return res.json();
    },
    enabled: !!mintAddress,
    refetchInterval: 60000,
  });
}

export function useSupplyHistory(days = 30) {
  const { mintAddress } = useToken();

  return useQuery({
    queryKey: ['supplyHistory', mintAddress, days],
    queryFn: async () => {
      if (!mintAddress) return [];
      const res = await fetch(`/api/analytics/supply?mint=${mintAddress}&days=${days}`);
      if (!res.ok) throw new Error('Failed to fetch supply history');
      return res.json();
    },
    enabled: !!mintAddress,
  });
}
