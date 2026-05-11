'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToken } from '@/contexts/TokenContext';

export function useFeeConfig() {
  const { mintAddress } = useToken();
  return useQuery({
    queryKey: ['feeConfig', mintAddress],
    queryFn: async () => {
      const res = await fetch(`/api/fees/config?mint=${mintAddress}`);
      if (!res.ok) throw new Error('Failed to fetch fee config');
      return res.json();
    },
    enabled: !!mintAddress,
  });
}

export function useUpdateFeeConfig() {
  const qc = useQueryClient();
  const { mintAddress } = useToken();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch('/api/fees/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mintAddress, ...data }),
      });
      if (!res.ok) throw new Error('Failed to update fee config');
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['feeConfig', mintAddress] }),
  });
}

export function useFeeRevenue(days = 30) {
  const { mintAddress } = useToken();
  return useQuery({
    queryKey: ['feeRevenue', mintAddress, days],
    queryFn: async () => {
      const res = await fetch(`/api/fees/revenue?mint=${mintAddress}&days=${days}`);
      if (!res.ok) throw new Error('Failed to fetch fee revenue');
      return res.json();
    },
    enabled: !!mintAddress,
    refetchInterval: 60000,
  });
}
