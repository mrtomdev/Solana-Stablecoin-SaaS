'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToken } from '@/contexts/TokenContext';

export function usePegConfig() {
  const { mintAddress } = useToken();
  return useQuery({
    queryKey: ['pegConfig', mintAddress],
    queryFn: async () => {
      const res = await fetch(`/api/peg/config?mint=${mintAddress}`);
      if (!res.ok) throw new Error('Failed to fetch peg config');
      return res.json();
    },
    enabled: !!mintAddress,
  });
}

export function useUpdatePegConfig() {
  const qc = useQueryClient();
  const { mintAddress } = useToken();
  return useMutation({
    mutationFn: async (data: { targetPrice: number; deviationThreshold: number }) => {
      const res = await fetch('/api/peg/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mintAddress, ...data }),
      });
      if (!res.ok) throw new Error('Failed to update peg config');
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pegConfig', mintAddress] }),
  });
}

export function usePegHistory(days = 30) {
  const { mintAddress } = useToken();
  return useQuery({
    queryKey: ['pegHistory', mintAddress, days],
    queryFn: async () => {
      const res = await fetch(`/api/peg/history?mint=${mintAddress}&days=${days}`);
      if (!res.ok) throw new Error('Failed to fetch peg history');
      return res.json();
    },
    enabled: !!mintAddress,
    refetchInterval: 60000,
  });
}
